import React from "react";
import { DatePicker, Space } from "antd";
import ReactECharts from "echarts-for-react";

import { Redirect } from "react-router";

import isAuthenticated from "../../services/Authentication/Authentication";

import { findCashData } from "../../services/Api/Cash/CashEndpoint";

import "./Cash.scss";
import { filter } from "../../helpers/helpers";

const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";

class Cash extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      query: {
        where: JSON.stringify({}),
      },

      topProductOption: {
        xAxis: {},
        yAxis: {
          type: "value",
        },
        series: [],
      },

      salesOptions: {
        series: [],
        label: {
          color: "#e6c779",
          show: true,
          formatter: function (params) {
            return `R$${params.value.toFixed(2).replace(".", ",")} (${
              params.percent
            }%)`;
          },
        },
      },

      paymentOptions: {
        series: [],
        label: {
          color: "#e6c779",
          show: true,
          formatter: function (params) {
            return `R$${params.value.toFixed(2).replace(".", ",")} (${
              params.percent
            }%)`;
          },
        },
      },

      begin: new Date().setHours(0, 0, 0, 0),
      end: new Date().setHours(23, 59, 59, 999),

      redirectTo: null,
    };
  }

  async componentDidMount(): Promise<void> {
    if (!isAuthenticated()) {
      window.alert("Sessão Expirada. Por favor efetue o login novamente!");
      this.setState({ redirectTo: "/login" });
    }

    const productOption = { ...this.state.topProductOption };
    const statusOption = { ...this.state.salesOption };
    const paymentOption = { ...this.state.paymentOptions };

    await filter(
      this,
      "createdAt",
      [
        { operator: "$gte", value: this.state.begin },
        { operator: "$lte", value: this.state.end },
      ],
      findCashData
    ).then((res) => {
      Object.assign(statusOption, {
        legend: [
          {
            data: res.data.data.salesStatusTotal.legendData,
            textStyle: {
              color: "#e6c779",
            },
          },
        ],
        series: [
          {
            type: "pie",
            data: res.data.data.salesStatusTotal.data,
          },
        ],
      });

      Object.assign(paymentOption, {
        legend: [
          {
            data: res.data.data.paymentMethodsTotal.legendData,
            textStyle: {
              color: "#e6c779",
            },
          },
        ],
        series: [
          {
            type: "pie",
            data: res.data.data.paymentMethodsTotal.data,
          },
        ],
      });

      Object.assign(productOption, {
        legend: {
          data: ["Quantidade de vendas"],
          textStyle: {
            color: "#e6c779",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },

        xAxis: {
          type: "category",
          data: res.data.data.mostSoldProducts.products.map(
            (item) => item.name
          ),
        },

        series: [
          {
            type: "bar",
            name: "Quantidade de vendas",
            data: res.data.data.mostSoldProducts.products.map(
              (item) => item.qtd
            ),
          },
        ],
      });

      this.setState({
        topProductOption: productOption,
        salesOptions: statusOption,
        paymentOptions: paymentOption,
      });
    });
  }

  handleDatePickerChange = async (e: any) => {
    const auxQuery = { ...this.state.query };

    const productOption = { ...this.state.topProductOption };
    const statusOption = { ...this.state.salesOption };
    const paymentOption = { ...this.state.paymentOptions };

    auxQuery.where = JSON.stringify({}); // Resetando o where para poder buscar

    this.setState({ query: auxQuery });

    if (e) {
      const dateBegin = new Date(e[0].$d).setHours(0, 0, 0, 0);
      const dateEnd = new Date(e[1].$d).setHours(23, 59, 59, 999);

      await filter(
        this,
        "createdAt",
        [
          { operator: "$gte", value: dateBegin },
          { operator: "$lte", value: dateEnd },
        ],
        findCashData
      ).then((res) => {
        Object.assign(productOption, {
          xAxis: {
            data: res.data.data.mostSoldProducts.productsNames,
          },

          series: [
            {
              type: "bar",
              name: "Vendas",
              data: res.data.data.mostSoldProducts.salesQtd,
              color: "#198754",
            },
          ],
        });

        Object.assign(statusOption, {
          legend: [
            {
              data: res.data.data.salesStatusTotal.legendData,
              textStyle: {
                color: "#e6c779",
              },
            },
          ],
          series: [
            {
              type: "pie",
              data: res.data.data.salesStatusTotal.data,
            },
          ],
        });

        Object.assign(paymentOption, {
          legend: [
            {
              data: res.data.data.paymentMethodsTotal.legendData,
              textStyle: {
                color: "#e6c779",
              },
            },
          ],
          series: [
            {
              type: "pie",
              data: res.data.data.paymentMethodsTotal.data,
            },
          ],
        });

        this.setState({
          topProductOption: productOption,
          salesOptions: statusOption,
          paymentOptions: paymentOption,
        });
      });
    }
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="d-flex flex-column align-items-center col-12 pt-3">
        <div className="d-flex justify-content-around align-items-center mb-2 col-12">
          <div className="saleChartArea p-3 col-4">
            <p className="mb-1"> Vendas: </p>
            <ReactECharts
              className="col-12"
              option={this.state.salesOptions}
              style={{ height: "400px", width: "100%" }}
            />
          </div>

          <div className="formFilter d-flex flex-column justify-content-center align-items-center">
            <span className="mb-2"> Selecione o periodo: </span>
            <Space direction="vertical" className="mb-1 col-10">
              <RangePicker
                format={dateFormat}
                onChange={this.handleDatePickerChange}
              />
            </Space>
          </div>

          <div className="paymentChartArea p-3 col-4">
            <p className="mb-1"> Pagamentos: </p>
            <ReactECharts
              className="col-12"
              option={this.state.paymentOptions}
              style={{ height: "400px", width: "100%" }}
            />
          </div>
        </div>

        <hr />

        <div className="paymentChartArea p-3 col-8">
          <p className="mb-1"> Top 10 Produtos: </p>
          <ReactECharts
            className="col-12"
            option={this.state.topProductOption}
            style={{ height: "400px", width: "100%" }}
          />
        </div>
      </section>
    );
  }
}

export default Cash;
