import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { connect } from "react-redux";
import { actionSetAvatar, actionUploadTracks } from "../../actions/types";

const MyDropzone = ({ promise, onloadAvatar, onloadMusic }) => {
  const [error, setError] = useState(false);
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles[0].type.includes("audio")) {
        if (
          acceptedFiles.length +
            (promise?.playlistTracks?.payload?.tracks
              ? promise?.playlistTracks?.payload?.tracks?.length
              : 0) <
          100
        ) {
          for (let i = 0; i < acceptedFiles.length; i++) {
            onloadMusic(acceptedFiles[i]);
          }
        } else {
          setError(true);
        }
      } else {
        onloadAvatar(acceptedFiles[0]);
      }
    },
    [onloadAvatar, onloadMusic]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      className={`${
        error ? "text-danger" : null
      } mt-2 text-center customBorder mx-auto`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? setError(false) : null}
      {isDragActive ? (
        <p>Поместите файлы сюда...</p>
      ) : (
        <p>
          {error
            ? "Ошибка! Максимально допустимое количество треков в плейлисте - 100 штук."
            : "Для загрузки перетащите файлы сюда или нажмите на поле и выберите их локально."}
        </p>
      )}
    </div>
  );
};

export const CMyDropzone = connect((state) => ({ promise: state.promise }), {
  onloadAvatar: actionSetAvatar,
  onloadMusic: actionUploadTracks,
})(MyDropzone);
