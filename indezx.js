const express = require("express");
const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config();
const app = express();

// Middleware to parse URL-encoded bodies (form data) and JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection URI from environment variable
const mongoDBUri = process.env.connsctionstring;

// Connect to MongoDB
async function connectToDB() {
    try {
        await mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error("Error connecting to MongoDB:", e);
    }
}
connectToDB();

// Define user schema and model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const UserModel = mongoose.model("User", userSchema);

// Routes
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new UserModel({ name, email, password });
        const result = await newUser.save();
        console.log("Client registered successfully", result);
        res.render("login", { message: "Registration successful. Please log in." });
    } catch (error) {
        console.error("An error occurred while registering the client:", error);
        res.render("register", { message: "An error occurred while registering the client." });
    }
});

app.get("/login", (req, res) => {
    res.render("login", { message: null });
});

app.post("/login", async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await UserModel.findOne({ name: name });
        if (!user) {
            console.log("User not found");
            return res.render("login", { message: "User not found" });
        }

        if (user.password !== password) {
            console.log("Incorrect password");
            return res.render("login", { message: "Incorrect password" });
        }

        console.log("Login successful");
        res.render("home", { user: name });

    } catch (error) {
        console.error("Error during login:", error);
        res.render("login", { message: "Internal Server Error" });
    }
});

app.get("/forgot-password", (req, res) => {
    res.render("fpass", { message: null });
});

app.post("/forgot-password", async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            console.log("User not found");
            return res.render("fpass", { message: "User not found" });
        }

        user.password = newPassword;
        await user.save();

        console.log("Password reset successful");
        res.render("login", { message: "Password reset successful. Please log in." });

    } catch (error) {
        console.error("Error during password reset:", error);
        res.render("fpass", { message: "Internal Server Error" });
    }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
