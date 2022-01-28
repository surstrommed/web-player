import { useState } from "react";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { validateEmail, validatePassword } from "./../helpers/index";
import { actionFullRegister } from "./../actions/types";

const RegisterForm = ({ promise, auth, onRegister }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  return (
    <div className="AuthForm mx-auto mt-5">
      <Form>
        {login.length === 0 ? null : validateEmail(login) ? (
          password.length === 0 ? null : validatePassword(password) ? null : (
            <Alert>
              Пароль должен быть от 6 символов, иметь хотя бы одну цифру и
              заглавную букву.
            </Alert>
          )
        ) : (
          <Alert>Email должен быть в формате: email@gmail.com.</Alert>
        )}
        {Object.keys(auth).length === 0 &&
        promise?.registration?.status === "RESOLVED" ? (
          <Alert>
            Произошла ошибка при регистрации, пожалуйста, повторите ещё раз.
            Возможно, такой пользователь уже существует.
          </Alert>
        ) : null}
        <h1 className="text-center">Зарегистрировать аккаунт</h1>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={2}>
            Почта:
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="email"
              required
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
              id="signupBtn"
              variant="success"
              disabled={
                validateEmail(login) && validatePassword(password)
                  ? false
                  : true
              }
              onClick={() => onRegister(login, password)}
            >
              Зарегистрироваться
            </Button>
          </Col>
          <Col sm={{ span: 10, offset: 2 }}>
            Есть аккаунт?{" "}
            <Link className="btn btn-warning" to={"/login"}>
              Авторизоваться
            </Link>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export const CSignUpForm = connect(
  (state) => ({ auth: state.auth, promise: state.promise }),
  {
    onRegister: actionFullRegister,
  }
)(RegisterForm);
