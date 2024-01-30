import React from "react";
import { toast } from "react-hot-toast";

import isAuthenticated from "../../../services/Authentication/Authentication";

import {
  findDeletedClients,
  restoreClient,
} from "../../../services/Api/Clients/ClientsEndpoint";

import { nextPage, prevPage, goToPage } from "../../../helpers/helpers";

import Table from "../../../components/Table/Table";

import "./CustomersTrash.scss";
import { Redirect } from "react-router";

class ClientsTrash extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      // pagination
      perPage: [12, 25, 50, 100, 200],
      totalPages: 12,
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

      allowActions: true,

      actions: [
        {
          class: "restore",
          icon: "fa fa-trash-can-arrow-up",
          func: this.restoreClient,
        },
      ],

      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      window.alert("Sessão Expirada. Por favor efetue o login novamente!");
      this.setState({ redirectTo: "/login" });
    }

    this.findDeletedClients(this.state.query);
  }

  findDeletedClients = async (query: any) => {
    await findDeletedClients(query)
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

  restoreClient = async (clientId: string) => {
    const newClients = this.state.clients.filter(
      (client: any) => client._id !== clientId
    );

    if (window.confirm("Realmente deseja restaurar esse cliente?")) {
      await restoreClient(clientId)
        .then((res: any) => {
          toast.success(res.data.message);
          this.syncClientsAfterRestoring(newClients);
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

    return;
  };

  syncClientsAfterRestoring = (newClients: any) => {
    this.setState({ clients: newClients });
  };

  handleLimitChange = async (e: any) => {
    e.preventDefault();

    const query = { ...this.state.query };

    query.limit = e.target.value;
    query.page = 1;

    this.setState({ query: query });

    await this.findDeletedClients(query);
  };

  goToPage = async (e: any) => {
    e.preventDefault();

    goToPage(this, this.findDeletedClients, +e.target.textContent);
  };

  previousPage = async (e: any) => {
    e.preventDefault();

    prevPage(this, this.findDeletedClients);
  };

  nextPage = async (e: any) => {
    e.preventDefault();

    nextPage(this, this.findDeletedClients);
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="container d-flex justify-content-center col-12">
        <div className="container d-flex align-items-center flex-column">
          <div className="tableArea d-flex justify-content-center align-items-center my-2 col-12">
            <Table
              content={this.state.content}
              data={this.state.clients}
              allowActions={this.state.allowActions}
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

export default ClientsTrash;
