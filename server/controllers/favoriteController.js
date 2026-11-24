const { Favorite, Shop } = require('../models');

exports.toggleFavorite = async (req, res) => {
  try {
    const { shopId } = req.body;
    const userId = req.user.id;

    const existing = await Favorite.findOne({ where: { userId, shopId } });

    if (existing) {
      await existing.destroy();
      return res.json({ isFavorite: false, message: 'Removed from favorites' });
    }

    await Favorite.create({ userId, shopId });
    res.status(201).json({ isFavorite: true, message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle favorite', error: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [{ model: Shop }]
    });
    res.json({ favorites: favorites.map(f => f.Shop) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch favorites', error: error.message });
  }
};
