const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const userModel = require("./models/user.js");
const college = require("./models/college.js");
require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});


app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res) {
    res.render('index');
});

app.get("/colleges", function(req,res){
    res.render('college')
})

app.get("/signup", function(req, res) {
    res.render('signup');
});

app.post("/signup", async function(req, res) {
    console.log("Signup form data:", req.body); 
    let { name, email, password, age } = req.body;

    // Check if the email already exists
    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.render('error');
    }

    // Hash the password and store it
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return res.send("Error generating salt");

        bcrypt.hash(password, salt, async function(err, hash) {
            if (err) return res.send("Error hashing password");

            console.log("Generated Salt:", salt); // Log the salt
            console.log("Generated Hash:", hash); // Log the hashed password
            // Create a new user with hashed password
            try {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);
                
                let User = await userModel.create({
                    name,
                    email,
                    password: hash, // Store the hashed password, not plain text
                    age
                });

                let token = jwt.sign({ email }, process.env.JWT_SECRET);
                res.cookie("token", token);
                res.redirect("/login");
            } catch (error) {
                console.error("Error saving user:", error);
                res.send("Error creating user");
            }
        });
    });
});

app.get("/login", function(req, res) {
    res.render('login');
});

app.post("/login", async function(req, res) {
    let User = await userModel.findOne({ email: req.body.email });
    if (!User) return res.render('error');

    console.log("Entered Password:", req.body.password);  // Log entered password
    console.log("Stored Hashed Password:", User.password); // Log stored hash

    bcrypt.compare(req.body.password, User.password, function(err, result) {
        if (err) {
            console.log("Error during password comparison:", err);
            return res.send("Error comparing passwords");
        }

        console.log("Password comparison result:", result);

        if (result) {
            let token = jwt.sign({ email: User.email }, process.env.JWT_SECRET);
            res.cookie("token", token);
            res.render('dashboard', { user: User });
        } else {
            res.render('error');
        }
    });
});

app.get('/predict', function(req, res){
  res.render('predict', { colleges: null }); // empty on first load
});

app.post('/predict', async function(req, res){
  const userRank = parseInt(req.body.rank);
    // const user = await userModel.findById(req.name);
    // user.predictions.push({
    //     rank: userRank,
    //     colleges: colleges.map(c => c.name)
    // });
    // await user.save();

  const colleges = await college.find({
    minRank: { $lte: userRank },
    maxRank: { $gte: userRank }
  });

  res.render('predict', { colleges });
});

app.post("/logout", function(req, res) {
    // Clear the token cookie on logout
    res.clearCookie("token");
    res.redirect("/");
});

app.get("/delete",async function(req,res){
    res.redirect("/");
})

app.post("/delete", async function(req, res) {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;
    await userModel.deleteOne({ email: userEmail });

    res.clearCookie("token");
    res.redirect("/");
});

app.listen(3000);