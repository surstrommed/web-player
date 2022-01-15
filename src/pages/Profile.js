import { connect } from "react-redux";
import { history } from "./../App";
import { Button, Form, Row, Col, Alert } from "react-bootstrap";
import { AuthCheck } from "./../components/AuthCheck";
import { useState } from "react";

import {
  backURL,
  validateEmail,
  validatePassword,
  validateNickname,
} from "./../helpers/index";
import {
  actionSetNickname,
  actionSetEmail,
  actionSetNewPassword,
} from "./../actions/index";
import { Loader } from "../components/Loader";
import { CMyDropzone } from "../components/Dropzone";
import { Spoiler } from "../components/Spoiler";

const Profile = ({
  auth,
  promise,
  nickUpdate,
  emailUpdate,
  changePassword,
}) => {
  const [login, setLogin] = useState("");
  const [nick, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);

  return promise?.user?.status === "PENDING" ? (
    <Loader />
  ) : (
    <div className="ProfilePage">
      {auth.token && history.location.pathname === "/profile" ? (
        <div className="d-block mx-auto mt-2 container w-50">
          <h1>
            Ваш профиль,{" "}
            {promise?.user?.payload?.nick
              ? promise?.user?.payload?.nick
              : "user"}
          </h1>
          <Spoiler
            children={
              <>
                <br />
                <form
                  action="/upload"
                  method="post"
                  encType="multipart/form-data"
                  id="form"
                >
                  <img
                    className="avatarProfile"
                    src={
                      promise?.user?.payload?.avatar
                        ? `${backURL}/${promise.user.payload.avatar.url}`
                        : "https://i.ibb.co/bBxzmTm/default-avatar.jpg"
                    }
                    alt="Avatar"
                  />
                  <CMyDropzone />
                </form>
              </>
            }
            header={<h3>Изменить аватар</h3>}
          />
          <Spoiler
            children={
              <>
                <br />
                <Form>
                  {promise?.user?.payload?.nick === nick ? (
                    <Alert>Никнейм не должен повторяться с предыдущим.</Alert>
                  ) : null}
                  {validateNickname(nick) ? null : (
                    <Alert>
                      Никнейм может состоять только из строчных букв и цифр,
                      символы - и _, а так же иметь длину от 3 до 8 символов.
                    </Alert>
                  )}
                  <Form.Group
                    as={Row}
                    className="m-2"
                    controlId="formHorizontalEmail"
                  >
                    <Form.Label column sm={2}>
                      Ваш никнейм:
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        type="text"
                        placeholder="Ваш текущий никнейм"
                        value={
                          promise?.user?.payload?.nick
                            ? promise?.user?.payload?.nick
                            : "Никнейм не установлен"
                        }
                        disabled
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="m-2"
                    controlId="formHorizontalEmail"
                  >
                    <Form.Label column sm={2}>
                      Новый никнейм:
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        type="text"
                        placeholder="Введите ваш новый никнейм"
                        value={nick}
                        max="8"
                        onChange={(e) => setNickname(e.target.value)}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Col sm={{ span: 10, offset: 2 }} className="my-3">
                      <Button
                        variant="success"
                        disabled={
                          promise?.user?.payload?.nick !== nick &&
                          validateNickname(nick)
                            ? false
                            : true
                        }
                        onClick={() =>
                          nickUpdate({ _id: promise?.user?.payload?._id, nick })
                        }
                      >
                        Сохранить
                      </Button>
                    </Col>
                  </Form.Group>
                </Form>
              </>
            }
            header={<h3>Изменить никнейм</h3>}
          />
          <Spoiler
            children={
              <>
                <br />
                <Form>
                  {promise?.user?.payload?.login === login ? (
                    <Alert>Email не должен повторяться с предыдущим.</Alert>
                  ) : null}
                  {validateEmail(login) ? null : (
                    <Alert>Email должен быть в формате: email@gmail.com.</Alert>
                  )}
                  <Form.Group
                    as={Row}
                    className="m-2"
                    controlId="formHorizontalEmail"
                  >
                    <Form.Label column sm={2}>
                      Ваша почта:
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        type="text"
                        placeholder="Ваша текущая почта"
                        value={promise?.user?.payload?.login}
                        disabled
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="m-2"
                    controlId="formHorizontalEmail"
                  >
                    <Form.Label column sm={2}>
                      Новая почта:
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        type="text"
                        placeholder="Введите вашу новую почту"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Col sm={{ span: 10, offset: 2 }} className="my-3">
                      <Button
                        variant="success"
                        disabled={
                          validateEmail(login) &&
                          promise?.user?.payload?.login !== login
                            ? false
                            : true
                        }
                        onClick={() =>
                          emailUpdate({
                            _id: promise?.user?.payload?._id,
                            login,
                          })
                        }
                      >
                        Сохранить
                      </Button>
                    </Col>
                  </Form.Group>
                </Form>
              </>
            }
            header={<h3>Изменить почту</h3>}
          />
          <Spoiler
            children={
              <>
                <br />
                <Form>
                  {password.length !== 0 ? null : (
                    <Alert>
                      Пожалуйста, введите свой текущий пароль в первое поле для
                      изменения пароля.
                    </Alert>
                  )}
                  {validatePassword(newPassword) ? null : (
                    <Alert>
                      Новый пароль должен быть от 6 символов, иметь хотя бы одну
                      цифру и заглавную букву.
                    </Alert>
                  )}
                  <Form.Group
                    as={Row}
                    className="m-2"
                    controlId="formHorizontalPassword"
                  >
                    <Form.Label column sm={2}>
                      Пароль:
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        type={passwordShown ? "text" : "password"}
                        placeholder="Введите ваш текущий пароль"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        className="mt-2"
                        variant="secondary"
                        onClick={() => setPasswordShown(!passwordShown)}
                      >
                        {`${passwordShown ? "Hide" : "Show"} passwords`}
                      </Button>
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="m-2"
                    controlId="formHorizontalPassword"
                  >
                    <Form.Label column sm={2}>
                      Новый пароль:
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        type={passwordShown ? "text" : "password"}
                        placeholder="Введите ваш новый пароль"
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Col sm={{ span: 10, offset: 2 }} className="my-3">
                      <Button
                        variant="success"
                        disabled={validatePassword(newPassword) ? false : true}
                        onClick={() =>
                          changePassword(
                            promise?.user?.payload?.login,
                            password,
                            newPassword
                          )
                        }
                      >
                        Сохранить
                      </Button>
                    </Col>
                  </Form.Group>
                </Form>
              </>
            }
            header={<h3>Изменить пароль</h3>}
          />
        </div>
      ) : (
        <div className="d-block mx-auto mt-2 container w-50">
          <AuthCheck header="Ваш профиль" />
        </div>
      )}
    </div>
  );
};

export const CProfile = connect(
  (state) => ({ auth: state.auth, promise: state.promise }),
  {
    emailUpdate: actionSetEmail,
    nickUpdate: actionSetNickname,
    changePassword: actionSetNewPassword,
  }
)(Profile);
