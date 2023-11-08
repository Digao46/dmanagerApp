import React from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-hot-toast";

import { editUser } from "../../../services/Api/Users/UsersEndpoint";

import "./EditUser.scss";

class EditUser extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: {},

      redirectTo: null,
    };
  }

  componentDidMount(): void {
    const user = JSON.parse(localStorage.getItem("selectedUser")!);

    this.setState({ user: user });
  }

  handleIsAdminChange = (e: any) => {
    e.preventDefault();

    const user = { ...this.state.user };

    if (parseInt(e.target.value) === 1) {
      user.isAdmin = true;
    } else {
      user.isAdmin = false;
    }

    this.setState({ user: user });
  };

  handleUserDataChange = (e: any) => {
    const user = { ...this.state.user };

    user[e.target.name] = e.target.value;

    this.setState({ user: user });
  };

  editUser = async (e: any, id: any) => {
    e.preventDefault();

    const user = { ...this.state.user };
    const baseUser = JSON.parse(localStorage.getItem("selectedUser")!);

    delete user.updatedAt;
    delete user.createdAt;
    delete user.deletedAt;
    delete user.debit;
    delete user._id;

    if (user.name === baseUser.name) delete user.name;
    if (user.username === baseUser.username) delete user.username;
    if (user.isAdmin === baseUser.isAdmin) delete user.isAdmin;

    if (user.password !== user.passwordConfirm)
      return toast.error("Senhas não conferem!");

    if (Object.keys(user).length <= 0)
      return toast.error("Nenhuma alteração identificada!");

    editUser(id, user)
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
          <h1> Editar Usuário </h1>
        </div>

        <div className="content container d-flex justify-content-center">
          <div className="userForm col-6">
            <form
              onSubmit={(e) => {
                this.editUser(e, this.state.user._id);
              }}
              className="d-flex justify-content-center col-12"
            >
              <div className="col-8">
                <input
                  type="text"
                  name="name"
                  className="nameInput col-12 ps-3 mb-4"
                  placeholder="Nome"
                  value={this.state.user.name ?? ""}
                  onChange={this.handleUserDataChange}
                  autoFocus
                  required
                />

                <input
                  id="usernameInput"
                  name="username"
                  className="usernameInput col-12 ps-3 mb-4"
                  placeholder="Nome de Usuário"
                  value={this.state.user.username ?? ""}
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
                />

                <input
                  id="passwordConfirmInput"
                  name="passwordConfirm"
                  type="password"
                  className="passwordConfirmInput col-12 ps-3 mb-4"
                  placeholder="Repita a senha"
                  onChange={this.handleUserDataChange}
                />

                <select
                  id="isAdminSelect"
                  name="isAdmin"
                  className="isAdminSelect col-12 ps-3 mb-4"
                  value={!this.state.user.isAdmin ? 0 : 1}
                  onChange={this.handleIsAdminChange}
                >
                  <option value={1}>Administrador(a)</option>
                  <option value={0}>Vendedor(a)</option>
                </select>

                <div className="btns d-flex justify-content-center mb-4">
                  <button type="submit" className="btn btnAdd col-4 me-2">
                    Editar
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

export default EditUser;
