import React from 'react';
import Poster from './Poster'
import { Link } from "react-router-dom";
import { ReactComponent as ArrowLeft } from '../svg/arrow-point-to-left.svg'
import { ReactComponent as ArrowRight } from '../svg/arrow-point-to-right.svg'

class PostersSlider extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    const { number } = this.props;

    const controlLeft = document.getElementsByClassName('control-left')[number - 1];
    const controlRight = document.getElementsByClassName('control-right')[number - 1];
    const postersSlider = document.getElementsByClassName('posters-slider')[number - 1];

    // Initialize
    postersSlider.style.webkitTransform = `translateX(0px)`;

    controlLeft.addEventListener("click", () => {
      let currentPos = parseInt(postersSlider.style.transform.substring(
        postersSlider.style.transform.lastIndexOf("(") + 1, 
        postersSlider.style.transform.lastIndexOf("px")
      ));

      postersSlider.style.webkitTransitionDuration = "0.3s";
      postersSlider.style.webkitTransitionTimingFunction = "ease-out";
      postersSlider.style.webkitTransform = `translateX(${currentPos + 300}px)`;
    }, false);
    
    controlRight.addEventListener("click", () => {
      let currentPos = parseInt(postersSlider.style.transform.substring(
        postersSlider.style.transform.lastIndexOf("(") + 1, 
        postersSlider.style.transform.lastIndexOf("px")
      ));

      postersSlider.style.webkitTransitionDuration = "0.3s";
      postersSlider.style.webkitTransitionTimingFunction = "ease-out";
      postersSlider.style.webkitTransform = `translateX(${currentPos - 300}px)`;
    }, false);
  }

  render() {
    const { movies, language } = this.props;
    
    return (
      <div className="posters-slider-container row">
        <span className="control-left no-selection"><ArrowLeft fill="#fff" width="20" height="20" style={{ marginTop: 200, marginLeft: 20, backgroundColor: 'rgba(0, 0, 0, .7)', borderRadius: '50%', padding: 20 }} /></span>
          <div className="posters-slider row center no-selection">
          {
            movies.map((movie) => {
              return (
                <Link to={`/watch/${movie.id}`} key={`movie-${movie.id}`}>
                  <Poster movie={movie} language={language} />
                </Link>
              )
            })
          }
          </div>
        <span className="control-right"><ArrowRight fill="#fff" width="20" height="20" style={{ marginTop: 200, marginRight: 20, backgroundColor: 'rgba(0, 0, 0, .7)', borderRadius: '50%', padding: 20 }} /></span>
      </div>
    );
  }
}

export default PostersSlider;
