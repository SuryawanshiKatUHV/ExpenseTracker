require('dotenv').config(); // Loads the environment from .env file

const express = require("express");
const app = express();

// Enable json processing
app.use(express.json());

// Import routes
const userRouter = require("./routers/user");
const categoryRouter = require("./routers/category");
const budgetRouter = require("./routers/budget");
const transactionRouter = require("./routers/transaction");
const groupRouter = require("./routers/group");
const groupTransactionRouter = require("./routers/groupTransaction");

// Use routes
app.get("/", (req, res) => {
  res.send("Hello from the server");
});
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/budgets", budgetRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/groups", groupRouter);
app.use("/api/groupTransactions", groupTransactionRouter);

// Export the app instance, this will be used by Jest to perform unit testing
module.exports = app;

console.log(`app.js is loaded`);