import { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { CMyDropzone } from "./Dropzone";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import { actionCreateNewPlaylist } from "./../actions/index";
import { PlayerHeader } from "./PlayerHeader";
import { Loader } from "./Loader";
import { Button } from "react-bootstrap";
import { CAudio } from "./Audio";
import { history } from "./../App";

const PlaylistTracks = ({ promise, tracks: { _id, url } = {} }) => {
  let idPlaylist = history.location.pathname.substring(
    history.location.pathname.lastIndexOf("/") + 1
  );
  let indexPlaylist;
  if (promise?.userPlaylists?.payload) {
    indexPlaylist = promise?.userPlaylists?.payload.findIndex(
      (playlist) => playlist?._id === idPlaylist
    );
  }

  return (
    <div>
      {promise?.userPlaylists?.payload[indexPlaylist]?.tracks ? (
        <div className="d-block mx-auto mt-2 container w-50">
          <PlayerHeader personal />
        </div>
      ) : null}
      {promise?.loadTracksToPlaylist?.status === "PENDING" ||
      promise?.playlistTracks?.status === "PENDING" ? (
        <Loader />
      ) : promise?.playlistTracks?.payload?.tracks ? (
        promise?.playlistTracks?.payload?.tracks.map((track, index) => (
          <div
            className="d-block mx-auto mt-2 container w-50"
            key={Math.random()}
          >
            <CAudio
              track={track}
              index={index}
              playlist={promise?.playlistTracks?.payload?.tracks}
              personal
              key={track._id}
            />
          </div>
        ))
      ) : (
        <h2 className="mt-5 text-center">
          {promise?.myUser?.payload?.nick
            ? promise?.myUser?.payload?.nick
            : "user"}
          , этот плейлист пуст.
        </h2>
      )}
    </div>
  );
};

const CPlaylistTracks = connect((state) => ({
  promise: state.promise,
  tracks: state.promise.uploadTrack?.payload || [],
}))(PlaylistTracks);

export const MyPlaylistTracks = () => (
  <>
    <h3 className="text-center">
      Перетащите аудио файл(-ы) для загрузки в этот плейлист.
    </h3>
    <CMyDropzone />
    <CPlaylistTracks />
  </>
);

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
          onClick={() => onPlaylistCreate(playlist)}
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
