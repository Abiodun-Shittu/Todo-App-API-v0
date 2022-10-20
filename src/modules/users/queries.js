const allUsers = "SELECT unique_id, name, email FROM users";
const checkMail = "SELECT email FROM  users WHERE email = $1";
const newUser =
	"INSERT INTO users (unique_id, name, email, password) VALUES ($1, $2, $3, $4)";
const findUser =
	"SELECT unique_id, email, password FROM users WHERE email = $1";
const getUser =
	"SELECT unique_id, name, email FROM users WHERE unique_id = $1";
const updateUser =
	"SELECT name, email, password FROM users WHERE unique_id = $1";
const updateName =
	"UPDATE users SET name = $1 WHERE unique_id = $2 RETURNING name";
const updateEmail =
	"UPDATE users SET email = $1 WHERE unique_id = $2 RETURNING email";
const updatePassword =
	"UPDATE users SET password = $1 WHERE unique_id = $2 RETURNING password";
const deleteUser = "DELETE FROM users WHERE unique_id = $1";

export default {
	allUsers,
	checkMail,
	newUser,
	findUser,
	getUser,
	updateUser,
	updateName,
	updateEmail,
	updatePassword,
	deleteUser,
};
