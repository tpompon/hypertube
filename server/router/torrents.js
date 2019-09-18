const express = require("express");
const router = express.Router();

const torrentStream = require('torrent-stream');
const PirateBay = require('thepiratebay');
const movieArt = require('movie-art');
const path = require('path');
const fs = require('fs');

const request = require('request');

const config = require('../config');

router.route('/yts/search/:search')
.get(async (req, res) => {
	request.get({url: `https://yts.lt/api/v2/list_movies.json?query_term=${req.params.search}`}, (err, results, body) => {
		if (err) {
			res.json({ success: false });
		} else {
			const searchResults = JSON.parse(body);
			if (searchResults.status === 'ok' && searchResults.data.movie_count !== 0) {

				let movies = [];
				searchResults.data.movies.forEach((movie) => {
					movie.torrents.forEach((torrent) => {
						torrent.magnet = `magnet:?xt=urn:btih:${movie.torrents[0].hash}&dn=${encodeURI(movie.title)}&tr=http://track.one:1234/announce&tr=udp://track.two:80`;
						torrent.magnet2 = `magnet:?xt=urn:btih:${movie.torrents[0].hash}&dn=${encodeURI(movie.title)}&tr=http://track.one:1234/announce&tr=udp://tracker.openbittorrent.com:80`;
					})
				})

				res.json({ success: true, count: searchResults.data.movie_count, results: searchResults });
			} else if (searchResults.data.movie_count === 0) {
				res.json({ success: true, count: 0 });
			} else {
				res.json({ success: false });
			}
		}
	})
})

router.route('/yts/:id')
.get((req, res) => {
	request.get({ url: `https://yts.lt/api/v2/movie_details.json?movie_id=${req.params.id}&with_images=true&with_cast=true`}, (err, results, body) => {
		if (err) {
			res.json({ success: false });
		} else {
			const movieInfos = JSON.parse(body);
			res.json({ success: true, result: movieInfos });
		}
	})
})

// router.route('/piratebay/:search')
// .get(async (req, res) => {
// 	const searchResults = await PirateBay.search(req.params.search, {
// 		orderBy: 'seeds',
// 		sortBy: 'desc'
// 	}).catch((err) => console.log(err));
// 	if (searchResults.length > 0) {
// 		movieArt(req.params.search, (error, response) => {
// 			res.json({ success: true, poster: response, results: searchResults });
// 		});
// 	} else {
// 		res.json({ success: false });
// 	}
// })

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
