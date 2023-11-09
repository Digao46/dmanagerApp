import React from "react";
import { toast } from "react-hot-toast";

import isAuthenticated from "../../services/Authentication/Authentication";
import isAuthorizated from "../../services/Authorization/Authorization";

import {
  findClients,
  findClient,
  findClientsByName,
  deleteClient,
} from "../../services/Api/Clients/ClientsEndpoint";

import {
  nextPage,
  prevPage,
  goToPage,
  handleChange,
} from "../../helpers/helpers";

import Table from "../../components/Table/Table";

import "./Customers.scss";
import { Redirect } from "react-router";

class Clients extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      // pagination
      perPage: [12, 25, 50, 100, 200],
      totalPages: 0,
      query: {
        limit: 12,
        page: 1,
        orderBy: JSON.stringify([{ field: "name", direction: "asc" }]),
        where: JSON.stringify({}),
      },

      clients: [],
      client: {},
      clientName: "",

      content: [
        { head: "Nome", field: "name", authorizated: true },
        {
          head: "Celular",
          field: "cellphone",
          type: "phone",
          authorizated: true,
        },
        {
          head: "Cliente desde:",
          field: "createdAt",
          type: "date",
          authorizated: true,
        },
      ],
      actions: [
        {
          class: "edit",
          icon: "fa fa-edit",
          func: this.findClient,
        },
        {
          class: "delete",
          icon: "fa fa-trash-can",
          func: this.deleteClient,
        },
      ],

      isFiltered: false,

      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      window.alert("Sessão Expirada. Por favor efetue o login novamente!");
      this.setState({ redirectTo: "/login" });
    }

    this.findClients(this.state.query);
  }

  findClients = async (query: any) => {
    await findClients(query)
      .then((res) => {
        let pages = Math.ceil(res.data.data.documents.qtd / query.limit);

        this.setState({
          clients: res.data.data.clients,
          totalDocs: res.data.data.documents.qtd,
          totalPages: pages,
        });
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        }

        this.setState({
          clients: [],
          totalPages: 1,
        });

        return toast.error(err.response.data.message);
      });
  };

  findClient = async (clientId: string) => {
    await findClient(clientId)
      .then((res: any) => {
        localStorage.setItem("client", JSON.stringify(res.data.client));

        this.setState({ client: res.data.client, redirectTo: "/clients/edit" });
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        }

        this.setState({
          client: {},
        });

        return toast.error(err.response.data.message);
      });
  };

  findClientsByName = async (clientName: string, query: any, e?: any) => {
    if (e) e.preventDefault();

    const newQuery = { ...query };
    newQuery.page = 1;

    await findClientsByName(clientName, newQuery)
      .then((res) => {
        let pages = Math.ceil(res.data.data.documents.qtd / query.limit);

        this.setState({
          clients: res.data.data.clients,
          totalDocs: res.data.data.documents.qtd,
          totalPages: pages,
          query: newQuery,
          isFiltered: true,
        });
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        }

        this.setState({
          clients: [],
          totalPages: 1,
          isFiltered: true,
        });

        return toast.error(err.response.data.message);
      });
  };

  deleteClient = async (clientId: string) => {
    const newClients = this.state.clients.filter(
      (client: any) => client._id !== clientId
    );

    if (window.confirm("Realmente deseja excluir esse cliente?")) {
      await deleteClient(clientId)
        .then((res: any) => {
          toast.success(res.data.message);
          this.syncClientsAfterDeleting(newClients);
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
    }
  };

  syncClientsAfterDeleting = (newClients: any) => {
    this.setState({ clients: newClients });
  };

  handleChange = async (e: any) => {
    if (this.state.isFiltered) {
      await this.findClients(this.state.query);
      this.setState({ isFiltered: false });
    }

    handleChange(this, e);
  };

  handleLimitChange = async (e: any) => {
    e.preventDefault();

    const query = { ...this.state.query };

    query.limit = e.target.value;
    query.page = 1;

    this.setState({ query: query });

    if (this.state.isFiltered) {
      this.findClientsByName(this.state.clientName, this.state.query, e);
    } else {
      await this.findClients(query);
    }
  };

  goToPage = async (e: any) => {
    e.preventDefault();
    if (this.state.isFiltered) {
      goToPage(
        this,
        this.findClientsByName,
        +e.target.textContent,
        this.state.clientName
      );
    } else {
      goToPage(this, this.findClients, +e.target.textContent);
    }
  };

  previousPage = async (e: any) => {
    e.preventDefault();
    if (this.state.isFiltered) {
      prevPage(this, this.findClientsByName, this.state.clientName);
    } else {
      prevPage(this, this.findClients);
    }
  };

  nextPage = async (e: any) => {
    e.preventDefault();
    if (this.state.isFiltered) {
      nextPage(this, this.findClientsByName, this.state.clientName);
    } else {
      nextPage(this, this.findClients);
    }
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="container d-flex justify-content-center col-12">
        <div className="container d-flex align-items-center flex-column">
          <div className="formClientArea container d-flex justify-content-center align-items-center mb-2">
            <form
              className="d-flex justify-content-center align-itens-center"
              onSubmit={(e) =>
                this.findClientsByName(
                  this.state.clientName,
                  this.state.query,
                  e
                )
              }
            >
              <input
                type="text"
                onChange={this.handleChange}
                name="clientName"
                id="clientInput"
                className="selectClient col-6 me-2 px-4 py-1"
                placeholder="Pesquisar cliente"
                required
              />

              <button
                type="submit"
                className="btn col-1 d-flex justify-content-center align-items-center"
              >
                <i className="fa fa-search" />
              </button>
            </form>
          </div>

          <div className="tableArea d-flex justify-content-center align-items-center my-2 col-12">
            <Table
              content={this.state.content}
              data={this.state.clients}
              actions={this.state.actions}
              previousPage={this.previousPage}
              nextPage={this.nextPage}
              goToPage={this.goToPage}
              handleLimitChange={this.handleLimitChange}
              state={this.state}
            />
          </div>
        </div>
      </section>
    );
  }
}

export default Clients;
