const app = require("./app");
const { DB_URI } = require("./src/config");
const mongoose = require("mongoose");
const serverPort = 3001;

console.log("Connecting to Mongo at URI:", DB_URI);

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Successfully Connected to Mongo");

  app.listen(serverPort, '0.0.0.0', () => {
    console.log(`Server running on port ${serverPort}`);
    console.log("_____________________________");
  });
}).catch(error => {
  console.error("Failed to connect to MongoDB:", error);
});
