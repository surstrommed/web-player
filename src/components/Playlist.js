import { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { CMyDropzone } from "./Dropzone";
import { actionCreateNewPlaylist } from "./../actions/index";
import { PlayerHeader } from "./PlayerHeader";
import { Loader } from "./Loader";
import { CTrack } from "./Track";
import { Button } from "react-bootstrap";
import { backURL } from "./../helpers/index";

const PlaylistTracks = ({ promise, tracks: { _id, url } = {} }) => (
  <div>
    {promise?.uploadTrack?.payload?.length !== 0 ? (
      <div className="d-block mx-auto mt-2 container w-50">
        <PlayerHeader personal />
      </div>
    ) : null}
  </div>
);

// <CTrack audio={} index={1} key={Math.random()} />

const CPlaylistTracks = connect((state) => ({
  promise: state.promise,
  tracks: state.promise.uploadTrack?.payload || [],
}))(PlaylistTracks);

// {promise?.userTracks?.payload?.length !== 0 ? (
//   <PlayerHeader personal />
// ) : null}
// {promise.userTracks.status === "PENDING" ? (
//   <Loader />
// ) : promise?.userTracks?.payload &&
//   promise?.userTracks?.payload?.length !== 0 ? (
//   promise.userTracks.payload.map((track, index) => (
//     <CTrack audio={track} index={index} key={Math.random()} />
//   ))
// ) : (
//   <h2 className="mt-5 text-center">
//     {promise?.user?.payload?.nick ? promise?.user?.payload?.nick : "user"},
//     ваша библиотека пуста.
//   </h2>
// )}
const MyPlaylistTracks = ({ promise }) => (
  <>
    <CMyDropzone />
    <CPlaylistTracks />
  </>
);

export const CMyPlaylistTracks = connect(
  (state) => ({ promise: state.promise }),
  null
)(MyPlaylistTracks);

const PlaylistEditor = ({
  entity = { array: [] },
  onSave,
  onFileDrop,
  fileStatus,
}) => {
  const [state, setState] = useState(entity);
  //по файлу в дропзоне:
  //дергать onFileDrop
  //fileStatus - информация о заливке файла из redux
  //через useEffect дождаться когда файл зальется
  //и сделать setState({...state, array: [...state.array, {объект файла с бэка с _id и url}]})
  //по react-sortable-hoc
  //делаете как в пример arrayMove для state.array
  //по кнопке сохранения делаем onSave(state)
  //где-то рядом остальные поля из state типа title name text
  //но это вы уже знаете
  // return (

  // )
};

const Playlist = ({ playlist: { _id, name } = {} }) => (
  <li className="d-flex">
    <div className="col-lg-6">
      <Link to={`/myplaylist/${_id}`}>{name}</Link>
    </div>
    <div className="col-lg-6">
      <Button className="ml-5">
        <i className="fas fa-trash-alt"></i>
      </Button>
    </div>
  </li>
);

const MyPlaylists = ({ promise, onPlaylistCreate }) => {
  const [playlist, setPlaylist] = useState("");
  return (
    <>
      <hr />
      <form>
        <div className="mb-3">
          <label forhtml="playlistCreate" className="form-label">
            Создание нового плейлиста:
          </label>
          <input
            className="form-control"
            id="playlistCreate"
            aria-describedby="playlistHelp"
            onChange={(e) => setPlaylist(e.target.value)}
          />
          <div id="playlistHelp" className="form-text">
            Название плейлиста может быть от 2 до 10 символов.
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={playlist.length > 1 && playlist.length < 11 ? false : true}
          onClick={() => {
            onPlaylistCreate(playlist);
          }}
        >
          Создать
        </button>
      </form>
      <hr />
      <div className="Playlists">
        <ul>
          {(promise?.userPlaylists?.payload || []).map((playlist) => (
            <Playlist playlist={playlist} key={Math.random()} />
          ))}
        </ul>
      </div>
    </>
  );
};

export const CMyPlaylists = connect((state) => ({ promise: state.promise }), {
  onPlaylistCreate: actionCreateNewPlaylist,
})(MyPlaylists);
