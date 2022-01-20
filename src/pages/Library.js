import { connect } from "react-redux";
import { AuthCheck } from "./../components/AuthCheck";
import { history } from "./../App";
import { CMyPlaylists } from "../components/Playlist";

const Library = ({ auth, promise, actionTracks, actionUser }) => {
  return (
    <div className="SearchPage">
      {auth.token && history.location.pathname === "/library" ? (
        <div className="d-block mx-auto mt-2 container w-50">
          <h1 className="mb-3 text-center">
            Ваша библиотека плейлистов с музыкой, {promise?.user?.payload?.nick}
          </h1>
          <CMyPlaylists />
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
