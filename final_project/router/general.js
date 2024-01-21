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
        users.push({"username": username, "password":password});
        return res.status(200).json({message: "User has been successfully registered."});
      } else{
        return res.status(409).json({message: "username already exists."});
      }
  } else{
    return res.status(400).json({message: "username/password missing."});
  }
});

// Get the book list available in the shop
let getBooksFromDB = new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve(books)
    }, 500)
});
public_users.get('/',function (req, res) {
    getBooksFromDB.then(data => JSON.stringify(data))
    .then(jsonString => res.status(200).json(jsonString));
});

// Get book details based on ISBN
let getBookDetailsByISBN = (isbn) => new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve(books[isbn])
    }, 500)
});
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = parseInt(req.params.isbn);
  if(isbn){
    getBookDetailsByISBN(isbn).then(data => JSON.stringify(data))
    .then(jsonString => res.status(200).json(jsonString));
  } else{
    return res.status(400).json({message: "Invalid request."});
  }
 });
  
// Get book details based on author
const getAuthorBooks = (author) => {
    let book_list = [];
    for(let id in books){
        let currBook = books[id];
        if(currBook.author === author) book_list.push(currBook);
    }
    return book_list;
}
let getBookDetailsByAuthor = (author) => new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve(getAuthorBooks(author))
    }, 500)
}); 
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  if(author){
    getBookDetailsByAuthor(author).then(data => JSON.stringify(data))
    .then(jsonString => jsonString.length > 0 ? res.status(200).json(jsonString) : res.status(404).json({message: "Books/Author not found."}));
  } else{
    return res.status(204).json({message: "Author was not provided."});
  }
});

// Get all books based on title
const getBook = (title) => {
    let book_list = [];
    for(let id in books){
        let currBook = books[id];
        if(currBook.title === title) book_list.push(currBook);
    }
    return book_list;
}
let getBookDetailsByTitle = (title) => new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve(getBook(title))
    }, 500)
});

public_users.get('/title/:title',function (req, res) {
  let book_title = req.params.title;
  if(book_title){
    getBookDetailsByTitle(book_title).then(data => JSON.stringify(data))
    .then(jsonString => jsonString.length > 0 ? res.status(200).json(jsonString) : res.status(404).json({message: "Books/Book not found."}) )
  } else{
    return res.status(204).json({message: "Title was not provided."});
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
