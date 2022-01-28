import { Spoiler } from "../Other/Spoiler";
import {
  backURL,
  validateEmail,
  validatePassword,
  validateNickname,
} from "../../helpers/index";
import { CMyDropzone } from "../Other/Dropzone";
import { Form, Alert, Row, Col, Button } from "react-bootstrap";
import { useState } from "react";
import { connect } from "react-redux";
import { CUserInfo } from "./UserInfo";
import { CPreloader } from "../Other/Preloader";
import {
  actionSetNickname,
  actionSetEmail,
  actionSetNewPassword,
} from "./../../actions/types";

const MyProfile = ({
  id,
  auth,
  promise,
  emailUpdate,
  nickUpdate,
  changePassword,
}) => {
  const [login, setLogin] = useState("");
  const [nick, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);

  return (
    <div className="ProfilePage">
      <CPreloader
        promiseName={`${
          id === auth?.payload?.sub?.id ? "myUser" : "anotherUser"
        }`}
        promiseState={promise}
        children={<CUserInfo id={id} />}
      />
      {id === auth?.payload?.sub?.id ? (
        <div className="d-block mx-auto mt-2 container w-50">
          <h1>
            Редактирование профиля:{" "}
            {promise?.myUser?.payload?.nick
              ? promise?.myUser?.payload?.nick
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
                  className="text-center"
                >
                  <img
                    className="avatarProfile"
                    src={
                      promise?.myUser?.payload?.avatar
                        ? `${backURL}/${promise.myUser.payload.avatar.url}`
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
                  {promise?.myUser?.payload?.nick === nick ? (
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
                    <Form.Label column sm={5}>
                      Ваш никнейм:
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        type="text"
                        placeholder="Ваш текущий никнейм"
                        value={
                          promise?.myUser?.payload?.nick
                            ? promise?.myUser?.payload?.nick
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
                    <Form.Label column sm={5}>
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
                          promise?.myUser?.payload?.nick !== nick &&
                          validateNickname(nick)
                            ? false
                            : true
                        }
                        onClick={() =>
                          nickUpdate({
                            _id: promise?.myUser?.payload?._id,
                            nick,
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
            header={<h3>Изменить никнейм</h3>}
          />
          <Spoiler
            children={
              <>
                <br />
                <Form>
                  {promise?.myUser?.payload?.login === login ? (
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
                    <Form.Label column sm={5}>
                      Ваша почта:
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        type="text"
                        placeholder="Ваша текущая почта"
                        value={promise?.myUser?.payload?.login}
                        disabled
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="m-2"
                    controlId="formHorizontalEmail"
                  >
                    <Form.Label column sm={5}>
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
                          promise?.myUser?.payload?.login !== login
                            ? false
                            : true
                        }
                        onClick={() =>
                          emailUpdate({
                            _id: promise?.myUser?.payload?._id,
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
                    <Form.Label column sm={5}>
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
                        {`${passwordShown ? "Скрыть" : "Показать"} пароль`}
                      </Button>
                    </Col>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    className="m-2"
                    controlId="formHorizontalPassword"
                  >
                    <Form.Label column sm={5}>
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
                            promise?.myUser?.payload?.login,
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
      ) : null}
      <div className="container" style={{ height: "300px" }}></div>
    </div>
  );
};

export const CMyProfile = connect(
  (state) => ({ auth: state.auth, promise: state.promise }),
  {
    emailUpdate: actionSetEmail,
    nickUpdate: actionSetNickname,
    changePassword: actionSetNewPassword,
  }
)(MyProfile);
