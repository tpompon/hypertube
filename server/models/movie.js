const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
	name_fr: { type: String, required: true },
	name_en: { type: String, required: true },
	description_fr: { type: String, required: true },
	description_en: { type: String, required: true },
	path: String,
	poster: String,
	author: String,
	ratings: [{
		uid: String,
		rating: Number
	}],
	comments: [{
		author: String,
		content: String,
		report: {
			type: Number,
			default: 0
		}
	}],
	created_at: Date,
	updated_at: Date
});

MovieSchema.pre('save', (next) => {
	const currentDate = new Date();
	this.updated_at = currentDate;
	if (!this.created_at)
		this.created_at = currentDate;
	next();
});

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;
