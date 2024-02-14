const express = require("express");
const app = express();

app.use(express.json());

// Import routes
const userRouter = require("./routers/userRouter");
const categoryRouter = require("./routers/categoryRouter");
const transactionRouter = require("./routers/transactionRouter");
const groupRouter = require("./routers/groupRouter");
const transferRouter = require("./routers/transferRouter");

// Use routes
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/groups", groupRouter);
app.use("/api/transfers", transferRouter);

// Finally start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});
