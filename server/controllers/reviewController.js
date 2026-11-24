const { Review, Shop, User, Appointment } = require('../models');

exports.createReview = async (req, res) => {
  try {
    const { shopId, rating, comment } = req.body;
    const clientId = req.user.id;

    // Check if the user has a completed appointment at this shop
    const hasCompletedAppointment = await Appointment.findOne({
      where: {
        clientId,
        shopId,
        status: 'completed'
      }
    });

    if (!hasCompletedAppointment) {
      return res.status(403).json({ message: 'You must have a completed appointment at this shop to leave a review.' });
    }

    // Check if the user already reviewed this shop
    const existingReview = await Review.findOne({
      where: { clientId, shopId }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this shop.' });
    }

    const review = await Review.create({
      clientId,
      shopId,
      rating,
      comment
    });

    // Update shop's average rating
    const shop = await Shop.findByPk(shopId);
    const reviews = await Review.findAll({ where: { shopId } });
    
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    shop.rating = averageRating.toFixed(1);
    shop.totalReviews = reviews.length;
    await shop.save();

    const reviewWithUser = await Review.findByPk(review.id, {
      include: [{ model: User, attributes: ['firstName', 'lastName', 'profilePicture'] }]
    });

    res.status(201).json({ message: 'Review submitted successfully', review: reviewWithUser });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Failed to submit review', error: error.message });
  }
};

exports.getShopReviews = async (req, res) => {
  try {
    const { shopId } = req.params;
    const reviews = await Review.findAll({
      where: { shopId },
      include: [{ model: User, attributes: ['firstName', 'lastName', 'profilePicture'] }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};
