import { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { CMyDropzone } from "./Dropzone";
import {
  actionCreateNewPlaylist,
  actionTracksToPlaylist,
} from "./../actions/index";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { CAudio } from "./Audio";
import { history } from "./../App";
import { CPreloader } from "./Preloader";

const PlaylistTrackItem = ({ track, index, key, playlist }) => {
  return (
    <div className="d-block mx-auto mt-2 container w-50" key={key}>
      <CAudio track={track} playlist={playlist} personal />
    </div>
  );
};

const SortableItem = SortableElement(PlaylistTrackItem);

const PlaylistTracksList = ({ playlistTracks }) => {
  return (
    <div>
      {(playlistTracks || []).map((track, i) => {
        return (
          <SortableItem
            track={track}
            index={i}
            key={track._id}
            playlist={playlistTracks}
          />
        );
      })}
    </div>
  );
};

const SortableList = SortableContainer(PlaylistTracksList);

const TracksInPlaylistSortable = ({ playlistTracks, loadTracksToPlaylist }) => {
  let idPlaylist = history.location.pathname.substring(
    history.location.pathname.lastIndexOf("/") + 1
  );
  const [newPlaylistTracks, setNewPlaylistTracks] = useState(playlistTracks);
  const onSortEnd = (e) => {
    var newChangedPlaylistTracks = arrayMoveImmutable(
      newPlaylistTracks,
      e.oldIndex,
      e.newIndex
    );
    setNewPlaylistTracks(newChangedPlaylistTracks);
    const newChangedPlaylistIdTracks = [];
    newChangedPlaylistTracks.map((newTrack) =>
      newChangedPlaylistIdTracks.push({ _id: newTrack?._id })
    );
    loadTracksToPlaylist(idPlaylist, newChangedPlaylistIdTracks);
  };
  return (
    <SortableList playlistTracks={newPlaylistTracks} onSortEnd={onSortEnd} />
  );
};

const CTracksInPlaylistSortable = connect(null, {
  loadTracksToPlaylist: actionTracksToPlaylist,
})(TracksInPlaylistSortable);

const PlaylistTracks = ({ promise, tracks: { _id, url } = {} }) => {
  return (
    <div>
      <CPreloader
        promiseName={"playlistTracks"}
        promiseState={promise}
        children={
          <CTracksInPlaylistSortable
            playlistTracks={promise?.playlistTracks?.payload?.tracks}
          />
        }
      />
      <CPreloader
        promiseName={"myUser"}
        promiseState={promise}
        children={null}
      />
      {promise?.playlistTracks?.payload?.tracks ? null : (
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

const Playlist = ({ playlist: { _id, name } = {} }) => (
  <li className="d-flex">
    <div className="col-lg-6">
      <Link to={`/myplaylist/${_id}`}>{name}</Link>
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
