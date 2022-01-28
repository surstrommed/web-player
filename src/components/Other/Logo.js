import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const LogoIcon = () => <FontAwesomeIcon icon={faMusic} color="#0B5ED7" />;

export const Logo = () => (
  <Link to="/" className="navbar-brand customBrand">
    <LogoIcon /> Navy Web Player
  </Link>
);
