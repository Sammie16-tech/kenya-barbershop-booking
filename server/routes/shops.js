const express = require('express');
const router = express.Router();
const { Shop, Service, Staff, Review } = require('../models');

const { Op } = require('sequelize');

// Get all shops with filtering
router.get('/', async (req, res) => {
  try {
    const { city, constituency, service, search } = req.query;
    let where = { isActive: true };

    if (city) {
      where.city = { [Op.iLike]: `%${city}%` };
    }

    if (constituency) {
      where.constituency = { [Op.iLike]: `%${constituency}%` };
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const include = [
      { model: Staff }
    ];

    if (service) {
      include.push({
        model: Service,
        where: { name: { [Op.iLike]: `%${service}%` } },
        required: true
      });
    } else {
      include.push({ model: Service });
    }

    const shops = await Shop.findAll({
      where,
      include,
      order: [
        ['isFeatured', 'DESC'],
        ['rating', 'DESC']
      ]
    });
    res.json({ shops });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shops', error: error.message });
  }
});

// Get shop by ID
router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id, {
      include: [
        { model: Service },
        { model: Staff },
        { model: Review, include: ['User'] }
      ]
    });
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json({ shop });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shop details', error: error.message });
  }
});

module.exports = router;
