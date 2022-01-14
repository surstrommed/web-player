import { connect } from "react-redux";
import { AuthCheck } from "./../components/AuthCheck";
import { history } from "./../App";
import { actionFindTracks, actionFindUser } from "./../actions/index";
import { CMyDropzone } from "../components/Dropzone";
import { Audio } from "./../components/Audio";

const Library = ({ auth, promise, actionTracks, actionUser }) => {
  return (
    <div className="SearchPage">
      {auth.token && history.location.pathname === "/library" ? (
        <div className="d-block mx-auto mt-2 container w-50">
          <h1 className="mb-3">
            Ваша библиотека с музыкой, {promise?.user?.payload?.nick}
          </h1>
          <CMyDropzone />
          <Audio personal />
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
