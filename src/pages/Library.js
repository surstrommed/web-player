import { connect } from "react-redux";
import { CMyPlaylists } from "../components/Playlist";

const Library = ({ promise }) => {
  return (
    <div className="SearchPage">
      <div className="d-block mx-auto mt-2 container w-50">
        <h1 className="mb-3 text-center">
          Ваша библиотека плейлистов с музыкой, {promise?.myUser?.payload?.nick}
        </h1>
        <CMyPlaylists />
      </div>
    </div>
  );
};

export const CLibrary = connect(
  (state) => ({ promise: state.promise }),
  null
)(Library);
