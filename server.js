require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());
let users = [];
app.get("/users", (req, res) => {
  res.send(users);
});

app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: req.body.username, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.username == req.body.username);
  if (user == null) {
    res.status(404).json({ message: "404 user is not found" });
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.send("Not Allowed");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.listen(process.env.PORT_NUMBER, () => {
  console.log(`running server`);
});
