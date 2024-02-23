const express = require("express");
const app = express();

app.use(express.json());

// Import routes
const userRouter = require("./routers/userRouter");
const categoryRouter = require("./routers/categoryRouter");
const budgetRouter = require("./routers/budgetRouter");
const transactionRouter = require("./routers/transactionRouter");
const groupRouter = require("./routers/groupRouter");
const groupTransactionRouter = require("./routers/groupTransactionRouter");

// Use routes
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/budgets", budgetRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/groups", groupRouter);
app.use("/api/groupTransactions", groupTransactionRouter);

// Finally start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});
