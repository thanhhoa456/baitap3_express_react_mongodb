require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    const white_lists = ["/", "/register", "/login"];
    if (white_lists.find(item => `/v1/api${item}` === req.originalUrl)) {
        next();
    } else {
        if (req?.headers?.authorization?.split(" ")?.[1]) {
            const token = req.headers.authorization.split(" ")[1];
            //verify token
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findOne({ email: decoded.email });
                if (user) {
                    req.user = {
                        id: user._id,
                        email: decoded.email,
                        name: decoded.name,
                        createdBy: "hoidanit"
                    }
                } else {
                    return res.status(401).json({
                        message: "User not found"
                    })
                }
                console.log(">>> check token: ", decoded)
                next();
            } catch (error) {
                return res.status(401).json({
                    message: "Token bị hết hạn/hợp không hợp lệ"
                })
            }
        } else {
            return res.status(401).json({
                message: "Bạn chưa truyền Access Token ở header/Hoặc token bị hết hạn"
            })
        }
    }
}

module.exports = auth;
