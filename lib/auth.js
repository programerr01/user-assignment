const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {

    const url = req.originalUrl;
    if(!req.header('Authorization')){
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, (process.env.JWT_SECRET || "appCode23"));
        req.user = decoded;

        if(url.startsWith("/admin") && !decoded.isAdmin){
            return res.status(401).json({ success: false, message: "Access denied. Only admin can access this endpoint." });
        }
        next();
    } catch (err) {
        console.log("err",err)
        res.status(400).json({ success: false, message: "Invalid token." });
    }
};

module.exports = authenticate;