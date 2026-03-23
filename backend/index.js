const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');

require('./Models/db');



const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use("/api/products", require("./Routes/productRoutes"));
app.use("/api/cart", require("./Routes/cartRoutes"));
app.use("/api/wishlist", require("./Routes/wishlistRoutes"));


app.listen(port, () => {
    console.log("Server is running on port " + port);
})