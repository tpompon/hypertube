const express = require("express");
const router = express.Router();
const config = require("../config");

const torrentStream = require("torrent-stream");
const path = require("path");

const request = require("request");

const sources = ["https://yst.am/api/v2", "https://yts.lt/api/v2"];
const selectedSource = sources[1];
// Don't forget to update source in Search for Poster

router.route("/yts/search/:search").get(async (req, res) => {
  request.get(
    {
      url: `${selectedSource}/list_movies.json?query_term=${req.params.search}`
    },
    (err, results, body) => {
      if (err) {
        res.json({ success: false });
      } else {
        const searchResults = JSON.parse(body);
        if (
          searchResults.status === "ok" &&
          searchResults.data.movie_count !== 0
        ) {
          let movies = [];
          searchResults.data.movies.forEach(movie => {
            movie.torrents.forEach(torrent => {
              torrent.magnet = `magnet:?xt=urn:btih:${
                movie.torrents[0].hash
              }&dn=${encodeURI(
                movie.title
              )}&tr=http://track.one:1234/announce&tr=udp://track.two:80`;
              torrent.magnet2 = `magnet:?xt=urn:btih:${
                movie.torrents[0].hash
              }&dn=${encodeURI(
                movie.title
              )}&tr=http://track.one:1234/announce&tr=udp://tracker.openbittorrent.com:80`;
            });
          });

          res.json({
            success: true,
            count: searchResults.data.movie_count,
            results: searchResults
          });
        } else if (searchResults.data.movie_count === 0) {
          res.json({ success: true, count: 0 });
        } else {
          res.json({ success: false });
        }
      }
    }
  );
});

router.route("/yts/:id").get((req, res) => {
  request.get(
    {
      url: `${selectedSource}/movie_details.json?movie_id=${req.params.id}&with_images=true&with_cast=true`
    },
    (err, results, body) => {
      if (err) {
        res.json({ success: false });
      } else {
        const movieInfos = JSON.parse(body);
        res.json({ success: true, result: movieInfos });
      }
    }
  );
})


const write206Headers = (res, metadata) => {
  res.writeHead(206, {
    "Accept-Ranges": "bytes",
    "Content-Range": "bytes " + metadata.start + "-" + metadata.end + "/" + metadata.total,
    "Connection": "keep-alive",
    "Content-Length": metadata.chunksize,
    "Content-Type": "video/mp4"
  })
}

router.route("/stream/:magnet").get(async (req, res) => {
  const range = req.headers.range
  const engine = torrentStream(req.params.magnet, { path: `./torrents` });
    engine.on("ready", () => {
      engine.files.forEach((file) => {
        if (
          path.extname(file.name) === ".mp4" ||
          path.extname(file.name) === ".mkv" ||
          path.extname(file.name) === ".avi"
        ) {
          if (range) {
            let [start, end] = range.replace(/bytes=/, "").split("-").map((e) => e && parseInt(e))
            end = end || file.length - 1
            const chunksize = (end - start) + 1
            let stream = file.createReadStream({ start, end });
            write206Headers(res, { start, end, total: file.length, chunksize })
            stream.pipe(res)
          }
        }
      });
    });
})

module.exports = router;