const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    for(let user in users){
        if(user.username === username) return false;
    }
    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    for(let userId in users){
        if(users[userId].username === username){
            if(users[userId].password === password) return true;
        }
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.uname;
  let password = req.body.pass;
  if(!username || !password){
    return res.status(404).json({message: "Error logging in"});
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
        data: password
    }, 'access', {expiresIn: 60*15});
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else{
    return res.status(208).json({message:"Invalid user credentials." + username + " " + password});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let bookId = parseInt(req.query.isbn);
  let currBook = books[bookId];
  let username = req.session.authorization.username;
  for(let reviewId in currBook.reviews){
    if(currBook.reviews[reviewId].username === username){
        currBook.reviews[reviewId].review = req.query.review;
        return res.status(200).send("User successfully updated review."); 
    }
  }
    let newId = Object.keys(currBook.reviews).length + 1;
    currBook.reviews[newId] = {"username": username, "review": req.query.review};
    return res.status(200).send("User successfully posted review.");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let bookId = parseInt(req.params.isbn);
    let username = req.session.authorization.username;
    let currBook = books[bookId];
    for(let reviewId in currBook.reviews){
        if(currBook.reviews[reviewId].username === username){
            delete currBook.reviews[reviewId];
            return res.status(200).send("Review succesfully deleted.");
        }
    }
    return res.status(404).json({message: "Error trying to delete review."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
