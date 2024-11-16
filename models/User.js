const mongoose = require("mongoose"); 


const User = mongoose.model("User", {
    email: String,
    password: String, 
    isAdmin:  { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = User;
