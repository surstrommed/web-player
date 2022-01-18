import { connect } from "react-redux";
import { AuthCheck } from "./../components/AuthCheck";
import { history } from "./../App";
import { actionFindUser, actionUserTracks } from "./../actions/index";
import { CMyDropzone } from "../components/Dropzone";
import { CTrack } from "../components/Track";
import { PlayerHeader } from "./../components/PlayerHeader";
import { Loader } from "./../components/Loader";

const Library = ({ auth, promise, actionTracks, actionUser }) => {
  return (
    <div className="SearchPage">
      {auth.token && history.location.pathname === "/library" ? (
        <div className="d-block mx-auto mt-2 container w-50">
          <h1 className="mb-3 text-center">
            Ваша библиотека с музыкой, {promise?.user?.payload?.nick}
          </h1>
          <CMyDropzone />
          {promise?.userTracks?.payload?.length !== 0 ? (
            <PlayerHeader personal />
          ) : null}
          {promise.userTracks.status === "PENDING" ? (
            <Loader />
          ) : promise?.userTracks?.payload &&
            promise?.userTracks?.payload?.length !== 0 ? (
            promise.userTracks.payload.map((track, index) => (
              <CTrack audio={track} index={index} key={Math.random()} />
            ))
          ) : (
            <h2 className="mt-5 text-center">
              {promise?.user?.payload?.nick
                ? promise?.user?.payload?.nick
                : "user"}
              , ваша библиотека пуста.
            </h2>
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
  null
)(Library);
