import { connect } from "react-redux";
import { CAudio } from "./Audio";

const Tracks = ({ tracks, player }) => {
  return (
    <>
      {tracks.map((track, index) => (
        <CAudio track={track} index={index} playlist={tracks} key={track._id} />
      ))}
    </>
  );
};

export const CTracks = connect(
  (state) => ({ player: state.player }),
  null
)(Tracks);
