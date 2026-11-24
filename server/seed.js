const { sequelize, User, Shop, Service, Staff, Appointment } = require('./models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create Owner
    const password = 'Password123!';
    const owner = await User.create({
      firstName: 'Samuel',
      lastName: 'Owner',
      email: 'samuel@example.com',
      password,
      role: 'shop_owner',
      phoneNumber: '0712345678'
    });

    // Create Shop
    const shop = await Shop.create({
      ownerId: owner.id,
      name: 'Luxury Kenyan Cuts',
      description: 'The best barbershop in Nairobi with premium services and experienced staff.',
      address: 'Westlands Mall, 2nd Floor',
      city: 'Nairobi',
      latitude: -1.2644,
      longitude: 36.8044,
      phoneNumber: '0711223344',
      rating: 4.9,
      totalReviews: 120
    });

    // Create Staff
    const staff1 = await Staff.create({
      shopId: shop.id,
      firstName: 'John',
      lastName: 'Kamau',
      role: 'Master Barber',
      rating: 4.9
    });

    const staff2 = await Staff.create({
      shopId: shop.id,
      firstName: 'Sarah',
      lastName: 'Wanjiku',
      role: 'Senior Stylist',
      rating: 4.8
    });

    // Create Services
    await Service.bulkCreate([
      {
        shopId: shop.id,
        name: 'Executive Haircut',
        description: 'Premium cut with wash and hot towel',
        price: 1000,
        duration: 45
      },
      {
        shopId: shop.id,
        name: 'Beard Trim & Shape',
        description: 'Professional beard grooming',
        price: 500,
        duration: 25
      },
      {
        shopId: shop.id,
        name: 'Head Massage',
        description: 'Relaxing 30-min scalp massage',
        price: 800,
        duration: 30
      }
    ]);

    // Create a Client
    const client = await User.create({
      firstName: 'Test',
      lastName: 'Client',
      email: 'client@example.com',
      password,
      role: 'client',
      phoneNumber: '0722334455'
    });

    console.log('Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
