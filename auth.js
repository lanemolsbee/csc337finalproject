/**
 * I used this source to figure out how to split up my JS files
 * to prevent cluttered code
 * https://www.geeksforgeeks.org/how-to-include-a-javascript-file-in-another-javascript-file/
 */
const crypto = require('crypto')
function hashPassword(password){
	return crypto.createHash('sha256').update(password).digest('hex');
}
module.exports = {hashPassword};