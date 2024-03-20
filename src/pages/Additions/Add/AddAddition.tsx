import React from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-hot-toast";

import { findClients } from "../../../services/Api/Clients/ClientsEndpoint";
import { addAddition } from "../../../services/Api/TabCard/Additions/AdditionsEndpoint";

import isAuthenticated from "../../../services/Authentication/Authentication";

import "./AddAddition.scss";
import { handleChange } from "../../../helpers/helpers";

class AddAddition extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      clientsQuery: {
        limit: 200,
        page: 1,
        orderBy: JSON.stringify([{ field: "name", direction: "asc" }]),
        where: {},
      },
      clients: [],
      client: {},

      description: "",
      total: 0,
      status: "Comanda",

      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      window.alert("Sessão Expirada. Por favor efetue o login novamente!");
      this.setState({ redirectTo: "/login" });
    }

    findClients()
      .then((res: any) => {
        this.setState({ clients: res.data.data.clients });
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        }

        this.setState({
          data: [],
          totalPages: 1,
          total: 0,
        });

        return toast.error(err.response.data.message);
      });
  }

  handleChange = (e: any) => {
    handleChange(this, e);
  };

  handleClientChange = (e: any) => {
    const name = e.target.value;

    const clientFound = this.state.clients.find(
      (client: any) =>
        client.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") ===
        name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
    );

    this.setState({ client: clientFound });
  };

  addAddition = async (e: any) => {
    e.preventDefault();

    if (!this.state.client._id) {
      return toast.error("Para uma adição o cliente precisa ser informado!");
    }

    const addition = {
      description: "",
      total: 0,
      paymentMethod: {},
      client: {
        name: "",
        _id: "",
      },
      status: "Comanda",
      seller: {
        username: "",
        _id: "",
      },
    };

    const userData = JSON.parse(localStorage.getItem("user")!);

    addition.seller = {
      _id: userData._id,
      username: userData.username,
    };

    addition.client = {
      _id: this.state.client._id,
      name: this.state.client.name,
    };

    addition.description = this.state.description;
    addition.total = +this.state.total;

    addAddition(addition)
      .then((res: any) => {
        toast.success(res.data.message);

        this.setState({ redirectTo: "/additions" });
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
          <h1> Incrementar Valor </h1>
        </div>

        <div className="content container d-flex justify-content-center">
          <div className="additionForm col-6">
            <form
              onSubmit={this.addAddition}
              className="d-flex justify-content-center mt-2 col-12"
            >
              <div className="col-8">
                <label htmlFor="description" className="mb-1">
                  Descrição :
                </label>
                <textarea
                  className="col-12 mb-1"
                  name="description"
                  id="description"
                  placeholder="ex: Correção no valor de R$10"
                  onChange={this.handleChange}
                  cols={30}
                  rows={3}
                  required
                />

                <div className="d-flex justify-content-center align-items-center col-12 mb-2">
                  <div className="input-group">
                    <span className="holder input-group-text">R$</span>
                    <input
                      type="text"
                      name="total"
                      className="totalInput form-control ps-2"
                      placeholder="Valor"
                      onChange={this.handleChange}
                      required
                    />
                  </div>

                  <div className="col-5">
                    <input
                      type="text"
                      onChange={this.handleClientChange}
                      id="clientInput"
                      className="selectClient col-12 ps-3"
                      list="clientList"
                      placeholder="Cliente:"
                      required
                    />

                    <datalist id="clientList">
                      {this.state.clients.map((client: any) => (
                        <option
                          id="clientId"
                          key={client._id}
                          value={client.name}
                        />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="btns d-flex justify-content-center mb-4">
                  <button type="submit" className="btn btnAdd col-4 me-2">
                    Adicionar
                  </button>
                  <Link to="/additions" className="btn btnCancel col-4 me-2">
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

export default AddAddition;
