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
var auth = require('./auth')
/**
 * THis function will add a user to the database by assigning 
 * a new object to it with items username, hashedPass, and role.
 * If the role is "buyer," it will store an array of purchases. If it
 * is "seller," it will store an array of the books the seller currently
 * has in the store. 
 * @param {Object} db 
 * @param {Object} query - The query containing the data to be added
 * 
 */
async function addUser(db, query){
	try{
		var collectionTitle;
		if(query.role == 'buyer'){
			collectionTitle = 'buyers';
		} else if(query.role == 'sellers'){
			collectionTitle = 'sellers';
		} else{
			collectionTitle = 'admins';
		}
		const userCollection = db.collection(collectionTitle);
		const user = {
			"username": query.name,
			"password": auth.hashPassword(query.password),
			"purchases": []
		}
		await userCollection.insertOne(user);
		console.log('User inserted successfully');
	}catch(err){
		console.error('Error inserting user: ', err);
	}
}
/**
 * This function adds a book to the database under the collection "listings"
 * @param {Object} db - the database object to be used to add the book
 * @param {Object} query - the object containing the book's information to add to the database.
 */
async function addBook(db, query){

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