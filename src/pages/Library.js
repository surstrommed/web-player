import { connect } from "react-redux";
import { AuthCheck } from "./../components/AuthCheck";
import { history } from "./../App";
import { actionFindTracks, actionFindUser } from "./../actions/index";
import { CMyDropzone } from "../components/Dropzone";
import { Track } from "../components/Track";
import { PlayerHeader } from "./../components/PlayerHeader";
import { Loader } from "./../components/Loader";

const Library = ({ auth, promise, actionTracks, actionUser }) => {
  return (
    <div className="SearchPage">
      {auth.token && history.location.pathname === "/library" ? (
        <div className="d-block mx-auto mt-2 container w-50">
          <h1 className="mb-3">
            Ваша библиотека с музыкой, {promise?.user?.payload?.nick}
          </h1>
          <CMyDropzone />
          <PlayerHeader personal />
          <Track />
          {promise?.tracks?.payload ? (
            promise.tracks.payload.map((track, index) =>
              track.owner._id === auth.payload.sub.id ? (
                <Track audio={track} index={index} key={Math.random()} />
              ) : (
                <h2>В вашей библиотеке нет треков.</h2>
              )
            )
          ) : (
            <Loader />
          )}
        </div>
      ) : (
        <div className="d-block mx-auto mt-2 container w-50">
          <AuthCheck header="Ваша музыка" />
        </div>
      )}
    </div>
  );
};

export const CLibrary = connect(
  (state) => ({ auth: state.auth, promise: state.promise }),
  {
    actionTracks: actionFindTracks,
    actionUser: actionFindUser,
  }
)(Library);
