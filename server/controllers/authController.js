const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { User, Notification } = require('../models');
const { validationResult } = require('express-validator');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

const supabase = require('../utils/supabase');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber, role, referralCode } = req.body;

    // 1. Register in Supabase Auth
    let authData = { user: { id: null }, session: { access_token: null } };
    const { data: supabaseData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { firstName, lastName, role: role || 'client' }
      }
    });

    if (authError) {
      if (authError.message.toLowerCase().includes('rate limit')) {
        console.warn('Supabase rate limit hit. Falling back to local registration.');
        const { v4: uuidv4 } = require('uuid');
        authData.user.id = uuidv4();
      } else {
        throw authError;
      }
    } else {
      authData = supabaseData;
    }
    let referredById = null;
    if (referralCode) {
      const referrer = await User.findOne({ where: { referralCode } });
      if (referrer) {
        referredById = referrer.id;
        // Award reward to referrer
        referrer.referralCount += 1;
        referrer.referralRewards += 1;
        await referrer.save();

        // Create Notification
        await Notification.create({
          userId: referrer.id,
          title: 'Referral Reward! 🎁',
          message: `Great news! Your friend ${firstName} joined Kenya Barbers using your code. You've earned 1 reward point!`,
          type: 'referral_reward'
        });
      }
    }

    // 2. Sync with local database (optional, for relationships)
    const user = await User.create({
      id: authData.user.id, // Use Supabase UUID
      email,
      password, // We still hash locally as fallback or for other uses, but Supabase is primary
      firstName,
      lastName,
      phoneNumber,
      role: role || 'client',
      referredBy: referredById
    });

    const jwtToken = authData.session?.access_token || generateToken(user);

    res.status(201).json({ 
      message: 'Registration successful', 
      user, 
      token: jwtToken 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({ message: authError.message });
    }

    // 2. Fetch local user data
    const user = await User.findOne({ where: { email } });
    
    if (user) {
      user.lastLogin = new Date();
      await user.save();
    }

    res.json({ 
      message: 'Login successful', 
      user, 
      token: authData.session.access_token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, given_name: firstName, family_name: lastName, picture: profilePicture } = payload;

    let user = await User.findOne({ where: { googleId } });

    if (!user) {
      user = await User.findOne({ where: { email } });
      if (user) {
        user.googleId = googleId;
        user.profilePicture = profilePicture;
        await user.save();
      } else {
        user = await User.create({
          googleId, email, firstName, lastName, profilePicture,
          role: 'client', phoneNumber: '0700000000'
        });
      }
    }

    const jwtToken = generateToken(user);
    res.json({ message: 'Google authentication successful', user, token: jwtToken });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Google authentication failed', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, profilePicture } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.profilePicture = profilePicture || user.profilePicture;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

const storageService = require('../utils/storageService');

exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const publicUrl = await storageService.uploadFile(req.file.buffer, req.file.originalname, 'profiles');
    
    const user = await User.findByPk(req.user.id);
    user.profilePicture = publicUrl;
    await user.save();

    res.json({ message: 'Profile picture updated', profilePicture: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload profile picture', error: error.message });
  }
};