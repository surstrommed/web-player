import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

export const AuthCheck = ({ header }) => {
  return (
    <div>
      <Alert>
        <h2>{header}</h2>
        <p>
          Чтобы видеть треки других пользователей, ваши треки, ваш профиль и
          остальное необходимо войти в аккаунт. Если у вас ещё нет аккаунта -
          зарегистрируйтесь!
        </p>
        <Link to="/signup" className="btn btn-outline-primary">
          Зарегистрироваться
        </Link>{" "}
        <Link to="/login" className="btn btn-outline-primary">
          Войти
        </Link>
      </Alert>
    </div>
  );
};
