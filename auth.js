/**
 * File: auth.js
 * Author: Lane Molsbee
 * Purpose: This file contains functions associated with password authorization.
 * It interacts with the database to hash passwords and check logins. 
 * It is closely tied to the database.js file, which also interacts with
 * the database
 * 
 * 
 * I used this source to figure out how to split up my JS files
 * to prevent cluttered code
 * https://www.geeksforgeeks.org/how-to-include-a-javascript-file-in-another-javascript-file/
 */
const crypto = require('crypto')

/**
 * This function returns the hashed version of a given password
 * @param {String} password 
 * @returns 
 */
function hashPassword(password){
	return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * This function determines whether a given user appears in the database for login purposes.
 * It will search the database for the particular user and determine if a user with matching
 * username, password, and role exists. 
 * @param {Object} db is the database object to be used
 * @param {String} username is the username of the user
 * @param {String} password is the user's password, which must be hashed
 * @param {String} role is the user's role. 
 */
async function checkLogin(db, username, password, role){
	try{
		const hashed = hashPassword(password);
		var collectionName;
		if(role == 'buyer'){
			collectionName = 'buyers';
		}
		else if(role == 'seller'){
			collectionName = 'sellers';
		}else if(role == 'admin'){
			collectionName = 'admins';
		}else{
			return false;
		}
		const user = await db.collection(collectionName).findOne({
			username: username,
			password: hashed
		});
		return user != null
	}catch(err){
		console.log("Error during login check: ", err);
		return false;
	}
}
module.exports = {hashPassword, checkLogin};