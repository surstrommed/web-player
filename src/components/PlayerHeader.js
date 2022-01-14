import React, { useState, useEffect } from "react";

export const PlayerHeader = ({ personal }) => {
 const [offset, setOffset] = useState(0);
  useEffect(() => {
    window.onscroll = () => {
      setOffset(window.pageYOffset);
    };
  }, []);

  return (
    <>
      <header
        className={`mt-5 header-section player-container ${
          offset > 50 ? "sticky" : ""
        }`}
      >
        <div>#</div>
        <div>Название</div>
        <div>{personal ? "Плейлист" : "Владелец"}</div>
        <div>Дата добавления</div>
        <div>Длительность</div>
      </header>
    </>
  );
};
