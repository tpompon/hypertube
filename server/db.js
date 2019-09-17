const mongoose = require('mongoose');
const config = require('./config');

const { db: { host, port, name } } = config;
const connectionString = `mongodb://${host}:${port}/${name}`;
const options = {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: true
}

mongoose.connect(connectionString, options);
const db = mongoose.connection;

module.exports = db;
