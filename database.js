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
	console.log("Entered");
	try{
		//Get the Collection title based on the role (for functions that invole adding books or removing them
		//you will want to use different collections)
		var collectionTitle;
		if(query.role == 'buyer'){
			collectionTitle = 'buyers';
		} else if(query.role == 'seller'){
			collectionTitle = 'sellers';
		} else{
			collectionTitle = 'admins';
		}
		console.log(collectionTitle);
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
		else if(collectionTitle == 'sellers'){
			user = {
				"username": query.name,
				"password": auth.hashPassword(query.password),
				"inventory": []
			}
		}
		else{
			user = {
				"username": query.name,
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
	 * This function returns an array consiting of the store's inventory
	 * @param db - The database to draw from
	 * @returns the array of all the items in the database
	 */
	async function getStoreInventory(db){
		try{
			const collection = db.collection('listings');
			const inventory = await collection.find({}).toArray();
			return inventory;
		}
		catch(err){
			console.log(err);
		}
	}
/**
 * This function gets the list of reports from the database.
 * @param db - the database to interact with
 * @returns the array of reports in the database
 */
async function getReports(db){
	try{
		const collection = db.collection('reports');
		const reports = await collection.find({}).toArray();
		return reports
	}catch(err){
		console.log(err);
	}
}
	
/**
 * This function will add an item to a given sellerss inventory.
 * @param {Object} db 
 * @param {String} username is the username of the seller to be queried
 * @param {String} bookTitle is the title of the book to be added
 */
async function addItemToSellerInventory(db, username, bookTitle, price){
	var sellers = db.collection('sellers');
	const seller = await sellers.findOne({username: username});
	if(!seller){
		console.error(`Seller with username ${username} not found`);
		return false;
	}
	const newBook = {bookTitle: bookTitle, price: price};
	const result = await sellers.updateOne(
		{ username: username},
		{ $push: {inventory: newBook}}
	);
	if(result.modifiedCound == 1){
		console.log(`The book ${bookTitle} has been added to ${username}s' inventory`);
		return true;
	}else{
		console.error(`Failed to update inventory for ${username}`);
		return false;
	}
}




/**
 * This function adds a report to the database. 
 * @param {Object} db - This is the database the function interacts with
 * @param {Object} reportQuery - This is the query containing the details of the report.
 */
async  function addReport(db, reportQuery){
	/**
	 * This function works with a collection called "reports".
	 * It adds a report to this and fills out an object using the query parameters
	 * similar to adduser
	 */

	try {
        const reportsCollection = db.collection("reports");
        const report = {
            "name": reportQuery.name,
			"email": reportQuery.email,
			"message": reportQuery.message
        };
        const result = await reportsCollection.insertOne(report);
        console.log("Report added with ID:", result.insertedId);
        return result;
    } catch (error) {
        console.error("Error adding report:", error);
        throw error;
    }
}

module.exports = {addUser, addItemToSellerInventory, addReport, addBook, getReports, getStoreInventory
};