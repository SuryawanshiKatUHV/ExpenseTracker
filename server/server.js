require('dotenv').config(); // Loads the environment from .env file

const express = require("express");
const app = express();

// Enable json processing
app.use(express.json());

// Import routes
const userRouter = require("./routers/userRouter");
const categoryRouter = require("./routers/categoryRouter");
const budgetRouter = require("./routers/budgetRouter");
const transactionRouter = require("./routers/transactionRouter");
const groupRouter = require("./routers/groupRouter");
const groupTransactionRouter = require("./routers/groupTransactionRouter");

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

// Finally start the server
const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});
