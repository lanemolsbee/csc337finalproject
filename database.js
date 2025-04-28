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
       const { title, price } = query;
	
		// Validate that both title and price are provided
		if (!title || !price) {
			throw new Error("Both title and price are required to add a book.");
		}
	
		// Create the book object to be inserted into the database
		const book = {
			title: title,
			price: price,
			dateAdded: new Date() // Optional: Track when the book was added
		};
	
		try {
			// Add the book to the 'listings' collection in the database
			const result = await db.collection("listings").insertOne(book);
			console.log("Book successfully added:", result.insertedId);
			return result;
		} catch (error) {
			console.error("Error adding book:", error);
			throw new Error("Failed to add the book to the database.");
		}
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

		if (!username) {
			throw new Error("Username is required to retrieve purchases.");
		}
	
		// Return a promise for the retrieval of purchases
		return db.collection("buyers").findOne({ username: username })
			.then(user => {
				// If the user is not found, throw an error
				if (!user) {
					throw new Error(`No buyer found with username: ${username}`);
				}
	
				// Return the purchases array associated with the user
				return user.purchases || [];
			})
			.catch(error => {
				console.error("Error retrieving purchases:", error);
				throw new Error("Failed to retrieve purchases for the user.");
			});
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
	
		if (!username) {
			throw new Error("Username is required to retrieve inventory.");
		}
	
		// Return a promise for the inventory retrieval
		return db.collection("sellers").findOne({ username: username })
			.then(seller => {
				// If the seller is not found, throw an error
				if (!seller) {
					throw new Error(`No seller found with username: ${username}`);
				}
	
				// Return the inventory array associated with the seller
				return seller.inventory || [];
			})
			.catch(error => {
				console.error("Error retrieving inventory:", error);
				throw new Error("Failed to retrieve inventory for the seller.");
			});
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
		if (!username || !bookTitle) {
			throw new Error("Username and bookTitle are required to remove an item from the inventory.");
		}
	
		// Construct the item to be removed
		const itemToRemove = { title: bookTitle, price: price };
	
		// Return a promise for the inventory update
		return db.collection("sellers").updateOne(
			{ username: username }, // Find the seller by username
			{ $pull: { inventory: itemToRemove } } // Remove the matching item from the inventory array
		)
		.then(result => {
			if (result.modifiedCount === 0) {
				throw new Error(`No matching item found in the inventory for username: ${username}`);
			}
			console.log("Item successfully removed from inventory.");
			return result;
		})
		.catch(error => {
			console.error("Error removing item from inventory:", error);
			throw new Error("Failed to remove the item from the seller's inventory.");
		});
	}
	

/**
 * This function will add an item to a given sellerss inventory.
 * @param {Object} db 
 * @param {String} username is the username of the seller to be queried
 * @param {String} bookTitle is the title of the book to be added
 */
function addItemToSellerInventory(db, username, bookTitle, price){

	
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