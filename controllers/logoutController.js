const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  // on client, also delete the access token
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(201).json({ message: "There is no cookie" }); // successful but no content

  const refreshToken = cookies.jwt;

  // check if refreshToken is in db
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.status(201).json({ message: "There is no found user" });
  }
  // Delete refresh token from db
  const otherUsers = usersDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" };
  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users)
  );
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); // in prod, make sure to add secure:true to only serve on https rather than http
  res.status(200).json({ message: "Cookie deleted" });
};

module.exports = { handleLogout };
