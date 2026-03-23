const mongoose = require('mongoose');
const UserModel = require('./Models/user');
const ProductModel = require('./Models/products');
require('dotenv').config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_CONN || 'mongodb://localhost:27017/dosrodeal');
        console.log('Connected to DB');

        // 1. Find or create a test product
        let product = await ProductModel.findOne();
        if (!product) {
            product = new ProductModel({
                title: 'Test Product',
                price: 100,
                category: 'Electronics',
                condition: 'new',
                vendor: new mongoose.Types.ObjectId()
            });
            await product.save();
        }
        console.log('Product ID:', product._id);

        // 2. Find or create a test user
        let user = await UserModel.findOne({ email: 'test@example.com' });
        if (!user) {
            user = new UserModel({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
            await user.save();
        }
        console.log('User ID:', user._id);

        // 3. Test Add to Cart Logic
        const productId = product._id.toString();
        
        // Manual implementation of controller logic for verification
        const existingItemIndex = user.cart.findIndex(item => item.product && item.product.toString() === productId);
        if (existingItemIndex > -1) {
            user.cart[existingItemIndex].quantity += 1;
        } else {
            user.cart.push({ product: product._id, quantity: 1 });
        }
        await user.save();
        console.log('Added to cart, new quantity:', user.cart.find(item => item.product.toString() === productId).quantity);

        // 4. Test Wishlist Logic
        if (!user.wishlist.includes(product._id)) {
            user.wishlist.push(product._id);
        }
        await user.save();
        console.log('Added to wishlist, wishlist size:', user.wishlist.length);

        // 5. Populate and Check
        const populatedUser = await UserModel.findById(user._id).populate('cart.product').populate('wishlist');
        console.log('Populated Cart[0] Title:', populatedUser.cart[0].product.title);
        console.log('Populated Wishlist[0] Title:', populatedUser.wishlist[0].title);

        console.log('Verification Successful!');
        process.exit(0);
    } catch (err) {
        console.error('Verification Failed:', err);
        process.exit(1);
    }
}

test();
