import React, { useState, useEffect } from 'react';
import config from "config"
import Poster from './Poster'
import { Link } from "react-router-dom";
import axios from 'axios';
import { ReactComponent as ArrowLeft } from 'svg/arrow-point-to-left.svg'
import { ReactComponent as ArrowRight } from 'svg/arrow-point-to-right.svg'

const PostersSlider = (props) => {

  const { movies, language } = props
  const [test, updateTest] = useState([])
  const [currentPos, updateCurrentPos] = useState(0)

  /*
  const getMovie = async(movie) => {
    const res = await axios.get(`${config.serverURL}/movies/${movie.id}`);
    if (res.data.success && res.data.movie) {
      return (
        <Link to={`/watch/${res.data._id}`} key={`movie-${res.data._id}`}>
          <Poster movie={res.data.movie} language={language} />
        </Link>
      )
    }
    return null
  }
  */

  // useEffect(() => {
  //   getMovie()
  // }, [])

  // const getMovie = () => {
  //   movies.forEach(async(movie)=> {
  //     const res = await axios.get(`${config.serverURL}/movies/${movie.id}`);
  //     //console.log(res)
  //     if (res.data.success && res.data.movie) {
  //       //console.log(res.data.movie)
  //       console.log(test)
  //       updateTest(
  //         //...test,
  //         res.data.movie.map((mov) => {
  //           //console.log(mov)
  //           return mov
  //         })
  //       )
  //       return null
  //     }
  //   })
  // }

  // console.log(test)

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
              movies.map((movie) => (
                <Link to={`/watch/${movie._id}`} key={`movie-${movie._id}`}>
                  <Poster movie={movie} language={language} />
                </Link>
              ))
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
