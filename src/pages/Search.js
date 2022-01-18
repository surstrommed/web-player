import { connect } from "react-redux";
import { SearchField } from "./../components/SearchField";
import { AuthCheck } from "./../components/AuthCheck";
import { history } from "./../App";
import { actionFindTracks, actionFindUser } from "./../actions/index";
import { CTrack } from "../components/Track";
import { PlayerHeader } from "./../components/PlayerHeader";
import { Loader } from "./../components/Loader";

const Search = ({ auth, promise }) => {
  return (
    <div className="SearchPage">
      {auth.token && history.location.pathname === "/search" ? (
        <div className="d-block mx-auto mt-2 container w-50">
          <h1 className="text-center">Поиск по сайту</h1>
          <SearchField />
          {promise?.tracks?.payload?.length !== 0 ? <PlayerHeader /> : null}
          {promise.tracks.status === "PENDING" ? (
            <Loader />
          ) : promise?.tracks?.payload &&
            promise?.tracks?.payload?.length !== 0 ? (
            promise.tracks.payload.map((track, index) => (
              <CTrack audio={track} index={index} key={Math.random()} />
            ))
          ) : (
            <h2 className="mt-5 text-center">
              {promise?.user?.payload?.nick
                ? promise?.user?.payload?.nick
                : "user"}
              , на сайте не обнаружено треков.
            </h2>
          )}
        </div>
      ) : (
        <div className="d-block mx-auto mt-2 container w-50">
          <AuthCheck header="Поиск по сайту" />
        </div>
      )}
    </div>
  );
};

export const CSearch = connect(
  (state) => ({ auth: state.auth, promise: state.promise }),
  null
)(Search);
