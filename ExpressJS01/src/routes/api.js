const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const { getProducts, getProductById, addFavorite, removeFavorite, getUserFavorites, addViewed, getUserViewed, getSimilar, buyProduct } = require('../controllers/productController');
const { addComment, getComments, removeComment } = require('../controllers/commentController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

routerAPI.use(auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api");
});

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);
routerAPI.get("/products", getProducts);
routerAPI.get("/product/:productId", getProductById);

// Favorites
routerAPI.post("/favorites", addFavorite);
routerAPI.delete("/favorites/:productId", removeFavorite);
routerAPI.get("/favorites", getUserFavorites);

// Viewed
routerAPI.post("/viewed", addViewed);
routerAPI.get("/viewed", getUserViewed);

// Similar
routerAPI.get("/similar/:productId", getSimilar);

// Comments
routerAPI.post("/comments", addComment);
routerAPI.get("/comments/:productId", getComments);
routerAPI.delete("/comments/:commentId", removeComment);

// Buy
routerAPI.post("/buy", buyProduct);

module.exports = routerAPI;