import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { connect } from "react-redux";
import { actionSetAvatar, actionUploadTracks } from "../../actions/types";

const MyDropzone = ({ route, promise, onloadAvatar, onloadMusic }) => {
  const [tracksError, setTracksError] = useState(false);
  const [typeError, setTypeError] = useState(false);
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
          if (route?.path.includes("myplaylist")) {
            for (let i = 0; i < acceptedFiles.length; i++) {
              onloadMusic(acceptedFiles[i]);
            }
          } else {
            setTypeError(true);
          }
        } else {
          setTracksError(true);
        }
      } else {
        if (route?.path.includes("profile")) {
          onloadAvatar(acceptedFiles[0]);
        } else {
          setTypeError(true);
        }
      }
    },
    [onloadAvatar, onloadMusic]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      className={`${
        tracksError || typeError ? "text-danger" : null
      } mt-2 text-center customBorder mx-auto`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {isDragActive ? (setTypeError(false), setTracksError(false)) : null}
      {isDragActive ? (
        <p>Поместите файлы сюда...</p>
      ) : (
        <p>
          {tracksError
            ? "Ошибка! Максимально допустимое количество треков в плейлисте - 100 штук."
            : typeError
            ? "Ошибка! Недопустимый тип файла для загрузки!"
            : "Для загрузки перетащите файлы сюда или нажмите на поле и выберите их локально."}
        </p>
      )}
    </div>
  );
};

export const CMyDropzone = connect(
  (state) => ({ promise: state.promise, route: state.route }),
  {
    onloadAvatar: actionSetAvatar,
    onloadMusic: actionUploadTracks,
  }
)(MyDropzone);
