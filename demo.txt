const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.get("/",function(req,res){

    bcrypt.genSalt(10, function(err,salt){
        console.log(salt);
        bcrypt.hash("Pass@123",salt,function(err,hash){
            console.log(hash);
        });
    });
    bcrypt.compare("Pass@123", "$2b$10$tzf/5NTI0lBUApcGf/CoVuw7GkiMcKzllNb/EQgAZF5Yigb/3/ttO", function(err, result) {
    console.log(result);
    });
    res.cookie("name","kunal");
    res.send(("Hello World"));
})

app.get("/read",function(req,res){

    res.send(("Reading Data"));
})

app.listen(3000);



const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/",function(req,res){
    let token = jwt.sign({email: "harsh@example.com"},"secret");
    res.cookie("token",token);
    res.send("Working")
})

app.get("/read",function(req,res){

    let data = jwt.verify(req.cookies.token, "secret");
    console.log(data);
    res.send(("Reading Data"));
})

app.listen(3000);