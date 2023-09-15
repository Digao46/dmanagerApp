import React from "react";
import { toast } from "react-hot-toast";

import {
  closeManySales,
  closeSale,
  findSalesOpened,
  findSalesOpenedByClientId,
} from "../../services/Api/Sales/SalesEndpoint";
import isAuthenticated from "../../services/Authentication/Authentication";

import SaleCard from "../../components/SaleCard/SaleCard";
import ProductCard from "../../components/ProductCard/ProductCard";

import "./SalesOpened.scss";
import { Redirect } from "react-router";
import { findClients } from "../../services/Api/Clients/ClientsEndpoint";

class SalesOpened extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      // pagination
      perPage: [25, 50, 100, 200, 300, 500, 1000],
      totalPages: 0,
      query: {
        limit: 50,
        page: 1,
        orderBy: JSON.stringify([{ field: "createdAt", direction: "desc" }]),
        where: JSON.stringify({}),
      },

      sales: [],
      total: 0,

      // filtering
      clients: [],
      client: {},
      clientsQuery: {
        limit: 200,
        page: 1,
        orderBy: JSON.stringify([{ field: "name", direction: "asc" }]),
        where: {},
      },

      isFiltered: false,

      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      window.alert("Sessão Expirada. Por favor efetue o login novamente!");
      this.setState({ redirectTo: "/login" });
    }

    this.findSalesOpened(this.state.query);

    findClients(this.state.clientsQuery).then((res: any) => {
      this.setState({ clients: res.data.data.clients });
    });
  }

  findSalesOpened = async (query: any) => {
    await findSalesOpened(query)
      .then((res: any) => {
        let pages = Math.ceil(
          res.data.data.documents.qtd / this.state.query.limit
        );

        this.setState({
          sales: res.data.data.sales,
          totalPages: pages,
          total: res.data.data.documents.total,
        });
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        } else {
          this.setState({
            sales: [],
            totalPages: 1,
            total: 0,
          });

          return toast.error(err.response.data.message);
        }
      });
  };

  findSalesOpenedByClientId = async (client: any, query: any) => {
    findSalesOpenedByClientId(client._id, query)
      .then((res: any) => {
        let pages = res.data.data.documents.qtd / this.state.limit;

        this.setState({
          sales: res.data.data.sales,
          totalPages: pages,
          total: client.debit,
          isFiltered: true,
        });
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        } else {
          this.setState({
            sales: [],
            totalPages: 1,
            total: 0,
          });

          return toast.error(err.response.data.message);
        }
      });
  };

  closeSale = async (id: string) => {
    await closeSale(id)
      .then((res: any) => {
        if (this.state.client._id) {
          this.findSalesOpenedByClientId(this.state.client, this.state.query);
        } else {
          this.findSalesOpened(this.state.query);
        }

        toast.success(res.data.message);
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        } else {
          return toast.error(err.response.data.message);
        }
      });
  };

  closeAllSales = async (sales: string[]) => {
    let ids: any[] = [];

    sales.forEach(async (sale: any) => {
      ids.push(sale._id);
    });

    await closeManySales(ids)
      .then((res: any) => {
        this.findSalesOpened(this.state.query).then(() => {
          const input = document.getElementById(
            "clientInput"
          ) as HTMLInputElement;
          input.value = "";

          this.setState({ client: {} });
        });

        toast.success(res.data.message);
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        } else {
          return toast.error(err.response.data.message);
        }
      });
  };

  handleInputChange = async () => {
    await this.findSalesOpened(this.state.query);

    const span = document.getElementById("total") as HTMLElement;
    const icon = document.getElementById("showTotalOpened")! as HTMLElement;

    if (icon.className === "fa fa-eye") {
      icon.className = "fa-solid fa-eye-slash";
      span.innerText = "-------";
    }

    const input = document.getElementById("clientInput") as HTMLInputElement;

    const client = this.state.clients.filter(
      (client: any) =>
        client.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") ===
        input.value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
    )[0];

    this.setState({ client: client ?? {}, isFiltered: false });
  };

  syncSalesAfterDeleting = (newSales: any) => {
    let total = 0;

    newSales.map((sale: any) => (total += sale.total));

    this.setState({ sales: newSales, total: total });
  };

  handleVisualization = () => {
    const span = document.getElementById("total") as HTMLElement;

    const icon = document.getElementById("showTotalOpened")! as HTMLElement;

    if (icon.className === "fa-solid fa-eye-slash") {
      icon.className = "fa fa-eye";
      span.innerText = (+this.state.total).toFixed(2).replace(".", ",");
    } else {
      icon.className = "fa-solid fa-eye-slash";
      span.innerText = "-------";
    }
  };

  handleLimitChange = async (e: any) => {
    e.preventDefault();

    const query = { ...this.state.query };

    query.limit = e.target.value;

    this.setState({ query: query });

    if (this.state.isFiltered) {
      await this.findSalesOpenedByClientId(this.state.client, query);
    } else {
      await this.findSalesOpened(query);
    }
  };

  previousPage = async (e: any) => {
    e.preventDefault();

    const query = { ...this.state.query };

    query.page = query.page - 1;

    this.setState({ query: query });

    if (this.state.isFiltered) {
      await this.findSalesOpenedByClientId(this.state.client, query);
    } else {
      await this.findSalesOpened(query);
    }
  };

  nextPage = async (e: any) => {
    e.preventDefault();

    const query = { ...this.state.query };

    query.page = query.page + 1;

    this.setState({ query: query });

    if (this.state.isFiltered) {
      await this.findSalesOpenedByClientId(this.state.client, query);
    } else {
      await this.findSalesOpened(query);
    }
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="container d-flex justify-content-center col-12">
        <div className="container d-flex align-items-center flex-column">
          <div className="formArea container d-flex justify-content-center align-items-center mb-2">
            <form
              className="d-flex justify-content-center align-itens-center"
              onSubmit={() =>
                this.findSalesOpenedByClientId(
                  this.state.client,
                  this.state.query
                )
              }
            >
              <input
                type="text"
                onChange={this.handleInputChange}
                id="clientInput"
                className="selectName col-6 me-2 px-4 py-1"
                list="clientList"
                placeholder="Selecione o cliente:"
                required
              />

              <datalist id="clientList">
                {this.state.clients?.map((client: any) => (
                  <option id="clientId" key={client._id} value={client.name} />
                ))}
              </datalist>

              <button
                type="submit"
                className="btn col-1 d-flex justify-content-center align-items-center"
              >
                <i className="fa fa-search" />
              </button>
            </form>
          </div>

          <div className="d-flex flex-row align-items-center justify-content-center col-12">
            <div className="cardTotalOpened d-flex  flex-column justify-content-evenly align-items-center col-3 me-1">
              <div className="d-flex flex-column align-items-center justify-content-center">
                <p className="totalLabel">Total:</p>

                <div className="value d-flex justify-content-between mt-3">
                  <span className="moneyLabel d-flex align-items-center me-2">
                    R$
                  </span>

                  <p
                    id="total"
                    className="totalValue d-flex align-items-center me-2"
                  >
                    -------
                  </p>

                  <span id="showOrHidden" className="d-flex align-items-center">
                    <i
                      onClick={this.handleVisualization}
                      id="showTotalOpened"
                      className="fa-solid fa-eye-slash"
                    ></i>
                  </span>
                </div>
              </div>

              {this.state.isFiltered && (
                <div className="d-flex align-items-center justify-content-center col-12">
                  <button
                    onClick={() => this.closeAllSales(this.state.sales)}
                    className="btnFinish col-8"
                  >
                    Encerrar as vendas
                  </button>
                </div>
              )}

              <div className="pagination d-flex flex-column justify-content-center align-items-center col-10">
                <div className="perPage d-flex justify-content-between align-items-center col-12 mb-3">
                  <span className="col-6">Vendas por página:</span>
                  <select
                    className="col-5 text-center"
                    value={this.state.query.limit}
                    onChange={this.handleLimitChange}
                  >
                    {this.state.perPage.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="prevNext d-flex justify-content-evenly align-items-center col-12">
                  <div className="col-2 d-flex align-items-center justify-content-center">
                    {this.state.query.page > 1 && (
                      <span
                        className="nextNPrevious"
                        onClick={this.previousPage}
                      >
                        &lt;
                      </span>
                    )}
                  </div>

                  <div className="col-2 d-flex align-items-center justify-content-center">
                    <span> {this.state.query.page} </span>
                  </div>

                  <div className="col-2 d-flex align-items-center justify-content-center">
                    {this.state.query.page < this.state.totalPages && (
                      <span className="nextNPrevious" onClick={this.nextPage}>
                        &gt;
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mainDivOpened col-9">
              {this.state.sales.map((sale: any) => (
                <div
                  className="container d-flex justify-content-center"
                  key={sale._id}
                >
                  <SaleCard
                    width={"col-8"}
                    sale={sale}
                    sales={this.state.sales}
                    sync={this.syncSalesAfterDeleting}
                  />

                  <ProductCard sale={sale} />

                  <div className="closeAllAction d-flex align-items-center justify-content-center col-1">
                    <button
                      className="btn"
                      onClick={() => this.closeSale(sale._id)}
                    >
                      <i className="fa fa-circle-dollar-to-slot" />
                      <p> Faturar </p>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default SalesOpened;
