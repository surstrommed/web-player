import React, { useState, useEffect } from "react";

export const PlayerHeader = ({ personal }) => {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    window.onscroll = () => {
      setOffset(window.pageYOffset);
    };
    return () => {
      setOffset(0);
    };
  }, []);

  return (
    <nav className={`mt-5 navbar ${offset > 50 ? "sticky" : ""}`}>
      <div className="container-fluid player-container">
        <span>#</span>
        <span>Название</span>
        <span>{personal ? "" : "Владелец"}</span>
      </div>
    </nav>
  );
};
