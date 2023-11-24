import React from "react";

import "./DescriptionCard.scss";

class DescriptionCard extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div
        className={`descCard ${this.props.width} d-flex flex-column justify-content-center me-2`}
      >
        <div className="cardHeader d-flex justify-content-around">
          <p className="label d-flex justify-content-start col-8 ">
            Descrição:
          </p>
        </div>

        <div className="description d-flex flex-column justify-content-center">
          <div className="descArea d-flex justify-content-center">
            <span className="descText">
              {this.props.context === "addition"
                ? this.props.addition.description
                : this.props.discount.description}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default DescriptionCard;
