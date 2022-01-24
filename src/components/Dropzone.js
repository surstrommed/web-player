import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { connect } from "react-redux";
import { actionSetAvatar, actionUploadTracks } from "../actions";
import { history } from "./../App";

const MyDropzone = ({ promise, onloadAvatar, onloadMusic }) => {
  let idPlaylist = history.location.pathname.substring(
    history.location.pathname.lastIndexOf("/") + 1
  );
  let indexPlaylist;
  if (promise?.userPlaylists?.payload) {
    indexPlaylist = promise?.userPlaylists?.payload.findIndex(
      (playlist) => playlist?._id === idPlaylist
    );
  }

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles[0].type.includes("audio")) {
        for (let i = 0; i < acceptedFiles.length; i++) {
          onloadMusic(acceptedFiles[i]);
        }
      } else {
        onloadAvatar(acceptedFiles[0]);
      }
    },
    [onloadAvatar, onloadMusic]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="mt-2 text-center customBorder mx-auto" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Поместите файлы сюда...</p>
      ) : (
        <p>
          Для загрузки перетащите файлы сюда или нажмите на поле и выберите
          файлы
        </p>
      )}
    </div>
  );
};

export const CMyDropzone = connect((state) => ({ promise: state.promise }), {
  onloadAvatar: actionSetAvatar,
  onloadMusic: actionUploadTracks,
})(MyDropzone);
