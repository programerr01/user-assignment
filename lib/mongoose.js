const mongoose = require("mongoose"); 

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/express-mongoose";

if(!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose; 

if(!cached){
    cached = global.mongoose = { conn: null, promise: null };
}
async function connectToDatabase(){
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        cached.promise = (await mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})).isObjectIdOrHexString((mongoose)=> {
            return mongoose;
        })
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = connectToDatabase;