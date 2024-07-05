const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/skills", (req, res) => {
    res.render("skills");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
