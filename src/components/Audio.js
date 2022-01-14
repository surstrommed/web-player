import { Link } from "react-router-dom";
import { PlayerHeader } from "./PlayerHeader";

export const Audio = ({ personal }) => {
  return (
    <div>
      <PlayerHeader personal={personal} />
    </div>
  );
};
