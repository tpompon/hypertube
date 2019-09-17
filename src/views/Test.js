import React from 'react';
import axios from 'axios'
import config from '../config'

class Test extends React.Component {

  constructor(props) {
    super(props);
    this.search = React.createRef();
    this.state = {
      movies: []
    }
  }

  componentDidMount() {

  }

  fetchMovies = () => {
    const search = this.search.current.value;
    if (search.trim() !== '') {
      axios.get(`http://${config.hostname}:${config.port}/torrents/yts/${search}`)
      .then((res) => {
        if (res.data.count !== 0) {
          this.setState({ movies: res.data.results.data.movies });
        } else {
          alert('No result');
        }
      })
    } else {
      alert('empty search');
    }
  }

  render() {

    return (
      <div>
        <h1>Test page</h1>
        <input ref={this.search} type="text" placeholder="search" />
        <button onClick={() => this.fetchMovies()}>Submit</button>
        {
          this.state.movies.map((movie) => {
            return (
              <div key={movie.slug}>
                <h1>{movie.title}</h1>
                <img src={movie.medium_cover_image} alt={movie.slug} />
                <iframe width="500" height="500"
                  src={`https://www.youtube.com/embed/${movie.yt_trailer_code}`}>
                </iframe>
                <a style={{color: 'yellow'}} href={`https://www.imdb.com/title/${movie.imdb_code}`}>IMDb</a>
                <h2>Torrents:</h2>
                {
                  movie.torrents.map((torrent) => {
                    return (
                      <div>
                        <a style={{color: 'red'}} href={torrent.magnet}>Magnet</a> / <a style={{color: 'red'}} href={torrent.magnet2}>Magnet 2</a>
                        <br />
                        Quality: {torrent.quality}
                        <br />
                        Size: {torrent.size}
                        <br /><br />
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default Test;
