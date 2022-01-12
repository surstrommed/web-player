import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export const SearchField = () => {
  return (
    <div className="input-group rounded">
      <input
        type="search"
        className="form-control rounded"
        placeholder="Музыка, пользователи..."
        aria-label="Поиск"
        aria-describedby="search-addon"
      />
      <Button variant="primary" id="search-addon">
        <FontAwesomeIcon icon={faSearch} />
      </Button>
    </div>
  );
};
