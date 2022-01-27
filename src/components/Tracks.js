import { connect } from "react-redux";
import { CAudio } from "./Audio";
import { useState, useEffect } from "react";
import { actionAllTracks, actionFullSkipTracks } from "../actions";
import { skipValue } from "./../helpers/index";

const Tracks = ({
  tracks,
  skip,
  getAllTracks,
  skipAllTracks,
  search,
  searchResults,
}) => {
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if (flag) {
      window.scrollTo(0, 0);
      getAllTracks(skip);
      setFlag(false);
    }
  }, [flag]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);

    return function () {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, [tracks]);

  const scrollHandler = (e) => {
    if (
      e.target.documentElement.scrollHeight -
        (e.target.documentElement.scrollTop + window.innerHeight) ===
      0
    ) {
      setFlag(true);
      skipAllTracks(skipValue);
    }
  };

  return (
    <>
      {search
        ? (searchResults || []).map((track, index) => (
            <CAudio
              track={track}
              index={index}
              playlist={searchResults}
              key={track._id}
            />
          ))
        : (tracks || []).map((track, index) => (
            <CAudio
              track={track}
              index={index}
              playlist={tracks}
              key={track._id}
            />
          ))}
    </>
  );
};

export const CTracks = connect(
  (state) => ({
    tracks: state?.loadedTracks?.loadedTracks,
    skip: state?.loadedTracks?.skipTracks,
    searchResults: state?.search?.searchResult?.payload?.payload,
  }),
  {
    getAllTracks: actionAllTracks,
    skipAllTracks: actionFullSkipTracks,
  }
)(Tracks);
