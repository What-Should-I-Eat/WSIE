// Local Deployment
// const host = 'localhost';
// VM Deployment
const host = 'http://34.16.212.5/';

let DB_URI = "mongodb://" + host + ":27017/WSIE";
;

// Env set in docker-compose.yml
if (process.env.MONGO_DB_URI) {
    DB_URI = process.env.MONGO_DB_URI;
}

module.exports = {DB_URI};