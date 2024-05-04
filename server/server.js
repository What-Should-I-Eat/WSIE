const app = require("./app");
const { DB_URI } = require("./src/config");
const mongoose = require("mongoose");

console.log("Connecting to Mongo at URI:", DB_URI);

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(3000, '0.0.0.0', () => {
  console.log("Server running on port 3000");
  console.log("_____________________________");
});