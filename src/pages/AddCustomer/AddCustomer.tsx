import React from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-hot-toast";

import { addClient } from "../../services/Api/Clients/ClientsEndpoint";

import "./AddCustomer.scss";

class AddClient extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      client: {
        name: "",
        cellphone: "",
      },

      redirectTo: null,
    };
  }

  handleClientDataChange = (e: any) => {
    const client = { ...this.state.client };

    client[e.target.name] = e.target.value;

    this.setState({ client: client });
  };

  addClient = async (e: any) => {
    e.preventDefault();

    const client = { ...this.state.client };

    addClient(client)
      .then((res: any) => {
        toast.success(res.data.message);

        this.setState({ redirectTo: "/clients" });
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
          <h1> Adicionar Cliente </h1>
        </div>

        <div className="content container d-flex justify-content-center">
          <div className="clientForm col-6">
            <form
              onSubmit={this.addClient}
              className="d-flex justify-content-center col-12"
            >
              <div className="col-8">
                <input
                  type="text"
                  name="name"
                  className="nameInput col-12 ps-3 mb-4"
                  placeholder="Nome do Cliente"
                  onChange={this.handleClientDataChange}
                  autoFocus
                  required
                />

                <input
                  id="cellphoneInput"
                  name="cellphone"
                  className="cellphoneInput col-12 ps-3 mb-4"
                  placeholder="Telefone"
                  onChange={this.handleClientDataChange}
                  required
                />

                <div className="btns d-flex justify-content-center mb-4">
                  <button type="submit" className="btn btnAdd col-4 me-2">
                    Adicionar
                  </button>
                  <Link to="/storage" className="btn btnCancel col-4 me-2">
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

export default AddClient;
