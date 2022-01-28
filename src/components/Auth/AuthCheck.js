import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

export const AuthCheck = ({ header = "Ошибка доступа" }) => {
  return (
    <div className="d-block mx-auto mt-5 container w-50">
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
