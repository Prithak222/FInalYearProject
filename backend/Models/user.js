const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['customer', 'vendor', 'admin'],
    default: 'customer'
  },

  // Only used when role === 'vendor'
  isVendorApproved: {
    type: Boolean,
    default: function () {
      return this.role === 'vendor' ? false : undefined
    }
  },

  suspendedUntil: {
    type: Date
  },
  phone: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },

  // Shop Profile Fields (Vendor)
  shopName: { type: String, default: "" },
  shopDescription: { type: String, default: "" },
  shopLogo: { type: String, default: "" },
  shopBanner: { type: String, default: "" },
  shopSlug: { type: String, default: "" },
  category: { type: String, default: "" },
  businessHours: { type: String, default: "" },
  returnPolicy: { type: String, default: "" },

  // Payment Details (Vendor)
  bankName: { type: String, default: "" },
  accountHolder: { type: String, default: "" },
  accountNumber: { type: String, default: "" },
  routingNumber: { type: String, default: "" },
  payoutSchedule: { type: String, default: "weekly" },
  payoutThreshold: { type: String, default: "50" },

  // Settings & Preferences
  notifNewOrderEmail: { type: Boolean, default: true },
  notifNewOrderPush: { type: Boolean, default: true },
  domesticShipping: { type: Boolean, default: true },
  internationalShipping: { type: Boolean, default: false },

}, { timestamps: true })

const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel
