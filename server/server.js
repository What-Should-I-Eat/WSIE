const app = require("./app");
const { DB_URI } = require("./src/config");
const mongoose = require("mongoose");
const serverPort = 3000;

console.log("Connecting to Mongo at URI:", DB_URI);

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(serverPort, '0.0.0.0', () => {
  console.log(`Server running on port ${serverPort}`);
  console.log("_____________________________");
});