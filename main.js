"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("./lib/mongoose"));
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
(0, mongoose_1.default)().then((res) => {
    console.log("Connected to database");
});
app.get("/", (req, res) => {
    res.redirect("/docs");
});
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
