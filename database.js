/**
 * File: database.js
 * AUthors: Lane Molsbee and Launa Sigars
 * Purpose: This file contains functions to work with the database.
 * Specifically, it adds users to the database, adds data associated with a given user
 * and returns lists of data associated with a given user when queried
 * by the server.
 * 
 * I would like to note that for all functions, db is the name of the MongoDB database
 * that is currently being worked on. 
 */

/**
 * THis function will add a user to the database by assigning 
 * a new object to it with items username, hashedPass, and role.
 * If the role is "buyer," it will store an array of purchases. If it
 * is "seller," it will store an array of the books the seller currently
 * has in the store. 
 * @param {Object} db 
 * @param {String} username is the username of the user
 * @param {String} hashedPass is the hashed password of the user
 * @param {String} role is the user's role
 */
function addUser(db, username, hashedPass, role){

}

/**
 * This function will get the purchases associated with a given buyer.
 * 
 * @param {Object} db 
 * @param {String} username is the username of the user to be queried
 */
function getPurchases(db, username){

}

/**
 * This function will get the inventory associated with a given seller.
 * @param {Object} db 
 * @param {String} username is the username of the seller to be queried
 */
function getInventory(db, username){

}

/**
 * This function will remove an item from a given sellerss inventory
 * @param {Object} db 
 * @param {String} username is the username of the seller to be queried
 * @param {String} bookTitle is thetitle of the book to be removed
 */
function removeItemFromSellerInventory(db, username, bookTitle){

}

/**
 * This function will add an item to a given sellerss inventory.
 * @param {Object} db 
 * @param {String} username is the username of the seller to be queried
 * @param {String} bookTitle is the title of the book to be added
 */
function addItemToSellerInventory(db, username, bookTitle)
{

}

/**
 * This function will add an item to a given buyer's purchase list
 * @param {Object} db 
 * @param {String} username is the username of the buyer to be queried
 * @param {String} bookTitle is the title of the book to be added
 */
function addBookToBuyerPurchases(db, username, bookTitle){

}
module.exports = {addUser, getPurchases, getInventory, removeItemFromSellerInventory, 
	addItemToSellerInventory, addBookToBuyerPurchases
};