import React from "react";
import { DatePicker, Space } from "antd";
import { toast } from "react-hot-toast";

import { findAdditions } from "../../services/Api/TabCard/Additions/AdditionsEndpoint";
import isAuthenticated from "../../services/Authentication/Authentication";

import AdditionCard from "../../components/AdditionCard/AdditionCard";
import DescriptionCard from "../../components/DescriptionCard/DescriptionCard";

import "./Additions.scss";
import { Redirect } from "react-router";

import { filter, nextPage, prevPage } from "../../helpers/helpers";

const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";

class Additions extends React.Component<any, any> {
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

      additions: [],
      total: 0,

      // filtering
      begin: null,
      end: null,

      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      window.alert("Sessão Expirada. Por favor efetue o login novamente!");
      this.setState({ redirectTo: "/login" });
    }

    this.findAdditions(this.state.query);
  }

  findAdditions = async (query: any) => {
    await findAdditions(query)
      .then((res) => {
        let pages = Math.ceil(res.data.data.documents.qtd / query.limit);

        this.setState({
          additions: res.data.data.additions,
          totalDocs: res.data.data.documents.qtd,
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
        }

        this.setState({
          additions: [],
          totalPages: 1,
          total: 0,
        });

        return toast.error(err.response.data.message);
      });
  };

  filterAdditions = async (e: any, field: string, conditions: any[]) => {
    e.preventDefault();

    await filter(this, field, conditions, findAdditions)
      .then((res: any) => {
        let pages = Math.ceil(
          res.data.data.documents.qtd / this.state.query.limit
        );

        this.setState({
          additions: res.data.data.additions,
          totalDocs: res.data.data.documents.qtd,
          totalPages: pages,
          total: res.data.data.documents.total,
        });

        toast.success("Filtro aplicado!");
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        }

        this.setState({
          additions: [],
          totalPages: 1,
          total: 0,
        });

        return toast.error(err.response.data.message);
      });
  };

  syncAdditionsAfterDeleting = (newAdditions: any) => {
    let total = 0;

    newAdditions.map((addition: any) => (total += addition.total));

    this.setState({ additions: newAdditions, total: total });
  };

  handleDatePickerChange = async (e: any) => {
    const auxQuery = { ...this.state.query };

    auxQuery.where = JSON.stringify({}); // Resetando o where para poder buscar as additions
    auxQuery.page = 1; // Resetando a page para evitar erros

    this.setState({ query: auxQuery });

    if (this.state.additions.length > 0) await this.findAdditions(auxQuery);

    const span = document.getElementById("total") as HTMLElement;

    const icon = document.getElementById("showTotalSold")! as HTMLElement;

    if (icon.className === "fa fa-eye") {
      icon.className = "fa-solid fa-eye-slash";
      span.innerText = "-------";
    }

    if (e) {
      const dateBegin = new Date(e[0].$d).setHours(0, 0, 0, 0);
      const dateEnd = new Date(e[1].$d).setHours(23, 59, 59, 999);

      this.setState({
        begin: dateBegin,
        end: dateEnd,
      });
    }
  };

  handleVisualization = () => {
    const span = document.getElementById("total") as HTMLElement;

    const icon = document.getElementById("showTotalSold")! as HTMLElement;

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

    await this.findAdditions(query);
  };

  previousPage = async (e: any) => {
    e.preventDefault();

    await prevPage(this, this.findAdditions);
  };

  nextPage = async (e: any) => {
    e.preventDefault();

    await nextPage(this, this.findAdditions);
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="container d-flex justify-content-center col-12 pt-3">
        <div className="container d-flex justify-content-center">
          <div className="cardTotal d-flex flex-column justify-content-evenly align-items-center col-3 me-1">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <p className="totalLabel">Valor total das adições:</p>

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
                    id="showTotalSold"
                    className="fa-solid fa-eye-slash"
                  ></i>
                </span>
              </div>
            </div>

            <div className="filter d-flex flex-column justify-content-center align-items-center">
              <span>Escolha um período:</span>

              <div className="formFilter d-flex justify-content-center align-items-center mt-2">
                <form
                  className="d-flex flex-column align-items-center"
                  onSubmit={(e) =>
                    this.filterAdditions(e, "createdAt", [
                      {
                        operator: "$gte",
                        value: this.state.begin,
                      },
                      {
                        operator: "$lte",
                        value: this.state.end,
                      },
                    ])
                  }
                >
                  <Space direction="vertical" className="mb-1 col-11">
                    <RangePicker
                      format={dateFormat}
                      onChange={this.handleDatePickerChange}
                    />
                  </Space>
                  <button
                    type="submit"
                    className="btn d-flex justify-content-center align-items-center mt-1 mb-1"
                  >
                    <i className="fa fa-search" />
                  </button>
                </form>
              </div>
            </div>

            <div className="pagination d-flex flex-column justify-content-center align-items-center col-10">
              <div className="perPage d-flex justify-content-between align-items-center col-12 mb-3">
                <span className="col-6">Adições por página:</span>
                <select
                  className="col-5 text-center"
                  value={this.state.query.limit}
                  onChange={this.handleLimitChange}
                >
                  {this.state.perPage.map((option: number, index: number) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="prevNext d-flex justify-content-evenly align-items-center col-12">
                <div className="col-2 d-flex align-items-center justify-content-center">
                  {this.state.query.page > 1 && (
                    <span className="nextNPrevious" onClick={this.previousPage}>
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

          <div className="mainDiv col-9">
            {this.state.additions.map((addition: any) => (
              <div
                className="container d-flex justify-content-center"
                key={addition._id}
              >
                <AdditionCard
                  cardHeaderWidth={"col-10"}
                  width={"col-8"}
                  addition={addition}
                  additions={this.state.additions}
                  sync={this.syncAdditionsAfterDeleting}
                />
                <DescriptionCard
                  width={"col-4"}
                  addition={addition}
                  context="addition"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
}

export default Additions;
