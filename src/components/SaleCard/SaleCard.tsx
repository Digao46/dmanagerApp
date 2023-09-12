import React from "react";
import { toast } from "react-hot-toast";

import { deleteSale, findSales } from "../../services/Api/Sales/SalesEndpoint";

import isAuthorizated from "../../services/Authorization/Authorization";

import "./SaleCard.scss";

class SaleCard extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  formatDate(dateTimeString: string) {
    const dateTime = new Date(dateTimeString);

    return dateTime.toLocaleDateString();
  }

  formatHour(dateTimeString: string) {
    const dateTime = new Date(dateTimeString);

    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    const formatedTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;

    return formatedTime;
  }

  deleteSale(id: string) {
    const newSales = this.props.sales.filter((sale: any) => sale._id !== id);

    this.props.sync(newSales);

    deleteSale(id)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        } else {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/sales" });
        }
      });
  }

  render() {
    return (
      <div className="sale col-8 d-flex flex-row justify-content-center align-items-center mb-2 me-2">
        <div className="col-8">
          <div className="cardHeader d-flex justify-content-between">
            <span className="clientLabel me-3">
              Cliente: {this.props.sale.client.name}
            </span>
            <span className="sellerLabel me-3">
              Vendedor: {this.props.sale.seller.username}
            </span>
            <span className="dateLabel me-3">
              Data: {this.formatDate(this.props.sale.createdAt)}
            </span>
            <span className="hourLabel me-3">
              Hora: {this.formatHour(this.props.sale.createdAt)}
            </span>
            {isAuthorizated() && (
              <span
                onClick={() => this.deleteSale(this.props.sale._id)}
                className="trashCan"
              >
                <i className="fa fa-trash"></i>
              </span>
            )}
          </div>

          <div className="totalValue d-flex justify-content-between align-items-end mt-2 mx-5">
            <p className="totalLabel mb-1"> Valor total: </p>

            <div>
              <span className="moneyLabel">R$</span>
              <span className="total">
                {this.props.sale.total.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SaleCard;
