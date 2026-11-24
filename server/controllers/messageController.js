const { Message, User } = require('../models');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      content
    });

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all users the current user has messaged or received messages from
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }]
      },
      order: [['createdAt', 'DESC']]
    });

    const userIds = new Set();
    messages.forEach(m => {
      if (m.senderId !== userId) userIds.add(m.senderId);
      if (m.receiverId !== userId) userIds.add(m.receiverId);
    });

    const conversations = [];
    for (const otherUserId of userIds) {
      const user = await User.findByPk(otherUserId, {
        attributes: ['id', 'firstName', 'lastName', 'profilePicture', 'role']
      });
      const lastMessage = messages.find(m => 
        (m.senderId === otherUserId || m.receiverId === otherUserId)
      );
      
      const unreadCount = messages.filter(m => 
        m.senderId === otherUserId && m.receiverId === userId && !m.isRead
      ).length;

      conversations.push({
        user,
        lastMessage,
        unreadCount
      });
    }

    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch conversations', error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user.id;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      },
      order: [['createdAt', 'ASC']]
    });

    // Mark as read
    await Message.update(
      { isRead: true },
      { where: { senderId: otherUserId, receiverId: userId, isRead: false } }
    );

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
};
