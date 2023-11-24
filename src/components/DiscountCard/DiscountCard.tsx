import React from "react";
import { toast } from "react-hot-toast";

import { deleteDiscount } from "../../services/Api/TabCard/Discounts/DiscountsEndpoint";

import isAuthorizated from "../../services/Authorization/Authorization";

import "./DiscountCard.scss";

class DiscountCard extends React.Component<any, any> {
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

  deleteDiscount(id: string) {
    const newDiscounts = this.props.discounts.filter(
      (discount: any) => discount._id !== id
    );

    deleteDiscount(id)
      .then((res) => {
        toast.success(res.data.message);
        this.props.sync(newDiscounts);
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        }

        toast.error(err.response.data.message);

        this.setState({ redirectTo: "/discounts" });
      });
  }

  render() {
    return (
      <div
        className={`discountCard ${this.props.width} d-flex flex-row justify-content-center align-items-center mb-2 me-2`}
      >
        <div className={`${this.props.cardHeaderWidth}`}>
          <div className="cardHeader d-flex justify-content-around">
            <span className="sellerLabel me-1">
              Metodo: {this.props.discount.paymentMethod.method}
            </span>
            {this.props.discount.client.name && (
              <span className="clientLabel me-1">
                Cliente: {this.props.discount.client.name}
              </span>
            )}
            <span className="sellerLabel me-1">
              Usuário: {this.props.discount.seller.username}
            </span>
            <span className="dateLabel me-1">
              Data: {this.formatDate(this.props.discount.createdAt)}
            </span>
            {isAuthorizated() && (
              <span
                onClick={() => this.deleteDiscount(this.props.discount._id)}
                className="trashCan"
              >
                <i className="fa fa-trash" />
              </span>
            )}
          </div>

          <div className="totalValue d-flex justify-content-around align-items-end mt-2 mx-5">
            <p className="totalLabel mb-1"> Valor total: </p>

            <div>
              <span className="moneyLabel">R$</span>
              <span className="total">
                {this.props.discount.total.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DiscountCard;
