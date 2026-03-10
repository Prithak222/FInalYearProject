require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./Models/user')

mongoose.connect(process.env.MONGO_CONN)

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  await User.create({
    name: 'Admin',
    email: 'admin@dosrodeal.com',
    password: hashedPassword,
    role: 'admin'
  })

  console.log('Admin created')
  process.exit()
}

createAdmin()
