const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

const Vendor = require('./models/Vendor');
const Business = require('./models/Business');

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://karthikeyanb25_db_user:pqbZxh0jH0zNGyKf@cluster0.2gix8jn.mongodb.net/?appName=Cluster0';

async function registerNewVendor() {
  try {
    console.log('Connecting to MongoDB Atlas at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas!');

    // Check if vendor already exists
    const existing = await Vendor.findOne({ email: 'karthikeyan@vendor.com' });
    if (existing) {
      console.log('\n⚠️ Vendor already registered:');
      console.log('Email:', existing.email);
      console.log('ID:', existing._id);
      process.exit(0);
    }

    // Register vendor
    const newVendor = await Vendor.create({
      name: 'Karthikeyan',
      email: 'karthikeyan@vendor.com',
      password: 'password123',
      phone: '+91 9876543210',
      membershipPlan: 'Gold',
      businesses: [
        {
          businessName: 'Products',
          vendorType: 'Products',
          category: 'Electronics',
          subcategory: 'Gadgets',
          address: 'Main Road, Bangalore',
          pinCode: '560001',
          phone: '+91 9876543210',
          logo: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80',
        },
        {
          businessName: 'Services',
          vendorType: 'Services',
          category: 'A/C',
          subcategory: 'Full Clean',
          address: 'MG Road, Bangalore',
          pinCode: '560001',
          phone: '+91 9876543210',
          logo: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=150&q=80',
        },
      ],
    });

    // Also register businesses
    await Business.create([
      {
        vendorId: newVendor._id,
        businessName: 'Products',
        vendorType: 'Products',
        category: 'Electronics',
        subcategory: 'Gadgets',
        address: 'Main Road, Bangalore',
        pinCode: '560001',
        phone: '+91 9876543210',
      },
      {
        vendorId: newVendor._id,
        businessName: 'Services',
        vendorType: 'Services',
        category: 'A/C',
        subcategory: 'Full Clean',
        address: 'MG Road, Bangalore',
        pinCode: '560001',
        phone: '+91 9876543210',
      },
    ]);

    console.log('\n✅ New Vendor Successfully Registered in MongoDB Atlas!');
    console.log('----------------------------------------------------');
    console.log('Vendor Name:    ', newVendor.name);
    console.log('Email:          ', newVendor.email);
    console.log('Password:       ', 'password123');
    console.log('Phone:          ', newVendor.phone);
    console.log('Plan:           ', newVendor.membershipPlan);
    console.log('Vendor ID:      ', newVendor._id.toString());
    console.log('Businesses:     ', newVendor.businesses.map(b => b.businessName).join(', '));
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error registering vendor:', err);
    process.exit(1);
  }
}

registerNewVendor();
