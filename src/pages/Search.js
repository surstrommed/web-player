import { connect } from "react-redux";
import { SearchField } from "./../components/SearchField";
import { AuthCheck } from "./../components/AuthCheck";
import { history } from "./../App";
import { actionFindTracks, actionFindUser } from "./../actions/index";
import { Track } from "../components/Track";
import { PlayerHeader } from "./../components/PlayerHeader";
import { Loader } from "./../components/Loader";

const Search = ({ auth, promise }) => {
  return (
    <div className="SearchPage">
      {auth.token && history.location.pathname === "/search" ? (
        <div className="d-block mx-auto mt-2 container w-50">
          <h1>Поиск по сайту</h1>
          <SearchField />
          <PlayerHeader />
          {promise?.tracks?.payload ? (
            promise.tracks.payload.map((track, index) => (
              <Track audio={track} index={index} key={Math.random()} />
            ))
          ) : (
            <Loader />
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
  {
    actionTracks: actionFindTracks,
    actionUser: actionFindUser,
  }
)(Search);
