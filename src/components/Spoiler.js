import { useState } from "react";
import { Loader } from "./Loader";

export const Spoiler = ({
  open = false,
  children = <Loader />,
  header = "Spoiler",
}) => {
  const [visible, setVisible] = useState(open);
  return (
    <div className="Spoiler">
      <div className="header" onClick={(e) => setVisible(!visible)}>
        <div>
          <span className="spoilerText">{header}</span>
          <span className="spoilerArrow">{visible ? "▲" : "▼"}</span>
        </div>
      </div>
      <div className="content">{visible && children}</div>
    </div>
  );
};
