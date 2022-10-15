const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const { json } = require("express");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required!" });
  // check for duplicate usernames
  const duplicate = usersDB.users.find(
    (person) => person.username === username
  );
  if (duplicate) return res.sendStatus(409);
  // .json({ message: `duplicate user ${username} found` }); // 409 means confilct
  try {
    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username: username, password: hashedPassword };
    usersDB.setUsers([...usersDB.users, newUser]);
    // store the new user in the json file
    fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    res.status(201).json({ success: `New user ${username} created` });
  } catch (error) {
    res.status(500).json({ message: error.message }); // 500 means server error
  }
};

module.exports = { handleNewUser };
