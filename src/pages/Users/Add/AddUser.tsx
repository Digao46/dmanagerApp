import React from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-hot-toast";

import { addUser } from "../../../services/Api/Users/UsersEndpoint";

import "./AddUser.scss";

class AddUser extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: {
        name: "",
        username: "",
        password: "",
        passwordConfirm: "",
        isAdmin: false,
      },

      redirectTo: null,
    };
  }

  handleIsAdminChange = (e: any) => {
    e.preventDefault();

    const user = { ...this.state.user };

    if (e.target.value === 1) {
      user.isAdmin = true;
    }

    this.setState({ user: user });
  };

  handleUserDataChange = (e: any) => {
    const user = { ...this.state.user };

    user[e.target.name] = e.target.value;

    this.setState({ user: user });
  };

  addUser = async (e: any) => {
    e.preventDefault();

    const user = { ...this.state.user };

    if (user.password !== user.passwordConfirm)
      return toast.error("Senhas não conferem!");

    addUser(user)
      .then((res: any) => {
        toast.success(res.data.message);

        this.setState({ redirectTo: "/users" });
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        }

        return toast.error(err.response.data.message);
      });
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="container d-flex flex-column align-items-center">
        <div className="title d-flex justify-content-center align-items-center">
          <h1> Adicionar Usuário </h1>
        </div>

        <div className="content container d-flex justify-content-center">
          <div className="userForm col-6">
            <form
              onSubmit={this.addUser}
              className="d-flex justify-content-center col-12"
            >
              <div className="col-8">
                <input
                  type="text"
                  name="name"
                  className="nameInput col-12 ps-3 mb-4"
                  placeholder="Nome"
                  onChange={this.handleUserDataChange}
                  autoFocus
                  required
                />

                <input
                  id="usernameInput"
                  name="username"
                  className="usernameInput col-12 ps-3 mb-4"
                  placeholder="Nome de Usuário"
                  onChange={this.handleUserDataChange}
                  required
                />

                <input
                  id="passwordInput"
                  name="password"
                  type="password"
                  className="passwordInput col-12 ps-3 mb-4"
                  placeholder="Senha"
                  onChange={this.handleUserDataChange}
                  required
                />

                <input
                  id="passwordConfirmInput"
                  name="passwordConfirm"
                  type="password"
                  className="passwordConfirmInput col-12 ps-3 mb-4"
                  placeholder="Repita a senha"
                  onChange={this.handleUserDataChange}
                  required
                />

                <select
                  id="isAdminSelect"
                  name="isAdmin"
                  className="isAdminSelect col-12 ps-3 mb-4"
                  onChange={this.handleIsAdminChange}
                >
                  <option value={0}>Cargo:</option>
                  <option value={1}>Administrador</option>
                  <option value={0}>Funcionário</option>
                </select>

                <div className="btns d-flex justify-content-center mb-4">
                  <button type="submit" className="btn btnAdd col-4 me-2">
                    Adicionar
                  </button>
                  <Link to="/users" className="btn btnCancel col-4 me-2">
                    Cancelar
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
}

export default AddUser;
