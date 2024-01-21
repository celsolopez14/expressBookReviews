const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.uname;
  let password = req.body.pass;
  if(username.length){
    if(isValid(username)){
        return res.status(200).json({message: "User has been successfully registered."});
      } else{
        return res.status(409).json({message: "username already exists."});
      }
  } else{
    return res.status(400).json({message: "username/password missing."});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  return res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = parseInt(req.params.isbn);
  if(isbn){
    let book = books[isbn];
    return res.status(200).json(JSON.stringify(book));
  } else{
    return res.status(400).json({message: "Invalid request."});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  if(author){
    let book_list = [];
    for(let id in books){
        let currBook = books[id];
        if(currBook.author === author) book_list.push(currBook);
    }
    if(book_list.length > 0){
        return res.status(200).json(JSON.stringify(book_list));
    } else{
        return res.status(404).json({message: "Books/Author not found."});
    }
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let book_title = req.params.title;
  if(book_title){
    let book_list = [];
    for(let id in books){
        let currBook = books[id];
        if(currBook.title === book_title) book_list.push(currBook);
    }
    if(book_list.length > 0){
        return res.status(200).json(JSON.stringify(book_list));
    } else{
        return res.status(404).json({message: "Books/Book not found."});
    }
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = parseInt(req.params.isbn);
    if(isbn){
      let reviews = books[isbn].reviews;
      return res.status(200).json(JSON.stringify(reviews));
    } else{
      return res.status(400).json({message: "Invalid request."});
    }
});

module.exports.general = public_users;
