"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/express-mongoose";
if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}
// Initialize the cached variable
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        // Return existing connection if available
        if (cached.conn) {
            return cached.conn;
        }
        // Create a new connection if none exists
        if (!cached.promise) {
            cached.promise = mongoose_1.default.connect(MONGODB_URI, {});
        }
        // Await the connection promise and cache the connection
        cached.conn = yield cached.promise;
        return cached.conn;
    });
}
exports.default = connectToDatabase;
