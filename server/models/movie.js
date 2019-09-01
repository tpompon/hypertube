const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
	name_fr: { type: String, required: true },
	name_en: { type: String, required: true },
	description_fr: { type: String, required: true },
	description_en: { type: String, required: true },
	poster: String,
	author: String,
	rating: Number,
	comments: [{
		author: String,
		content: String
	}],
	created_at: Date,
	updated_at: Date
});

movieSchema.pre('save', (next) => {
	const currentDate = new Date();
	this.updated_at = currentDate;
	if (!this.created_at)
		this.created_at = currentDate;
	next();
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
