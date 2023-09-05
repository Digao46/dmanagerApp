import React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

import "./Header.scss";

const Logo = require("../../assets/imgs/logo.png");

const user = JSON.parse(localStorage.getItem("user")!);

class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: "Usuário",
      user: "",
      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (user) {
      this.setState({ user: user.username });
    }
  }

  logOut = () => {
    localStorage.removeItem("user");

    this.setState({ redirectTo: "login" });
  };

  render() {
    if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />;

    return (
      <header className="d-flex flex-column">
        <div className="container d-flex justify-content-between">
          <div className="logoArea d-flex justify-content-start col-2">
            <Link to="/">
              <img src={Logo} alt="Logo" />
            </Link>
          </div>

          <nav className="d-flex justify-content-center align-items-center col-8">
            <ul className="d-flex justify-content-center align-items-center col-12">
              <li className="d-flex justify-content-center align-items-center col-1 px-5">
                <Link
                  to="/"
                  className="d-flex justify-content-center align-items-center"
                >
                  <span className="iconArea d-flex justify-content-center align-items-center me-1">
                    <i className="fa fa-home" />
                  </span>
                  Inicio
                </Link>
              </li>

              <li className="dropdown d-flex flex-column justify-content-center align-items-center col-2">
                <div className="d-flex align-items-center justify-content-center">
                  <span className="iconArea d-flex justify-content-center align-items-center me-2">
                    <i className="fa fa-dollar-sign" />
                  </span>
                  <span className="d-flex justify-content-center align-items-center">
                    Vendas <i className="fa fa-caret-down ms-2" />
                  </span>
                </div>

                <ul className="dropdown-list">
                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/sales/add" className="ms-2">
                      <i className="fa fa-plus me-1" /> Nova Venda
                    </Link>
                  </li>

                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/sales/opened" className="ms-2">
                      <i className="fa fa-box-open me-1" /> Em Aberto
                    </Link>
                  </li>

                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/sales" className="ms-2">
                      <i className="fa fa-dollar-sign me-1" /> Vendas
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="dropdown d-flex flex-column justify-content-center align-items-center col-2">
                <div className="d-flex align-items-center justify-content-center">
                  <span className="iconArea d-flex justify-content-center align-items-center me-1">
                    <i className="fa fa-warehouse" />
                  </span>
                  <span>
                    Estoque <i className="fa fa-caret-down ms-2" />
                  </span>
                </div>

                <ul className="dropdown-list">
                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/storage/add" className="ms-2">
                      <i className="fa fa-plus me-1" /> Novo Produto
                    </Link>
                  </li>

                  {user.isAdmin && (
                    <li className="dropdown-item d-flex align-items-center">
                      <Link to="/storage/trash" className="ms-2">
                        <i className="fa fa-trash me-1" /> Excluídos
                      </Link>
                    </li>
                  )}

                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/storage" className="ms-2">
                      <i className="fa fa-warehouse me-1" /> Estoque
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="dropdown d-flex flex-column justify-content-center align-items-center col-2">
                <div className="d-flex align-items-center justify-content-center">
                  <span className="iconArea d-flex justify-content-center align-items-center me-1">
                    <i className="fa fa-user" />
                  </span>
                  <span>
                    Pessoas <i className="fa fa-caret-down ms-2" />
                  </span>
                </div>

                <ul className="dropdown-list">
                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/clients/add" className="ms-2">
                      <i className="fa fa-plus me-1" /> Novo Cliente
                    </Link>
                  </li>

                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/clients/trash" className="ms-2">
                      <i className="fa fa-trash me-1" /> Excluídos
                    </Link>
                  </li>

                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/clients" className="ms-2">
                      <i className="fa fa-user me-1" /> Clientes
                    </Link>
                  </li>

                  {user.isAdmin && (
                    <li className="dropdown-item d-flex align-items-center">
                      <Link to="/users/add" className="ms-2">
                        <i className="fa fa-plus me-1" /> Novo Usuário
                      </Link>
                    </li>
                  )}

                  {user.isAdmin && (
                    <li className="dropdown-item d-flex align-items-center">
                      <Link to="/users" className="ms-2">
                        <i className="fa fa-user me-1" /> Usuários
                      </Link>
                    </li>
                  )}
                </ul>
              </li>

              <li className="dropdown d-flex flex-column justify-content-center align-items-center col-2">
                <div className="d-flex align-items-center justify-content-center">
                  <span className="iconArea d-flex justify-content-center align-items-center me-1">
                    <i className="fa fa-plus" />
                  </span>
                  <span>
                    Outros <i className="fa fa-caret-down ms-2" />
                  </span>
                </div>

                <ul className="dropdown-list">
                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/discounts/add" className="ms-2">
                      <i className="fa fa-plus me-1" /> Descontar Valor
                    </Link>
                  </li>

                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/discounts" className="ms-2">
                      <i className="fa fa-box-open me-1" /> Descontos
                    </Link>
                  </li>

                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/additions/add" className="ms-2">
                      <i className="fa fa-plus me-1" /> Adicionar Valor
                    </Link>
                  </li>

                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/additions/opened" className="ms-2">
                      <i className="fa fa-box-open me-1" /> Em Aberto
                    </Link>
                  </li>

                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/additions" className="ms-2">
                      <i className="fa fa-plus me-1" /> Adições
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="d-flex justify-content-center align-items-center col-1 px-5">
                <Link
                  to="/cash"
                  className="d-flex justify-content-center align-items-center"
                >
                  <span className="iconArea d-flex justify-content-center align-items-center me-1">
                    <i className="fa fa-cash-register" />
                  </span>
                  Caixa
                </Link>
              </li>
            </ul>
          </nav>

          <div className="userArea d-flex justify-content-end align-items-center col-2">
            <i className="fa fa-circle-user" />
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
