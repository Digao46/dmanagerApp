import React from "react";
import toast from "react-hot-toast";
import { Redirect } from "react-router-dom";

import { handleChange } from "../../helpers/helpers";

import { logIn } from "../../services/Api/Login/LoginEndpoint";

import "./Login.scss";

const Logo = require("../../assets/imgs/logo.png");

class Login extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: "",
      password: "",
      redirectTo: null,
    };
  }

  logIn = async (e: any) => {
    e.preventDefault();

    const data = {
      username: this.state.username,
      password: this.state.password,
    };

    try {
      const res = await logIn(data);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      this.setState({ redirectTo: "/" });
    } catch (err: any) {
      return toast.error(err.response.data.message);
    }
  };

  handleChange = (e: any) => {
    handleChange(this, e);
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="d-flex justify-content-center align-items-center">
        <div className="formArea container d-flex flex-column justify-content-center align-items-center col-4">
          <div className="logoNTitle d-flex flex-column justify-content-center align-items-center mb-2">
            <img src={Logo} alt="Logo" />
            <h1>DN SMOKE BAR</h1>
          </div>

          <form className="mt-2" onSubmit={this.logIn}>
            <div className="formContainer mb-3">
              <input
                onChange={this.handleChange}
                type="text"
                name="username"
                required
              />
              <span>Usuário</span>
            </div>

            <div className="formContainer mb-2">
              <input
                onChange={this.handleChange}
                type="password"
                name="password"
                required
              />
              <span>Senha</span>
            </div>

            <div className="buttons d-flex flex-column justify-content-center align-items-center">
              <button className="btn mb-1 col-12">Entrar</button>
              <hr className="horizontalLine" />
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default Login;
