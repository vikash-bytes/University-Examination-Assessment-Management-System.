const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* ==========================================
   Fake Database (You can modify users here)
========================================== */

const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@uni.edu",
    password: "demo123",
    role: "admin",
  },
  {
    id: 2,
    name: "Student User",
    email: "student@uni.edu",
    password: "demo123",
    role: "student",
  },
   {
    id: 3,
    name: "Teacher User",
    email: "teacher@uni.edu",
    password: "demo123",
    role: "teacher",
  },
];

/* ==========================================
   Routes
========================================== */

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// LOGIN ROUTE
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  // Find user
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Check password
  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message: "Invalid password",
    });
  }

  // Fake token generation
  const fakeToken = `token-${user.id}-${Date.now()}`;

  // Successful login response
  res.status(200).json({
    success: true,
    message: "Login successful",
    token: fakeToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/* ==========================================
   Start Server
========================================== */

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});