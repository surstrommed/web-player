import { useState } from "react";
import { actionFullLogin } from "./../actions/index";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const LoginForm = ({ promise, onLogin }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  return (
    <div className="AuthForm mx-auto mt-5">
      <Form>
        {promise.login &&
        promise.login.status === "RESOLVED" &&
        !promise.login.payload ? (
          <Alert>
            Извините, но такого пользователя не существует, попробуйте
            зарегистрироваться или повторите ещё раз.
          </Alert>
        ) : null}
        <h1 className="text-center">Вход в аккаунт</h1>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={2}>
            Почта:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Введите вашу почту"
              onChange={(e) => setLogin(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalPassword"
        >
          <Form.Label column sm={2}>
            Пароль:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type={passwordShown ? "text" : "password"}
              placeholder="Введите ваш пароль"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="mt-2"
              variant="secondary"
              onClick={() => setPasswordShown(!passwordShown)}
            >
              {`${passwordShown ? "Скрыть" : "Показать"} пароль`}
            </Button>
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Col sm={{ span: 10, offset: 2 }} className="my-3">
            <Button
              variant="success"
              disabled={login.length < 1 || password.length < 1 ? true : false}
              onClick={() => onLogin(login, password)}
            >
              Войти
            </Button>
          </Col>
          <Col sm={{ span: 10, offset: 2 }}>
            Нет аккаунта?{" "}
            <Link className="btn btn-warning" to={"/signup"}>
              Зарегистрироваться
            </Link>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export const CLoginForm = connect((state) => ({ promise: state.promise }), {
  onLogin: actionFullLogin,
})(LoginForm);
