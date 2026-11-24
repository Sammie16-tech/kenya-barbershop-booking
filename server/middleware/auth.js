const supabase = require('../utils/supabase');
const { User } = require('../models');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    // Verify token with Supabase
    const { data: { user: authUser }, error } = await supabase.auth.getUser(token);
    
    if (error || !authUser) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Fetch full user profile from local database
    const user = await User.findByPk(authUser.id);
    req.user = user || { id: authUser.id, ...authUser.user_metadata };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};
