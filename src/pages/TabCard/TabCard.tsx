import React from "react";
import { toast } from "react-hot-toast";

import {
  findTabCardData,
  findTabCardDataByClientId,
} from "../../services/Api/TabCard/TabCardEndpoint";
import { findClients } from "../../services/Api/Clients/ClientsEndpoint";

import isAuthenticated from "../../services/Authentication/Authentication";

import SaleCard from "../../components/SaleCard/SaleCard";
import ProductCard from "../../components/ProductCard/ProductCard";

import { nextPage, prevPage } from "../../helpers/helpers";

import "./TabCard.scss";
import { Redirect } from "react-router";
import AdditionCard from "../../components/AdditionCard/AdditionCard";
import DescriptionCard from "../../components/DescriptionCard/DescriptionCard";
import { Link } from "react-router-dom";

class TabCard extends React.Component<any, any> {
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

      data: [],
      total: 0,

      // filtering
      clients: [],
      client: {},
      clientsQuery: {
        limit: 300,
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

    this.findTabCardData(this.state.query);

    findClients(this.state.clientsQuery)
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

  findTabCardData = async (query: any) => {
    findTabCardData(this.state.query)
      .then((res: any) => {
        let pages = Math.ceil(res.data.data.documents.qtd / query.limit);

        this.setState({
          data: res.data.data.registers,
          total: res.data.data.documents.total,
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
          data: [],
          totalPages: 1,
          total: 0,
        });

        return toast.error(err.response.data.message);
      });
  };

  findTabCardDataByClientId = async (client: any, query: any, e?: any) => {
    if (e) e.preventDefault();

    findTabCardDataByClientId(client._id, query)
      .then((res: any) => {
        let pages = Math.ceil(res.data.data.documents.qtd / query.limit);

        this.setState({
          data: res.data.data.registers,
          total: client.debit,
          totalDocs: res.data.data.documents.qtd,
          totalPages: pages,
          isFiltered: true,
        });

        setTimeout(this.handleVisualization, 0);
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
  };

  handleInputChange = async (e: any) => {
    if (this.state.data.length > 0) this.findTabCardData(this.state.query);

    const span = document.getElementById("total") as HTMLElement;
    const icon = document.getElementById("showTotalOpened")! as HTMLElement;

    if (icon.className === "fa fa-eye") {
      icon.className = "fa-solid fa-eye-slash";
      span.innerText = "-------";
    }

    const name = e.target.value;

    const client = this.state.clients.find(
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

    this.setState({ client: client ?? {}, isFiltered: false });
  };

  syncDataAfterDeleting = (newObject: any) => {
    let total = 0;

    newObject.map((childObject: any) => (total += childObject.total));

    this.setState({ data: newObject, total: total });
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
      await this.findTabCardDataByClientId(this.state.client, query);
    } else {
      await this.findTabCardData(query);
    }
  };

  previousPage = async (e: any) => {
    e.preventDefault();

    if (this.state.isFiltered) {
      prevPage(this, this.findTabCardDataByClientId, this.state.client);
    } else {
      prevPage(this, this.findTabCardData);
    }
  };

  nextPage = async (e: any) => {
    e.preventDefault();

    if (this.state.isFiltered) {
      nextPage(this, this.findTabCardDataByClientId, this.state.client);
    } else {
      nextPage(this, this.findTabCardData);
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
                this.findTabCardDataByClientId(
                  this.state.client,
                  this.state.query,
                  e
                )
              }
            >
              <input
                type="text"
                onChange={this.handleInputChange}
                id="clientInput"
                className="selectName col-6 me-2 px-4 py-1"
                list="clientsList"
                placeholder="Selecione o cliente:"
                required
              />

              <datalist id="clientsList">
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
                <div className="d-flex flex-column align-items-center justify-content-center col-12">
                  <Link
                    to={"/discounts/add"}
                    className="btnDiscount mb-1 col-8"
                  >
                    Descontar
                  </Link>

                  <button
                    onClick={() => window.alert("Em desenvolvimento!")}
                    className="btnNotify mt-1 col-8"
                  >
                    Cobrar
                  </button>
                </div>
              )}

              <div className="pagination d-flex flex-column justify-content-center align-items-center col-10">
                <div className="perPage d-flex justify-content-between align-items-center col-12 mb-3">
                  <span className="col-6">Registros por página:</span>
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
              {this.state.data.map((item: any) =>
                item.description ? (
                  <div
                    className="container d-flex justify-content-center"
                    key={item._id}
                  >
                    <AdditionCard
                      cardHeaderWidth={"col-10"}
                      width={"col-9"}
                      addition={item}
                      additions={this.state.data}
                      sync={this.syncDataAfterDeleting}
                    />
                    <DescriptionCard
                      width={"col-3"}
                      addition={item}
                      context="addition"
                    />
                  </div>
                ) : (
                  <div
                    className="container d-flex justify-content-center"
                    key={item._id}
                  >
                    <SaleCard
                      cardHeaderWidth={"col-11"}
                      width={"col-9"}
                      sale={item}
                      sales={this.state.data}
                      sync={this.syncDataAfterDeleting}
                    />

                    <ProductCard sale={item} />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default TabCard;
