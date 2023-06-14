// api/login.js

import jwt from "jsonwebtoken";

const users = [
  { username: "tushar02", email: "abcd@gmail.com", password: "xyz123" },
  { username: "ralul13", email: "xyz@gmail.com", password: "rah123" },
];

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { username, password } = req.body;

  // Find the user based on the provided username
  const user = users.find((user) => user.username === username);

  // Check if the user exists and the password is correct
  if (user && user.password === password) {
    // Generate a JWT token
    const token = jwt.sign({ username }, "secretKey", { expiresIn: "1h" });

    // Return the token as the response
    res.status(200).json({ token });
  } else {
    // Invalid credentials
    res.status(401).json({ error: "Invalid username or password" });
    alert("Not valid");
  }
}
