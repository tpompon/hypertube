import React, { useState } from 'react';
import Poster from './Poster'
import { Link } from "react-router-dom";
import { ReactComponent as ArrowLeft } from '../svg/arrow-point-to-left.svg'
import { ReactComponent as ArrowRight } from '../svg/arrow-point-to-right.svg'

const PostersSlider = (props) => {

  const [currentPos, updateCurrentPos] = useState(0)
  const { movies, language } = props

  return (
    <div className="posters-slider-container row">
      <span className="control-left no-selection"><ArrowLeft onClick={ () => updateCurrentPos(currentPos + 300) } fill="#fff" width="20" height="20" style={{ marginTop: 200, marginLeft: 20, backgroundColor: 'rgba(0, 0, 0, .7)', borderRadius: '50%', padding: 20 }} /></span>
        {
          movies.length > 0 ? (
            <div
              className="posters-slider row center no-selection"
              style={
                {
                  WebkitTransitionDuration: "0.3s",
                  WebkitTransitionTimingFunction: "ease-out",
                  WebkitTransform: `translateX(${currentPos}px)`,
                }
              }
            >
            {
              movies.map((movie) => {
                return (
                  <Link to={`/watch/${movie._id}`} key={`movie-${movie._id}`}>
                    <Poster movie={movie} language={language} />
                  </Link>
                )
              })
            }
            </div>
          ) : (
            <div className="posters-slider row center no-selection">
              <div className="no-movie-poster">
                No movies has been added to this list
              </div>
            </div>
          )
        }
      <span className="control-right"><ArrowRight onClick={ () => updateCurrentPos(currentPos - 300) } fill="#fff" width="20" height="20" style={{ marginTop: 200, marginRight: 20, backgroundColor: 'rgba(0, 0, 0, .7)', borderRadius: '50%', padding: 20 }} /></span>
    </div>
  )

}

export default PostersSlider;
