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
              {product.product.length > 14 ? (
                <p className="productName d-flex justify-content-center align-items-center col-6 text-start">
                  {product.product[0]}
                  {product.product[1]}
                  {product.product[2]}
                  {product.product[3]}
                  {product.product[4]}
                  {product.product[5]}
                  {product.product[6]}
                  {product.product[7]}
                  {product.product[8]}
                  {product.product[9]}
                  {product.product[10]}
                  {product.product[11]}
                  {product.product[12]}
                  ...
                </p>
              ) : (
                <p className="productName d-flex justify-content-center align-items-center col-6 text-start">
                  {product.product}
                </p>
              )}

              <p className="d-flex justify-content-center align-items-center col-1">
                |
              </p>
              <p className="soldQuantity d-flex justify-content-center align-items-center col-4">
                {product.qtd}
                <span className="unity ms-1">uni.</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ProductCard;
