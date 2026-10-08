const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, './.env') });
require('dotenv').config();
const mongoose = require('mongoose');
const Vendor = require('./models/Vendor');
const Business = require('./models/Business');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Customer = require('./models/Customer');
const DeliveryPartner = require('./models/DeliveryPartner');

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://karthikeyanb25_db_user:pqbZxh0jH0zNGyKf@cluster0.2gix8jn.mongodb.net/connect_db?retryWrites=true&w=majority&appName=Cluster0';

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas at:', mongoUri);
    await mongoose.connect(mongoUri);

    console.log('Successfully connected to MongoDB Atlas!');

    // Drop all stale legacy indexes if any
    try { await Vendor.collection.dropIndexes(); } catch (e) {}
    try { await Business.collection.dropIndexes(); } catch (e) {}
    try { await Product.collection.dropIndexes(); } catch (e) {}
    try { await Order.collection.dropIndexes(); } catch (e) {}
    try { await Customer.collection.dropIndexes(); } catch (e) {}
    try { await DeliveryPartner.collection.dropIndexes(); } catch (e) {}

    // 1. Create & Seed Vendors Collection
    console.log('Seeding "vendors" collection...');
    await Vendor.deleteMany({});
    const demoVendor = await Vendor.create({
      name: 'Demo Vendor',
      email: 'vendor@example.com',
      password: 'password123',
      phone: '+91 9876543210',
      membershipPlan: 'Gold',
      primaryBusinessId: 'biz_products_1',
      businesses: [
        {
          businessName: 'Products',
          vendorType: 'Products',
          category: 'Fashion',
          subcategory: 'Apparel',
          address: 'Papareddypalya, Bangalore',
          pinCode: '560072',
          phone: '9876543210',
          logo: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80',
        },
        {
          businessName: 'Services',
          vendorType: 'Services',
          category: 'Services',
          subcategory: 'Home Services',
          address: 'Indiranagar, Bangalore',
          pinCode: '560038',
          phone: '9876543210',
          logo: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=150&q=80',
        },
        {
          businessName: 'Food',
          vendorType: 'Food',
          category: 'Food',
          subcategory: 'North Indian',
          address: 'Koramangala, Bangalore',
          pinCode: '560095',
          phone: '9876543210',
          logo: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=150&q=80',
        },
        {
          businessName: 'Travel',
          vendorType: 'Travel',
          category: 'Travel',
          subcategory: 'Bus & Cab Rental',
          address: 'MG Road, Bangalore',
          pinCode: '560001',
          phone: '9876543210',
          logo: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=150&q=80',
        },
        {
          businessName: 'Stay',
          vendorType: 'Stay',
          category: 'Stay',
          subcategory: 'Hotels & Luxury Resorts',
          address: 'Hebbal, Bangalore',
          pinCode: '560024',
          phone: '9876543210',
          logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=150&q=80',
        },
        {
          businessName: 'Jobs',
          vendorType: 'Jobs',
          category: 'Jobs',
          subcategory: 'Full Time & IT Staffing',
          address: 'Whitefield, Bangalore',
          pinCode: '560066',
          phone: '9876543210',
          logo: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=150&q=80',
        },
        {
          businessName: 'Daily Needs',
          vendorType: 'Daily Needs',
          category: 'Daily Needs',
          subcategory: 'Grocery & Daily Essentials',
          address: 'HSR Layout, Bangalore',
          pinCode: '560102',
          phone: '9876543210',
          logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
        },
      ],
    });

    // 2. Create & Seed Businesses Collection
    console.log('Seeding "businesses" collection...');
    await Business.deleteMany({});
    await Business.create([
      {
        vendorId: demoVendor._id,
        businessName: 'Products',
        vendorType: 'Products',
        category: 'Fashion',
        subcategory: 'Apparel',
        address: 'Papareddypalya, Bangalore',
        pinCode: '560072',
        phone: '9876543210',
        logo: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80',
      },
      {
        vendorId: demoVendor._id,
        businessName: 'Services',
        vendorType: 'Services',
        category: 'Services',
        subcategory: 'Home Services',
        address: 'Indiranagar, Bangalore',
        pinCode: '560038',
        phone: '9876543210',
        logo: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=150&q=80',
      },
    ]);

    // 3. Create & Seed Products Collection
    console.log('Seeding "products" collection...');
    try { await Product.collection.dropIndexes(); } catch (e) {}
    await Product.deleteMany({});
    await Product.create([
      {
        vendorId: demoVendor._id,
        name: 'Classic Cotton T-Shirt',
        description: 'Stock: 142',
        price: 499,
        originalPrice: 799,
        category: 'Products',
        subCategory: '📱 Electronics',
        itemType: 'Laptop',
        unit: 'count',
        stock: 142,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80',
        pinCode: '600001',
      },
      {
        vendorId: demoVendor._id,
        name: 'Denim Jeans Slim Fit',
        description: 'Stock: 89',
        price: 1299,
        originalPrice: 1899,
        category: 'Products',
        subCategory: '📱 Electronics',
        itemType: 'Tablets',
        unit: 'count',
        stock: 89,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=150&q=80',
        pinCode: '600001',
      },
      {
        vendorId: demoVendor._id,
        name: 'Full Clean A/C Service',
        description: 'Deep A/C cleaning & service',
        price: 800,
        originalPrice: 1200,
        category: 'Services',
        subCategory: '❄️ A/C',
        itemType: 'Full Clean',
        unit: 'service',
        stock: 10,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=150&q=80',
        pinCode: '600001',
      },
      {
        vendorId: demoVendor._id,
        name: 'Laptop Repairs & Setup',
        description: 'Complete IT & Laptop Repair',
        price: 1500,
        originalPrice: 2000,
        category: 'Services',
        subCategory: '💻 IT & Device Support',
        itemType: 'Laptop Repairs',
        unit: 'service',
        stock: 15,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1588702547919-26089e690ecd?auto=format&fit=crop&w=150&q=80',
        pinCode: '600001',
      },
      {
        vendorId: demoVendor._id,
        name: 'Paneer Tikka Masala',
        description: 'Serves 2 with Butter Naan',
        price: 320,
        originalPrice: 400,
        category: 'Food',
        subCategory: '🍛 North Indian',
        itemType: 'Paneer Dishes',
        unit: 'item',
        stock: 50,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=150&q=80',
        pinCode: '600001',
      },
      {
        vendorId: demoVendor._id,
        name: 'Bangalore to Goa Volvo Sleeper Bus',
        description: 'Luxury AC Sleeper Bus Ticket',
        price: 1450,
        originalPrice: 1800,
        category: 'Travel',
        subCategory: '🚌 Bus & Cab Rental',
        itemType: 'AC Sleeper',
        unit: 'ticket',
        stock: 20,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=150&q=80',
        pinCode: '560001',
      },
      {
        vendorId: demoVendor._id,
        name: 'Luxury Resort & Villa Booking',
        description: '5 Star Resort Package with Breakfast Included',
        price: 4999,
        originalPrice: 7500,
        category: 'Stay',
        subCategory: '🏨 Hotels & Luxury Resorts',
        itemType: 'Deluxe Suite',
        unit: 'night',
        stock: 5,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=150&q=80',
        pinCode: '560024',
      },
      {
        vendorId: demoVendor._id,
        name: 'Senior Full Stack Developer',
        description: 'Full time role - React Native & Node.js',
        price: 1200000,
        category: 'Jobs',
        subCategory: '💼 Full Time & IT Staffing',
        itemType: 'IT Staffing',
        unit: 'job',
        stock: 2,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=150&q=80',
        pinCode: '560066',
      },
      {
        vendorId: demoVendor._id,
        name: 'Organic Grocery Basket (5kg)',
        description: 'Fresh vegetables, milk & staple essentials',
        price: 599,
        originalPrice: 799,
        category: 'Daily Needs',
        subCategory: '🛒 Grocery Essentials',
        itemType: 'Grocery Basket',
        unit: 'basket',
        stock: 100,
        status: 'Available',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80',
        pinCode: '560102',
      },
    ]);

    // 4. Create & Seed Orders Collection
    console.log('Seeding "orders" collection...');
    await Order.deleteMany({});
    await Order.create([
      {
        vendorId: demoVendor._id,
        memberName: 'Rahul Sharma',
        customerPhone: '+91 98765 43210',
        customerAddress: '24 MG Road, Indiranagar, Bangalore - 560038',
        type: 'Order',
        status: 'Pending',
        finalAmount: 499,
        items: [{ name: 'Classic Cotton T-Shirt', quantity: 1, price: 499 }],
      },
      {
        vendorId: demoVendor._id,
        memberName: 'Priya Patel',
        customerPhone: '+91 87654 32109',
        customerAddress: '15 Residency Road, Ashok Nagar, Bangalore - 560025',
        type: 'Order',
        status: 'Preparing',
        finalAmount: 800,
        items: [{ name: 'Full Clean A/C Service', quantity: 1, price: 800 }],
      },
      {
        vendorId: demoVendor._id,
        memberName: 'Vikram Singh',
        customerPhone: '+91 76543 21098',
        customerAddress: '88 Koramangala 5th Block, Bangalore - 560095',
        type: 'Order',
        status: 'Delivered',
        finalAmount: 640,
        items: [{ name: 'Paneer Tikka Masala', quantity: 2, price: 320 }],
      },
    ]);

    // 5. Create & Seed Customers Collection
    console.log('Seeding "customers" collection...');
    await Customer.deleteMany({});
    await Customer.create([
      { vendorId: demoVendor._id, name: 'Arjun Kumar', email: 'arjun.kumar@gmail.com', phone: '+91 98765 43210', ordersCount: 12, totalSpent: 4500 },
      { vendorId: demoVendor._id, name: 'Sneha Reddy', email: 'sneha.reddy@gmail.com', phone: '+91 87654 32109', ordersCount: 8, totalSpent: 2800 },
      { vendorId: demoVendor._id, name: 'Vikram Singh', email: 'vikram.singh@gmail.com', phone: '+91 76543 21098', ordersCount: 15, totalSpent: 6200 },
    ]);

    // 6. Create & Seed DeliveryPartners Collection
    console.log('Seeding "deliverypartners" collection...');
    await DeliveryPartner.deleteMany({});
    await DeliveryPartner.create([
      { name: 'Karthik Raja', phone: '+91 98765 11111', vehicleType: 'Bike', vehicleNumber: 'KA-01-EA-1234', status: 'Available', rating: 4.9, completedDeliveries: 128 },
      { name: 'Suresh Kumar', phone: '+91 98765 22222', vehicleType: 'Scooter', vehicleNumber: 'KA-02-HB-5678', status: 'On Delivery', rating: 4.7, completedDeliveries: 94 },
    ]);

    console.log('\n✅ All MongoDB Atlas Collections successfully created & seeded!');
    console.log('Collections created:');
    console.log(' 1. vendors');
    console.log(' 2. businesses');
    console.log(' 3. products');
    console.log(' 4. orders');
    console.log(' 5. customers');
    console.log(' 6. deliverypartners\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding MongoDB collections:', err);
    process.exit(1);
  }
}

seedDatabase();
