const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Endpoints for User management service

app.get("/api/users", (req, res) => {
  res.send("List of all the users");
});

app.get("/api/users/:id", (req, res) => {
  res.send("Gets specific user " + req.params.id);
});

app.post("/api/users", (req, res) => {
  res.send("Creates user");
});

app.put("/api/users/:id", (req, res) => {
  res.send("Updates specific user " + req.params.id);
});

app.delete("/api/users/:id", (req, res) => {
  res.send("Delete specific user " + req.params.id);
});

// Endpoints for Category management service

app.get("/api/categories", (req, res) => {
  res.send("List of all the categories");
});

app.get("/api/categories/:id", (req, res) => {
  res.send("Get specific category " + req.params.id);
});

app.post("/api/categories", (req, res) => {
  res.send("Create category ");
});

app.put("/api/categories/:id", (req, res) => {
  res.send("Update specific category " + req.params.id);
});

app.delete("/api/categories/:id", (req, res) => {
  res.send("Delete specific category " + req.params.id);
});

// Endpoints for Expense management service

app.get("/api/expenses", (req, res) => {
  res.send("List of all the expenses");
});

app.get("/api/expenses/:id", (req, res) => {
  res.send("Get specific expense " + req.params.id);
});

app.post("/api/expenses", (req, res) => {
  res.send("Create expense");
});

app.put("/api/expenses/:id", (req, res) => {
  res.send("Update specific expense " + req.params.id);
});

app.delete("/api/expenses/:id", (req, res) => {
  res.send("Delete specific expense " + req.params.id);
});

// Endpoints for Income management service

app.get("/api/incomes", (req, res) => {
  res.send("List of all the incomes");
});

app.get("/api/incomes/:id", (req, res) => {
  res.send("Get specific income " + req.params.id);
});

app.post("/api/incomes", (req, res) => {
  res.send("Create income");
});

app.put("/api/incomes/:id", (req, res) => {
  res.send("Update specific income " + req.params.id);
});

app.delete("/api/incomes/:id", (req, res) => {
  res.send("Delete specific income " + req.params.id);
});

// Endpoints for reporting service

//TBD

// Finally start the server

const port = 3000; //TBD get the port dynamically
app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});
