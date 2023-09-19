import React from "react";

import "./ProductCard.scss";

class ProductCard extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="products d-flex flex-column justify-content-center col-3 me-2">
        <div className="cardHeader d-flex justify-content-around">
          <p className="itemsLabel d-flex justify-content-center pe-5 col-8 ">
            {" "}
            Items:{" "}
          </p>
          <p className="itemsLabel d-flex justify-content-center pe-5 col-4">
            {" "}
            Qtd:{" "}
          </p>
        </div>

        <div className="productsList d-flex flex-column justify-content-center">
          {this.props.sale.products?.map((product: any, i: any) => (
            <div key={i} className="productArea d-flex justify-content-center">
              <span className="productName">{product.name}</span>
              <span className="separator">|</span>
              <span className="soldQuantity">
                {product.qtd}
                <span className="unity ms-1">uni.</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ProductCard;
