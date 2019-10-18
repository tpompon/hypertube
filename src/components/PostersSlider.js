import React, { useState } from "react";
import { withRouter } from "react-router-dom"
import Poster from "./Poster";
import { ReactComponent as ArrowLeft } from "svg/arrow-point-to-left.svg";
import { ReactComponent as ArrowRight } from "svg/arrow-point-to-right.svg";

const valuePos = 300

const PostersSlider = props => {
  const { movies, language, history, number } = props;
  const [isDraging, updateIsDraging] = useState(false)
  const [currentPos, updateCurrentPos] = useState(0)
  
  const mouseDown = (e) => {
    const startX = e.pageX
    let distanceTravelled = 0
    let isDrag = false
    const onMouseMove = (e) => {
      distanceTravelled = e.pageX - startX
      if (Math.abs(distanceTravelled) > 5) {
        if (!isDrag) {
          isDrag = true
          updateIsDraging(true)
        }
        newCurrentPos(currentPos + distanceTravelled)
      }
    }
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      if (!isDrag) {
        return
      }
      updateIsDraging(false)
    }
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }
  const newCurrentPos = (pos) => {
    const pageWidth = window.innerWidth
    const maxPosterShowInPage = Math.floor(pageWidth / valuePos)
    const index = Math.floor(-pos / valuePos)
    const length = movies.length
    if (pos > 0) {
      updateCurrentPos(0)
    } else if ((length - index) <= maxPosterShowInPage) {
      updateCurrentPos((length - 1 - maxPosterShowInPage) * -valuePos - (pageWidth - (maxPosterShowInPage * valuePos)))
    } else {
      updateCurrentPos(pos)
    }
  }

  return (
    <div className="posters-slider-container row" onMouseDown={ (e) => mouseDown(e) }>
      <span className="control-left no-selection">
        <ArrowLeft
          onClick={() => newCurrentPos(currentPos + valuePos)}
          fill="#fff"
          width="20"
          height="20"
          style={{
            marginTop: 200,
            marginLeft: 20,
            backgroundColor: "rgba(0, 0, 0, .7)",
            borderRadius: "50%",
            padding: 20
          }}
        />
      </span>
      {movies.length > 0 ? (
        <div
          className="posters-slider row center no-selection"
          style={{
            WebkitTransitionDuration: (isDraging) ? "" :  "0.3s",
            WebkitTransitionTimingFunction: (isDraging) ? "" : "ease-out",
            WebkitTransform: `translateX(${currentPos}px)`
          }}
        >
          {movies.map(movie => (
            <div
              key={`movie-${movie._id}-${number}`}
              onMouseUp={ () => (!isDraging) ? history.push(`/watch/${movie._id}`) : null }
            >
              <Poster movie={movie}language={language} />
            </div>
          ))}
        </div>
      ) : (
        <div className="posters-slider row center no-selection">
          <div className="no-movie-poster">
            No movies has been added to this list
          </div>
        </div>
      )}
      <span className="control-right">
        <ArrowRight
          onClick={() => newCurrentPos(currentPos - valuePos)}
          fill="#fff"
          width="20"
          height="20"
          style={{
            marginTop: 200,
            marginRight: 20,
            backgroundColor: "rgba(0, 0, 0, .7)",
            borderRadius: "50%",
            padding: 20
          }}
        />
      </span>
    </div>
  );
};

export default withRouter(PostersSlider)
