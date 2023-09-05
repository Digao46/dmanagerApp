import React from "react";
import { Link, Redirect } from "react-router-dom";

import "./HomeCard.scss";

class HomeCard extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div
        className={`${this.props.class} card d-flex justify-content-center align-items-center col-3`}
      >
        <div className="row w-100 h-100">
          <div className="col-6 d-flex flex-column align-items-start justify-content-around h-100">
            <p>{this.props.title}</p>

            <button className="btn">
              <Link to={this.props.link}>Ver Mais</Link>
            </button>
          </div>

          <div className="col-6 d-flex justify-content-center align-items-center">
            <i className={this.props.icon} />
          </div>
        </div>
      </div>
    );
  }
}

export default HomeCard;
