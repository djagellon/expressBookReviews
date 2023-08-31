const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios').default;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop using Promise/Callbacks
public_users.get('/',function (req, res) {
    
    new Promise((resolve, reject) => {
        resolve(JSON.stringify(books, null, 4));
    }).then((successMessage) => {
        res.send(successMessage);
    });
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        resolve(books[isbn]);
    }).then((success) => {
        res.send(success);
    });

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    new Promise((resolve, reject) => {
        const author = req.params.author;
        const filteredAuthors = Object.fromEntries(
            Object.entries(books).filter((book, index) => {
              return book[1]['author'] === author;
            })
          );

        resolve(filteredAuthors);
    }).then((success) => {
        res.send(success);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    new Promise((resolve, reject) => {
        const title = req.params.title;
        const filteredTitles = Object.fromEntries(
          Object.entries(books).filter((book, index) => {
            return book[1]['title'] === title;
          })
        );
        resolve(filteredTitles);
    }).then((success) => {
        res.send(success);
    });
  });
  
  //  Get book review
  public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    res.send(book['reviews']);
  });
  
module.exports.general = public_users;
