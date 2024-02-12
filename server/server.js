const app = require("./app");
const { DB_URI } = require("./src/config");
const mongoose = require("mongoose");
mongoose.connect('mongodb://db/WSIE', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //mongoose.connect(DB_URI); is what it used to be. this did not work

app.listen(3000, '0.0.0.0', () => {
    console.log("Server running on port 3000");
    console.log("_____________________________");
});