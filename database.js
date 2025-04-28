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
		//Get the Collection title based on the role (for functions that invole adding books or removing them
		//you will want to use different collections)
		var collectionTitle;
		if(query.role == 'buyer'){
			collectionTitle = 'buyers';
		} else if(query.role == 'sellers'){
			collectionTitle = 'sellers';
		} else{
			collectionTitle = 'admins';
		}
		//Get teh collection associated with the title of the collection worked with
		const userCollection = db.collection(collectionTitle);
		//Define the item to be added using the items in the query
		var user;
		if(collectionTitle == 'buyers'){
			user = {
				"username": query.name,
				"password": auth.hashPassword(query.password),
				"purchases": []
			}	
		}
		if(collectionTitle == 'sellers'){
			user = {
				"username": query.name,
				"password": auth.hashPassword(query.password),
				"inventory": []
			}
		}
		else{
			user = {
				"username": query.username,
				"password": auth.hashPassword(query.password)
			}
		}
		//Add to the database
		await userCollection.insertOne(user);
		//Log to the console if successful
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
	/**
	 * For this function, the collection you will want to work with should be listings. 
	 * You will just add a book that you fill out using the query parameters to add to the list.
	 * Keep in mind, this happens when a seller uploads to the store. Do not use the username section
	 * of the query parameters for this, only give the book title and price.
	 */
}

/**
 * This function will get the purchases associated with a given buyer.
 * 
 * @param {Object} db 
 * @param {String} username is the username of the user to be queried
 * @return - the array of purchases associated with a user
 */
function getPurchases(db, username){
	/**
	 * 
	 * For this function, you will work with the buyers collection.
	 * You want to retrieve the purchases array associated with teh username
	 */
}

/**
 * This function will get the inventory associated with a given seller.
 * @param {Object} db - the database to be interacted with
 * @param {String} username is the username of the seller to be queried
 * @return - an array of the books in the inventory
 */
function getInventory(db, username){
	/**
	 * Similar to getPUrchases, but you use the sellers collection
	 * 'and return the inventory array associated with the username
	 */
}

/**
 * This function will remove an item from a given sellerss inventory
 * @param {Object} db 
 * @param {String} username is the username of the seller to be queried
 * @param {String} bookTitle is thetitle of the book to be removed
 */
function removeItemFromSellerInventory(db, username, bookTitle, price){
	/**
	 * You will work with the sellers collection again, 
	 * but this time you will remove an item from the inventory array
	 * associated with the username in the database
	 */
}

/**
 * This function will add an item to a given sellerss inventory.
 * @param {Object} db 
 * @param {String} username is the username of the seller to be queried
 * @param {String} bookTitle is the title of the book to be added
 */
function addItemToSellerInventory(db, username, bookTitle, price)
{
	/**
	 * Does the opposite of removeItemFromSellerInventory: this one adds
	 * to the array. 
	 */
}
/**
 * This function will remove an item from the store. 
 * @param {Object} db - the database this function interacts with
 * @param {String} bookTitle - the title of the book to be removed from teh store. 
 */
function removeItemFromStore(db, bookTitle){
	/**
	 * This works with teh collection "listings" and removes the boook with the given title. 
	 */
}

/**
 * This function will add an item to a given buyer's purchase list
 * @param {Object} db 
 * @param {String} username is the username of the buyer to be queried
 * @param {String} bookTitle is the title of the book to be added
 */
function addBookToBuyerPurchases(db, username, bookTitle){
	/**
	 * Thsi function works with the buyers collection and adds a book 
	 * to the buyer associated with username's purchase list
	 */
}
/**
 * This function adds a report to the database. 
 * @param {Object} db - This is the database the function interacts with
 * @param {Object} reportQuery - This is the query containing the details of the report.
 */
function addReport(db, reportQuery){
	/**
	 * This function works with a collection called "reports".
	 * It adds a report to this and fills out an object using the query parameters
	 * similar to adduser
	 */
}

module.exports = {addUser, getPurchases, getInventory, removeItemFromSellerInventory, 
	addItemToSellerInventory, addBookToBuyerPurchases, addReport, addBook, removeItemFromStore
};