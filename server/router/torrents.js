const fs = require("fs")
const http = require("http")
const https = require("https")
const express = require("express");
const router = express.Router();

const torrentStream = require("torrent-stream");
const OpenSubtitles = require("opensubtitles-api")
const OS = new OpenSubtitles({
  useragent: "TemporaryUserAgent",
  ssl: false,
})
const path = require("path");

const request = require("request");

// Models
const Movie = require("../models/movie");
const User = require("../models/user");

const sources = ["https://yst.am/api/v2", "https://yts.lt/api/v2"];
let selectedSource = sources[1];

OS.login()
  .then((res) => {
    console.log('\x1b[36m%s\x1b[0m', '-> OpenSubtitles connection established');
  })
  .catch((error) => console.log('\x1b[31m%s\x1b[0m', '-> OpenSubtitles connection error'))

router.route("/yts/search").get(async (req, res) => {

  https.get('https://yts.lt/api/v2/list_movies.json', (res) => {
    if (res.statusCode !== 200)
      selectedSource = sources[0];
  })

  request.get({url: `${selectedSource}/list_movies.json?query_term=${req.query.search}${req.query.genre ? ('&genre=' + req.query.genre) : '' }${req.query.page ? ('&page=' + req.query.page) : '' }${req.query.sort ? ('&sort_by=' + req.query.sort) : ''}${req.query.order ? ('&order_by=' + req.query.order) : ''}` },
  async (err, results, body) => {
    if (err) {
      res.json({ success: false });
    } else {
        const parseBody = JSON.parse(body.replace(/^\ufeff/g,""))

        let searchResults = await setMoviesInfo(req.user._id, parseBody)
        if (searchResults) {
          const { minrating, maxrating, minyear, maxyear } = req.query
          const moviesFiltered = [];
          searchResults.forEach((movie) => {
            if (!movie.ratingAverage) movie.ratingAverage = 0;
            if (movie.ratingAverage >= parseInt(minrating) && movie.ratingAverage <= parseInt(maxrating) && movie.year >= minyear && movie.year <= maxyear)
              moviesFiltered.push(movie);
          })
          searchResults = moviesFiltered;
          res.json({
            success: true,
            count: searchResults.length,
            results: searchResults
          });
        }
        else res.json({ success: true, count: 0, results: [] })
    }
  });
});

const setMoviesInfo = (uid, body) => {
  const searchResults = body
  if (searchResults.status === "ok" && searchResults.data.movie_count !== 0 && searchResults.data.movies) {
    return Promise.all(
      searchResults.data.movies.map(async movie => {
        const responseMovie = await Movie.findOne({ _ytsId: movie.id }).exec()
        if (responseMovie) {
          if (responseMovie && responseMovie.ratings.length > 0) {
            let count = 0;
            let total = 0;
            responseMovie.ratings.forEach(el => {
              total += el.rating;
              count++;
            });
            movie.ratingAverage = Math.floor((total / count) * 100) / 100
            movie.ratingCount = count
          }
        }

        const responseWatchPercent = await User.findOne(
          { _id: uid },
          { inProgress: { $elemMatch: { ytsId: movie.id } } }).exec()
          if (responseWatchPercent) {
            if (responseWatchPercent.inProgress.length > 0)
              movie.watchPercent = responseWatchPercent.inProgress[0].percent
          }

        // Pas utile ?
        movie.torrents.map(torrent => {
          torrent.magnet = `magnet:?xt=urn:btih:${torrent.hash}&dn=${encodeURI(movie.title)}&tr=http://track.one:1234/announce&tr=udp://track.two:80`;
          torrent.magnet2 = `magnet:?xt=urn:btih:${torrent.hash}&dn=${encodeURI(movie.title)}&tr=http://track.one:1234/announce&tr=udp://tracker.openbittorrent.com:80`;
          return torrent
        })
        return movie
      })
    )
  }
  return false
}

router.route("/yts/:id").get((req, res) => {

  https.get('https://yts.lt/api/v2/list_movies.json', (res) => {
    if (res.statusCode !== 200)
      selectedSource = sources[0];
  })

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

router.route("/stream/:magnet").get((req, res) => {
  const engine = torrentStream(req.params.magnet, { path: "./torrents" })
  engine.on("ready", () => {
    engine.files.forEach((file) => {
      if (
        path.extname(file.name) === ".mp4" ||
        path.extname(file.name) === ".mkv" ||
        path.extname(file.name) === ".avi"
      ) {
        if (fs.existsSync(`./torrents/${file.path}`)) {
          fs.stat(`./torrents/${file.path}`, function(err, stats) {
            if (err) {
              if (err.code === 'ENOENT') {
                // 404 Error if file not found
                return res.sendStatus(404);
              }
            res.end(err);
            }
            var range = req.headers.range;
            if (!range) {
             // 416 Wrong range
             return res.sendStatus(416);
            }
            const positions = range.replace(/bytes=/, "").split("-");
            let start = parseInt(positions[0], 10);
            const total = stats.size;
            const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
            if (start >= end)
              start = end
            const chunksize = (end - start) + 1;
            res.writeHead(206, {
              "Content-Range": "bytes " + start + "-" + end + "/" + total,
              "Accept-Ranges": "bytes",
              "Content-Length": chunksize,
              "Content-Type": "video/mp4"
            })
            var stream = fs.createReadStream(`./torrents/${file.path}`, { start, end })
              .on("open", function() {
                stream.pipe(res);
              }).on("error", function(err) {
                res.end(err);
              })
          })
        } else {
          const fileStream = file.createReadStream()
          fileStream.pipe(res)
        }
      }
    })
  })
})

const getSubtitles = async(imdbid, langs) => {
  try {
    const response = await OS.search({ imdbid, sublanguageid: langs.join(), limit: 'best' })
    return Promise.all(
      Object.entries(response).map(async(entry) => {
        const langCode = entry[0]
        return new Promise ((resolve, reject) => {
          let req = http.get(entry[1].vtt)
          req.on("response", (res) => {
            const file = fs.createWriteStream(`./subtitles/${imdbid}_${langCode}`)
            const stream = res.pipe(file)
            stream.on('finish', () => {
              fs.readFile(`./subtitles/${imdbid}_${langCode}`, "utf8", (err, content) => {
                if (!err) {
                  const buffer = Buffer.from(content);
                  resolve({ key: langCode, value: buffer.toString("base64") })
                }
              })
            })
          })
          req.on("error", error => {
            reject(error)
          })
        })
      })
    )
  } catch (error) {
    //console.log(error)
  }
}

router.route("/subtitles/:imdbid").get(async(req, res) => {
  const { imdbid } = req.params
  const langs = ["fre", "eng"]
  try {
    const response = await getSubtitles(imdbid, langs)
    let subtitles = {}
    if (response) {
      response.forEach((subtitle) => {
        subtitles = {
          ...subtitles,
          [subtitle.key]: subtitle.value,
        }
      })
    }
    res.json({ subtitles })
  } catch (error) {
    res.json({ error })
  }
})

module.exports = router;