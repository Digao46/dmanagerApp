import React from "react";
import { toast } from "react-hot-toast";

import { deleteAddition } from "../../services/Api/TabCard/Additions/AdditionsEndpoint";

import isAuthorizated from "../../services/Authorization/Authorization";

import "./AdditionCard.scss";

class AdditionCard extends React.Component<any, any> {
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

  deleteAddition(id: string) {
    const newAdditions = this.props.additions.filter(
      (addition: any) => addition._id !== id
    );

    deleteAddition(id)
      .then((res) => {
        toast.success(res.data.message);
        this.props.sync(newAdditions);
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        }

        toast.error(err.response.data.message);

        this.setState({ redirectTo: "/additions" });
      });
  }

  render() {
    return (
      <div
        className={`additionCard ${this.props.width} d-flex flex-row justify-content-center align-items-center mb-2 me-2`}
      >
        <div className={`${this.props.cardHeaderWidth}`}>
          <div className="cardHeader d-flex justify-content-around">
            <span className="statusLabel me-1">
              Status:{" "}
              {this.props.addition.status == "Comanda" ? (
                <i className="fa fa-box-open" />
              ) : (
                <i className="fa fa-check" />
              )}
            </span>

            {this.props.addition.client.name && (
              <span className="clientLabel me-1">
                Cliente: {this.props.addition.client.name}
              </span>
            )}
            <span className="sellerLabel me-1">
              Usuário: {this.props.addition.seller.username}
            </span>
            <span className="dateLabel me-1">
              Data: {this.formatDate(this.props.addition.createdAt)}
            </span>
            <span className="hourLabel me-1">
              Hora: {this.formatHour(this.props.addition.createdAt)}
            </span>
            {isAuthorizated() && (
              <span
                onClick={() => this.deleteAddition(this.props.addition._id)}
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
                {this.props.addition.total.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdditionCard;
