import React from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-hot-toast";

import { editClient } from "../../services/Api/Clients/ClientsEndpoint";

// import "./EditCostumer.scss";

class EditClient extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      client: {},

      redirectTo: null,
    };
  }

  componentDidMount(): void {
    const client = JSON.parse(localStorage.getItem("client")!);

    this.setState({ client: client });
  }

  handleClientDataChange = (e: any) => {
    const client = { ...this.state.client };

    client[e.target.name] = e.target.value;

    this.setState({ client: client });
  };

  editClient = async (e: any, id: any) => {
    e.preventDefault();

    const client = { ...this.state.client };
    const baseClient = JSON.parse(localStorage.getItem("client")!);

    delete client.updatedAt;
    delete client.createdAt;
    delete client.deletedAt;
    delete client.debit;
    delete client._id;

    if (client.name === baseClient.name) delete client.name;
    if (client.cellphone === baseClient.cellphone) delete client.cellphone;

    if (Object.keys(client).length <= 0)
      return toast.error("Nenhuma alteração identificada!");

    console.log(client);

    editClient(id, client)
      .then((res: any) => {
        toast.success(res.data.message);

        localStorage.removeItem("client");
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
          <h1> Editar cliente </h1>
        </div>

        <div className="content container d-flex justify-content-center">
          <div className="clientForm col-6">
            <form
              onSubmit={(e) => {
                this.editClient(e, this.state.client._id);
              }}
              className="d-flex justify-content-center col-12"
            >
              <div className="col-8">
                <input
                  type="text"
                  name="name"
                  className="nameInput col-12 ps-3 mb-4"
                  placeholder="Nome do Cliente"
                  value={this.state.client.name ?? ""}
                  onChange={this.handleClientDataChange}
                  required
                />

                <input
                  id="cellphoneInput"
                  name="cellphone"
                  className="cellphoneInput col-12 ps-3 mb-4"
                  value={this.state.client.cellphone ?? ""}
                  placeholder="Telefone"
                  onChange={this.handleClientDataChange}
                  required
                />

                <div className="btns d-flex justify-content-center mb-4">
                  <button type="submit" className="btn btnAdd col-4 me-2">
                    Atualizar
                  </button>
                  <Link to="/clients" className="btn btnCancel col-4 me-2">
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

export default EditClient;
