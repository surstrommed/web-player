import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { connect } from "react-redux";
import { actionAboutMe, actionSetAvatar } from "../actions";

const MyDropzone = ({ onload, aboutMe }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onload(acceptedFiles[0]);
      aboutMe();
    },
    [onload, aboutMe]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="mt-2 text-center customBorder" {...getRootProps()}>
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

export const CMyDropzone = connect(null, {
  onload: actionSetAvatar,
  aboutMe: actionAboutMe,
})(MyDropzone);
