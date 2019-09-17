const express = require("express");
const router = express.Router();

const torrentStream = require('torrent-stream');
const PirateBay = require('thepiratebay');
const movieArt = require('movie-art');
const path = require('path');
const fs = require('fs');

const config = require('../config');

router.route('/:search')
.get(async (req, res) => {
	const searchResults = await PirateBay.search(req.params.search, {
		orderBy: 'seeds',
		sortBy: 'desc'
	}).catch((err) => console.log(err));
	if (searchResults.length > 0) {
		movieArt(req.params.search, (error, response) => {
			res.json({ success: true, poster: response, results: searchResults });
		});
	} else {
		res.json({ success: false });
	}
})

router.route('/download/:search')
.get(async (req, res) => {
	const searchResults = await PirateBay.search(req.params.search, {
	  orderBy: 'seeds',
	  sortBy: 'desc'
	}).catch((err) => console.log(err));
	if (searchResults.length > 0) {
	  movieArt(req.params.search, (error, response) => {
		const engine = torrentStream(searchResults[0].magnetLink);
  
		engine.on('download', (piece) => {
		  console.log(piece)
		})
  
		engine.on('ready', () => {
			engine.files.forEach(async (file) => {
			  if (path.extname(file.name) === '.mp4' || path.extname(file.name) === '.mkv' || path.extname(file.name) === '.avi') {
				let stream = await file.createReadStream();
				let writeStream = await fs.createWriteStream(__basedir + `/torrents/${req.params.search}${path.extname(file.name)}`);
				stream.pipe(writeStream);
  
				console.log('filename:', file.name);
				res.json({ poster: response, result: searchResults[0], moviePath: `http://${config.server.host}:${config.server.port}/torrents/${req.params.search}${path.extname(file.name)}` });
  
				writeStream.on('finish', () => {
				  console.log(writeStream.path);
				  console.log("Write completed.");
				});
				writeStream.on('error', (err) => {
				  console.log(err.stack);
				});
			  }
			});
		});
	  });
	} else {
	  res.json({ success: false });
	}
})

module.exports = router;
