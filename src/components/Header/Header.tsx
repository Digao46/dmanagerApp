import React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

import "./Header.scss";

import isAuthorizated from "../../services/Authorization/Authorization";

const Logo = require("../../assets/imgs/logo.png");

class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      redirectTo: null,
    };
  }

  logOut = () => {
    localStorage.removeItem("user");

    this.setState({ redirectTo: "/login" });
  };

  render() {
    if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />;

    return (
      <header className="d-flex flex-column">
        <div className="container d-flex justify-content-between">
          <div className="logoArea d-flex justify-content-start col-1">
            <Link to="/">
              <img src={Logo} alt="Logo" />
            </Link>
          </div>

          <nav className="d-flex justify-content-center align-items-center col-10">
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
                    <Link to="/sales" className="ms-2">
                      <i className="fa fa-dollar-sign me-1" /> Vendas
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="dropdown d-flex flex-column justify-content-center align-items-center col-2">
                <div className="d-flex align-items-center justify-content-center">
                  <span className="iconArea d-flex justify-content-center align-items-center me-2">
                    <i className="fa fa-clipboard-list" />
                  </span>
                  <span className="d-flex justify-content-center align-items-center">
                    <Link to="/orders">
                      Comanda <i className="fa fa-caret-down ms-2" />
                    </Link>
                  </span>
                </div>

                <ul className="dropdown-list">
                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/discounts/add" className="ms-2">
                      <i className="fa fa-minus me-1" /> Descontar
                    </Link>
                  </li>

                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/discounts" className="ms-2">
                      <i className="fa fa-box-open me-1" /> Descontos
                    </Link>
                  </li>

                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/additions/add" className="ms-2">
                      <i className="fa fa-plus me-1" /> Adicionar
                    </Link>
                  </li>

                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/additions" className="ms-2">
                      <i className="fa fa-list-ul me-1" /> Adições
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

                  <li className="dropdown-item d-flex align-items-center">
                    <Link to="/storage/trash" className="ms-2">
                      <i className="fa fa-trash me-1" /> Excluídos
                    </Link>
                  </li>

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

                  {isAuthorizated() && (
                    <li className="dropdown-item d-flex align-items-center">
                      <Link to="/users/add" className="ms-2">
                        <i className="fa fa-plus me-1" /> Novo Usuário
                      </Link>
                    </li>
                  )}

                  {isAuthorizated() && (
                    <li className="dropdown-item d-flex align-items-center">
                      <Link to="/users/trash" className="ms-2">
                        <i className="fa fa-trash-can me-1" /> Excluídos
                      </Link>
                    </li>
                  )}

                  {isAuthorizated() && (
                    <li className="dropdown-item d-flex align-items-center">
                      <Link to="/users" className="ms-2">
                        <i className="fa fa-user me-1" /> Usuários
                      </Link>
                    </li>
                  )}
                </ul>
              </li>

              {isAuthorizated() && (
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
              )}
            </ul>
          </nav>

          <div className="userArea d-flex justify-content-center align-items-center col-1">
            <i className="fa fa-circle-user ms-5" />

            <ul className="dropdown-list ms-3">
              <li className="dropdown-item d-flex align-items-center">
                <Link to="/settings" className="ms-2">
                  <i className="fa fa-gear me-2" /> Configurações
                </Link>
              </li>
              <li
                onClick={this.logOut}
                className="dropdown-item d-flex align-items-center"
              >
                <span className="ms-2">
                  <i className="fa fa-arrow-right-from-bracket me-2" />
                  Sair
                </span>
              </li>
            </ul>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
