import { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { CAudio } from "./../Audio/Audio";
import { PlayerHeader } from "./PlayerHeader";
import { CPreloader } from "./../Other/Preloader";
import { CMyDropzone } from "./../Other/Dropzone";
import {
  actionCreateNewPlaylist,
  actionTracksToPlaylist,
} from "../../actions/types";

const PlaylistTrackItem = ({ track, key, playlist }) => {
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

const TracksInPlaylistSortable = ({
  route,
  playlistTracks,
  loadTracksToPlaylist,
}) => {
  let idPlaylist = route?.params?._id;
  const [newPlaylistTracks, setNewPlaylistTracks] = useState(playlistTracks);
  const onSortEnd = (e) => {
    let newChangedPlaylistTracks = arrayMoveImmutable(
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

const CTracksInPlaylistSortable = connect((state) => ({ route: state.route }), {
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
      {promise?.playlistTracks?.status === "RESOLVED" &&
      promise?.playlistTracks?.payload?.tracks?.length !== 0 ? null : (
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

export const MyPlaylistTracks = connect(
  (state) => ({ promise: state.promise }),
  null
)(({ promise }) => {
  return (
    <div>
      <h1 className="text-center">
        Плейлист {promise?.playlistTracks?.payload?.name || ""}
      </h1>
      <h3 className="text-center my-5">
        Перетащите аудио файл(-ы) для загрузки в этот плейлист:
      </h3>
      <CPreloader
        promiseName={"playlistTracks"}
        promiseState={promise}
        children={<CMyDropzone />}
      />
      <h6 className="text-center mt-3">
        Максимальное количество треков в плейлисте - 100 штук.
      </h6>
      <div className="d-block mx-auto mt-2 container w-50">
        {promise?.playlistTracks?.payload?.tracks &&
        promise?.playlistTracks?.payload?.tracks?.length !== 0 ? (
          <PlayerHeader personal />
        ) : null}
      </div>
      <CPlaylistTracks />
    </div>
  );
});

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
            Название плейлиста может быть от 2 до 15 символов.
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={playlist.length > 1 && playlist.length < 16 ? false : true}
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
      <div className="container" style={{ height: "300px" }}></div>
    </>
  );
};

export const CMyPlaylists = connect((state) => ({ promise: state.promise }), {
  onPlaylistCreate: actionCreateNewPlaylist,
})(MyPlaylists);
