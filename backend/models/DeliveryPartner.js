const mongoose = require('mongoose');

const DeliveryPartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleType: { type: String, default: 'Bike' },
    vehicleNumber: { type: String, default: '' },
    status: { type: String, enum: ['Available', 'On Delivery', 'Offline'], default: 'Available' },
    rating: { type: Number, default: 4.8 },
    completedDeliveries: { type: Number, default: 0 },
    currentLocation: {
      latitude: { type: Number, default: 12.9716 },
      longitude: { type: Number, default: 77.5946 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeliveryPartner', DeliveryPartnerSchema);
