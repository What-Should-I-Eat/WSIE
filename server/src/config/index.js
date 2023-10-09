const host = 'localhost'

let DB_URI = "mongodb://" + host + ":27017/ingredients";

if(process.env.MONGO_DB_UI)
{
    DB_URI = process.env.MONGO_DB_UI;
}

module.exports = {
    DB_URI
};