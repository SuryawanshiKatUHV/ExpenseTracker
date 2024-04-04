const app = require("./app");

// Finally start the server
const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});
