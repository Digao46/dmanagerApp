import React from "react";
import { DatePicker, Space } from "antd";
import { toast } from "react-hot-toast";

import { findSales } from "../../services/Api/Sales/SalesEndpoint";
import isAuthenticated from "../../services/Authentication/Authentication";

import SaleCard from "../../components/SaleCard/SaleCard";
import ProductCard from "../../components/ProductCard/ProductCard";

import "./Sales.scss";
import { Redirect } from "react-router";

const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";

class Sales extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      query: {
        limit: 50,
        page: 1,
        orderBy: JSON.stringify([{ field: "createdAt", direction: "desc" }]),
      },
      sales: [],
      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      window.alert("Sessão Expirada. Por favor efetue o login novamente!");
      this.setState({ redirectTo: "/login" });
    }

    findSales(this.state.query)
      .then((res) => this.setState({ sales: res.data.sales }))
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
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="container d-flex justify-content-center col-12 pt-3">
        <div className="container row d-flex justify-content-center">
          <div className="cardTotal d-flex flex-column justify-content-evenly align-items-center col-3 mb-2">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <p className="totalLabel">Valor total das vendas:</p>

              <div className="divValue d-flex justify-content-between mt-3">
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
                    // onClick={this.handleVisualization}
                    id="showTotalSold"
                    className="fa fa-eye-slash"
                  ></i>
                </span>
              </div>
            </div>

            <div className="filter d-flex flex-column justify-content-center align-items-center">
              <span>Escolha um período:</span>

              <div className="formFilter d-flex justify-content-center align-items-center mt-2">
                <form
                  className="d-flex flex-column align-items-center"
                  // onSubmit={this.filterByCustomPeriod}
                >
                  <Space direction="vertical" className="mb-1 col-11">
                    <RangePicker
                      format={dateFormat}
                      // onChange={this.handleChange}
                    />
                  </Space>
                  <button
                    type="submit"
                    className="btn d-flex justify-content-center align-items-center mb-1"
                  >
                    <i className="fa fa-search" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="mainDiv col-9">
            {this.state.sales.map((sale: any) => (
              <div
                className="container d-flex justify-content-center"
                key={sale._id}
              >
                <SaleCard sale={sale} />
                <ProductCard sale={sale} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
}

export default Sales;
