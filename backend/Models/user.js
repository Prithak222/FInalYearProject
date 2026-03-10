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
  }
}, { timestamps: true })

const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel
