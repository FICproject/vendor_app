require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Models
const Vendor = require('./models/Vendor');
const Business = require('./models/Business');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Customer = require('./models/Customer');
const DeliveryPartner = require('./models/DeliveryPartner');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
connectDB();

// --- Simple High-Performance In-Memory Cache ---
const cacheStore = new Map();
const CACHE_TTL_MS = 3000; // 3 seconds cache

const getCached = (key) => {
  const item = cacheStore.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cacheStore.delete(key);
    return null;
  }
  return item.data;
};

const setCached = (key, data) => {
  cacheStore.set(key, { data, expiry: Date.now() + CACHE_TTL_MS });
};

const clearCache = () => {
  cacheStore.clear();
};

const DEFAULT_ALL_BUSINESSES = [
  { businessName: 'Products', vendorType: 'Products', category: 'Fashion', subcategory: 'Apparel', address: 'Papareddypalya, Bangalore', pinCode: '560072', phone: '9876543210', logo: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80' },
  { businessName: 'Services', vendorType: 'Services', category: 'Services', subcategory: 'Home Services', address: 'Indiranagar, Bangalore', pinCode: '560038', phone: '9876543210', logo: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=150&q=80' },
  { businessName: 'Food', vendorType: 'Food', category: 'Food', subcategory: 'North Indian', address: 'Koramangala, Bangalore', pinCode: '560095', phone: '9876543210', logo: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=150&q=80' },
  { businessName: 'Travel', vendorType: 'Travel', category: 'Travel', subcategory: 'Bus & Cab Rental', address: 'MG Road, Bangalore', pinCode: '560001', phone: '9876543210', logo: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=150&q=80' },
  { businessName: 'Stay', vendorType: 'Stay', category: 'Stay', subcategory: 'Hotels & Luxury Resorts', address: 'Hebbal, Bangalore', pinCode: '560024', phone: '9876543210', logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=150&q=80' },
  { businessName: 'Jobs', vendorType: 'Jobs', category: 'Jobs', subcategory: 'Full Time & IT Staffing', address: 'Whitefield, Bangalore', pinCode: '560066', phone: '9876543210', logo: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=150&q=80' },
  { businessName: 'Daily Needs', vendorType: 'Daily Needs', category: 'Daily Needs', subcategory: 'Grocery & Daily Essentials', address: 'HSR Layout, Bangalore', pinCode: '560102', phone: '9876543210', logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80' },
];

// --- Helper to get active Vendor document consistently ---
const findVendor = async (req) => {
  const email = req?.headers?.['x-vendor-email'] || req?.body?.email;
  let vendor = null;
  if (email) {
    vendor = await Vendor.findOne({ email });
  }
  if (!vendor) {
    vendor = await Vendor.findOne().sort({ createdAt: 1 });
  }
  if (!vendor) {
    vendor = await Vendor.create({
      name: email ? email.split('@')[0] : 'Vendor User',
      email: email || 'karthikeyan@vendor.com',
      password: 'password123',
      phone: '+91 9876543210',
      membershipPlan: 'Gold',
      businesses: [{ businessName: 'My Products Shop', vendorType: 'Products', category: 'Fashion', subcategory: 'Apparel' }],
    });
  } else if (!vendor.businesses || vendor.businesses.length === 0) {
    vendor.businesses = [{
      businessName: vendor.businessName || vendor.vendorType || 'My Business',
      vendorType: vendor.vendorType || 'Products',
      category: vendor.category || vendor.vendorType || 'Products',
      subcategory: vendor.subcategory || '',
    }];
    await vendor.save();
  }
  return vendor;
};

// --- Auth Routes ---
app.post('/api/auth/login-vendor', async (req, res) => {
  try {
    const { email, password } = req.body;
    let vendor = await findVendor(req);
    if (email && vendor.email !== email) {
      vendor.email = email;
      await vendor.save();
    }
    return res.json({
      success: true,
      token: `jwt_mongo_${vendor._id}`,
      user: vendor,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/auth/register-vendor', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.businesses || payload.businesses.length === 0) {
      payload.businesses = [{
        businessName: payload.businessName || payload.vendorType || 'My Business',
        vendorType: payload.vendorType || 'Products',
        category: payload.category || payload.vendorType || 'Products',
        subcategory: payload.subcategory || '',
        address: payload.registeredAddress || payload.address || '',
        pinCode: payload.pinCode || '',
        phone: payload.mobileNumber || payload.phone || '',
      }];
    }
    const vendor = await Vendor.create(payload);
    clearCache();
    return res.json({ success: true, user: vendor, token: `jwt_mongo_${vendor._id}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// --- Profile & Business Management Routes ---
app.get('/api/vendor/profile', async (req, res) => {
  try {
    const vendor = await findVendor(req);
    return res.json({ success: true, user: vendor });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/vendor/profile', async (req, res) => {
  try {
    const updates = req.body;
    const vendor = await findVendor(req);
    Object.assign(vendor, updates);
    await vendor.save();
    clearCache();
    return res.json({ success: true, user: vendor });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/vendor/business', async (req, res) => {
  try {
    const { businessName, vendorType, category, subcategory, address, pinCode, phone, logo } = req.body;
    const vendor = await findVendor(req);

    const newBiz = {
      businessName: businessName || vendorType,
      vendorType,
      category: category || vendorType,
      subcategory: subcategory || 'General',
      address: address || '',
      pinCode: pinCode || '',
      phone: phone || '',
      logo: logo || '',
    };

    const existingIdx = vendor.businesses.findIndex(b => b.businessName === newBiz.businessName && b.vendorType === newBiz.vendorType);
    if (existingIdx === -1) {
      vendor.businesses.push(newBiz);
      await vendor.save();
    }

    // Sync newly created business across all Vendor accounts in MongoDB Atlas
    const allVendors = await Vendor.find({});
    for (const v of allVendors) {
      const idx = v.businesses.findIndex(b => b.businessName === newBiz.businessName && b.vendorType === newBiz.vendorType);
      if (idx === -1) {
        v.businesses.push(newBiz);
        await v.save();
      }
    }

    await Business.create({
      vendorId: vendor._id,
      ...newBiz,
    });

    clearCache();
    const createdBiz = vendor.businesses[vendor.businesses.length - 1];
    return res.json({ success: true, user: vendor, newBusinessId: createdBiz ? createdBiz._id : 'biz_' + Date.now() });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/vendor/business/:id', async (req, res) => {
  try {
    const businessId = req.params.id;
    const vendor = await findVendor(req);
    
    // Remove from active vendor and all vendor documents in MongoDB Atlas
    const allVendors = await Vendor.find({});
    for (const v of allVendors) {
      if (v.businesses && v.businesses.length > 0) {
        v.businesses = v.businesses.filter(b => b._id.toString() !== businessId && b.id !== businessId);
        await v.save();
      }
    }

    await Business.findByIdAndDelete(businessId);
    clearCache();
    return res.json({ success: true, user: vendor });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// --- Product Routes ---
app.get('/api/vendor/products', async (req, res) => {
  try {
    const businessId = req.headers['x-business-id'];
    const vendor = await findVendor(req);
    let filter = {};
    if (businessId) {
      const biz = vendor?.businesses?.find(b => b._id?.toString() === businessId || b.id === businessId);
      if (biz && biz.vendorType) {
        filter = { $or: [{ businessId }, { category: biz.vendorType }, { vendorType: biz.vendorType }] };
      } else {
        filter = { $or: [{ businessId }, { vendorId: vendor._id }] };
      }
    } else if (vendor) {
      filter = { vendorId: vendor._id };
    }
    let products = await Product.find(filter).sort({ createdAt: -1 });
    if (!products || products.length === 0) {
      products = await Product.find({}).sort({ createdAt: -1 });
    }
    return res.json({ success: true, data: products });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/vendor/products', async (req, res) => {
  try {
    const vendor = await findVendor(req);
    const businessId = req.headers['x-business-id'];
    const payload = req.body;
    const cat = payload.category || payload.vendorType || 'Products';
    const product = await Product.create({
      ...payload,
      category: cat,
      vendorType: cat,
      subCategory: payload.subCategory || payload.subcategory || 'General',
      vendorId: vendor ? vendor._id : undefined,
      businessId: businessId || payload.businessId,
    });
    clearCache();
    return res.json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/vendor/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    clearCache();
    return res.json({ success: true, data: product });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/vendor/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    clearCache();
    return res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// --- Customer Routes ---
app.get('/api/vendor/customers', async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, data: customers });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// --- Order Routes ---
app.get('/api/vendor/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/vendor/orders', async (req, res) => {
  try {
    const vendor = await findVendor(req);
    const order = await Order.create({
      ...req.body,
      vendorId: vendor ? vendor._id : undefined,
    });
    clearCache();
    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/vendor/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    clearCache();
    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// --- Analytics Routes ---
app.get('/api/vendor/analytics', async (req, res) => {
  try {
    const ordersCount = await Order.countDocuments({});
    const itemsCount = await Product.countDocuments({});
    const orders = await Order.find({ status: 'Delivered' });
    const totalRevenue = orders.reduce((sum, o) => sum + (o.finalAmount || 0), 0);
    return res.json({
      success: true,
      data: {
        totalOrdersCount: ordersCount,
        totalRevenue,
        totalItemsCount: itemsCount,
        activeMembershipsCount: 1,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// --- Unified Customer API Routes ---

// Customer Auth
app.post('/api/customer/auth/register', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    let customer = await Customer.findOne({ $or: [{ email }, { phone }] });
    if (!customer) {
      customer = await Customer.create({ name, email, phone, address, ordersCount: 0, totalSpent: 0 });
    }
    return res.json({ success: true, user: customer, token: `jwt_customer_${customer._id}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/customer/auth/login', async (req, res) => {
  try {
    const { email, phone } = req.body;
    let customer = null;
    if (email) customer = await Customer.findOne({ email });
    if (!customer && phone) customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = await Customer.create({
        name: email ? email.split('@')[0] : 'Customer',
        email: email || 'customer@example.com',
        phone: phone || '+91 9876543210',
        ordersCount: 0,
        totalSpent: 0,
      });
    }
    return res.json({ success: true, user: customer, token: `jwt_customer_${customer._id}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Customer Browse Products / Services / Businesses
app.get('/api/customer/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, data: products });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/customer/businesses', async (req, res) => {
  try {
    const vendors = await Vendor.find({});
    let allBusinesses = [];
    vendors.forEach(v => {
      if (v.businesses && v.businesses.length > 0) {
        allBusinesses.push(...v.businesses);
      }
    });
    return res.json({ success: true, data: allBusinesses });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Customer Place Order / Booking
app.post('/api/customer/orders', async (req, res) => {
  try {
    const { memberName, customerPhone, customerAddress, items, finalAmount, type, businessId, vendorId } = req.body;
    
    // Find or create customer record
    let customer = await Customer.findOne({ phone: customerPhone });
    if (!customer && customerPhone) {
      customer = await Customer.create({ name: memberName || 'Customer', phone: customerPhone, address: customerAddress });
    }

    const order = await Order.create({
      memberName: memberName || 'Customer User',
      customerPhone: customerPhone || '+91 9876543210',
      customerAddress: customerAddress || '',
      items: items || [],
      finalAmount: finalAmount || 0,
      type: type || 'Order',
      status: 'Pending',
      businessId: businessId || undefined,
      vendorId: vendorId || undefined,
    });

    if (customer) {
      customer.ordersCount = (customer.ordersCount || 0) + 1;
      customer.totalSpent = (customer.totalSpent || 0) + (finalAmount || 0);
      await customer.save();
    }

    clearCache();
    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Customer Track Orders
app.get('/api/customer/orders', async (req, res) => {
  try {
    const { phone, email } = req.query;
    let filter = {};
    if (phone) filter.customerPhone = phone;
    if (email) filter.candidateEmail = email;
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/customer/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});


const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`🚀 High-Performance MongoDB Atlas Express API Server running on port ${PORT}`);
});
