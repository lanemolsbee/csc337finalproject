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
function hashPassword(password){
	return crypto.createHash('sha256').update(password).digest('hex');
}

async function checkLogin(db, username, password, role){
	
}
module.exports = {hashPassword};