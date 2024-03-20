import React from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-hot-toast";

import { findClients } from "../../../services/Api/Clients/ClientsEndpoint";
import {
  findProduct,
  findProducts,
} from "../../../services/Api/Storage/StorageEndpoint";
import { addSale } from "../../../services/Api/Sales/SalesEndpoint";

import isAuthenticated from "../../../services/Authentication/Authentication";

import "./AddSale.scss";

class AddSale extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      productsQuery: {
        orderBy: JSON.stringify([
          { field: "category", direction: "asc" },
          { field: "name", direction: "asc" },
        ]),
      },
      products: [],
      product: {
        _id: "",
        name: "",
        sellPrice: 0,
        storage: 0,
        use: [],
        qtd: 1,
        total: 0,
      },

      clientsQuery: {
        orderBy: JSON.stringify([{ field: "name", direction: "asc" }]),
      },
      clients: [],
      client: {},

      productsInCart: [],
      paymentMethod: "",
      status: "Comanda",
      total: 0,

      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      window.alert("Sessão Expirada. Por favor efetue o login novamente!");
      this.setState({ redirectTo: "/login" });
    }

    findProducts(this.state.productsQuery)
      .then((res: any) => {
        this.setState({ products: res.data.data.products });
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        }

        this.setState({
          data: [],
          totalPages: 1,
          total: 0,
        });

        return toast.error(err.response.data.message);
      });

    findClients(this.state.clientsQuery)
      .then((res: any) => {
        this.setState({ clients: res.data.data.clients });
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        }

        this.setState({
          data: [],
          totalPages: 1,
          total: 0,
        });

        return toast.error(err.response.data.message);
      });
  }

  handleProductSelectChange = async (e: any) => {
    const name = e.target.value;

    let productInCartFound = this.state.productsInCart.find(
      (product: any) =>
        product.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") ===
        name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
    );

    let productFound = this.state.products.find(
      (product: any) =>
        product.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") ===
        name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
    );

    if (!productFound && !productInCartFound) {
      this.setState({
        product: {
          _id: "",
          name: "",
          sellPrice: 0,
          storage: 0,
          use: [],
          qtd: 1,
          total: 0,
        },
      });
    } else if (productInCartFound) {
      const product = { ...this.state.product };

      product._id = productInCartFound._id;
      product.name = productInCartFound.name;
      product.sellPrice = productInCartFound.sellPrice;
      product.use = productInCartFound.use;
      product.storage = productInCartFound.storage;
      product.total = productInCartFound.sellPrice * product.qtd;

      this.setState({ product: product });
    } else {
      await findProduct(productFound._id)
        .then((res: any) => {
          const product = { ...this.state.product };

          product._id = res.data.product._id;
          product.name = res.data.product.name;
          product.sellPrice = +res.data.product.sellPrice;
          product.use = res.data.product.use;
          product.storage = +res.data.product.storage;
          product.total = +res.data.product.sellPrice * product.qtd;

          this.setState({ product: product });
        })
        .catch((err: any) => {
          if (err.response.status === 401) {
            toast.error(err.response.data.message);

            this.setState({ redirectTo: "/login" });

            localStorage.removeItem("user");

            return;
          }

          return toast.error(err.response.data.message);
        });
    }
  };

  handleQtdChange = (e: any) => {
    const product = { ...this.state.product };

    product.qtd = +e.target.value;
    product.total = product.qtd * product.sellPrice;

    this.setState({ product: product });
  };

  handleClientChange = (e: any) => {
    const name = e.target.value;

    const clientFound = this.state.clients.find(
      (client: any) =>
        client.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") ===
        name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
    );

    this.setState({ client: clientFound });
  };

  handleStatusChange = (e: any) => {
    let value: number = +e.target.value;

    let status: string = "";

    switch (value) {
      case 0:
        status = "Finalizada";
        break;

      case 1:
        status = "Comanda";
        break;

      case 2:
        status = "Dividido";
        break;

      default:
        "Comanda";
        break;
    }

    this.setState({ status: status });
  };

  handleMethodChange = (e: any) => {
    let value: number = +e.target.value;

    let method: string = "";

    switch (value) {
      case 0:
        method = "Dinheiro";
        break;

      case 1:
        method = "Cartão";
        break;

      case 2:
        method = "Pix";
        break;

      default:
        "Dinheiro";
        break;
    }

    this.setState({ paymentMethod: method });
  };

  addToCart = (e: any) => {
    e.preventDefault();

    const inCart = [...this.state.productsInCart];

    const product = { ...this.state.product };

    const verifyStorage = product.qtd <= product.storage ? true : false;

    const alreadyInCart = inCart.find((prod: any) => prod._id === product._id);

    if (!alreadyInCart && verifyStorage) {
      product.storage = product.storage - product.qtd;

      inCart.push(product);
      this.setState({ total: this.state.total + product.total });
      this.setState({ product: product });
    } else if (alreadyInCart && verifyStorage) {
      const initialQtd = alreadyInCart.qtd;

      alreadyInCart.qtd = alreadyInCart.qtd + product.qtd;
      alreadyInCart.total = alreadyInCart.total + product.total;
      alreadyInCart.storage = alreadyInCart.storage - product.qtd;

      const total =
        this.state.total +
        (alreadyInCart.qtd - initialQtd) * alreadyInCart.sellPrice;

      this.setState({ total: total });
      this.setState({ product: alreadyInCart });
    } else {
      return toast("Estoque Insuficiente!", {
        icon: "⚠️",
      });
    }

    this.setState({ productsInCart: inCart });

    // Zerar o input e o state
    let selectProductInput = document.getElementById(
      "productInput"
    ) as HTMLInputElement;

    let qtdInput = document.getElementById("quantityInput") as HTMLInputElement;

    selectProductInput.value = "";
    qtdInput.value = "";

    this.setState({
      product: {
        _id: "",
        name: "",
        sellPrice: 0,
        storage: 0,
        use: [],
        qtd: 1,
        total: 0,
      },
    });
  };

  removeFromCart = (id: string) => {
    const product = this.state.productsInCart.find(
      (item: any) => item._id === id
    );

    const newCart = this.state.productsInCart.filter(
      (item: any) => item._id !== id
    );

    this.setState({
      productsInCart: newCart,
      total: this.state.total - product.total,
    });
  };

  addSale = async (e: any) => {
    e.preventDefault();

    if (!this.state.client._id && this.state.status == "Comanda") {
      return toast.error(
        "Para uma venda na comanda o cliente precisa ser informado!"
      );
    }

    if (this.state.status === "Finalizada" && !this.state.paymentMethod) {
      return toast.error(
        "Para uma venda finalizada precisa ser informado o metodo de pagamento!"
      );
    }

    const sale = {
      products: [],
      seller: { _id: "", username: "" },
      client: { _id: "", name: "" },
      status: "",
      total: 0,
      paymentMethod: {},
    };

    const userData = JSON.parse(localStorage.getItem("user")!);
    const clientData = this.state.client;

    const seller = {
      _id: userData._id,
      username: userData.username,
    };

    const client = {
      _id: clientData._id ?? "",
      name: clientData.name ?? "",
    };

    let paymentMethod: any;

    if (this.state.status == "Finalizada") {
      paymentMethod = {
        method: this.state.paymentMethod,
        value: this.state.total,
      };
    } else {
      paymentMethod = null;
    }

    sale.products = this.state.productsInCart;
    sale.client = client;
    sale.seller = seller;
    sale.total = this.state.total;
    sale.status = this.state.status;
    sale.paymentMethod = paymentMethod;

    addSale(sale)
      .then((res: any) => {
        toast.success(res.data.message);

        this.setState({ redirectTo: "/sales" });
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        }

        return toast.error(err.response.data.message);
      });
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="container d-flex flex-column align-items-center">
        <div className="title d-flex justify-content-center align-items-center">
          <h1> Nova Venda </h1>
        </div>

        <div className="content container d-flex justify-content-center">
          <div className="productForm col-6">
            <div className="d-flex justify-content-center">
              <h3>Produto:</h3>
            </div>

            <form
              onSubmit={this.addToCart}
              className="d-flex justify-content-center mt-2 col-12"
            >
              <div className="col-8">
                <input
                  type="text"
                  onChange={this.handleProductSelectChange}
                  id="productInput"
                  className="productInput col-12 ps-3 mb-4"
                  list="productsList"
                  placeholder="Selecione um produto:"
                  autoFocus
                  required
                />

                <datalist id="productsList">
                  {this.state.products.map((product: any) => (
                    <option
                      id="productId"
                      key={product._id}
                      value={product.name}
                    />
                  ))}
                </datalist>

                <div className="d-flex col-12 mb-4">
                  <div className="input-group">
                    <span className="holder input-group-text">R$</span>
                    <input
                      type="text"
                      name="sellPrice"
                      className="sellPriceInput form-control col-12 ps-2"
                      placeholder="Preço"
                      value={(+this.state.product.sellPrice).toFixed(2)}
                      readOnly
                    />
                  </div>

                  <div className="col-4">
                    <input
                      type="text"
                      name="storage"
                      className="storageInput col-12 ps-3"
                      placeholder="Estoque"
                      value={this.state.product.storage}
                      readOnly
                    />
                  </div>
                </div>

                <input
                  onChange={this.handleQtdChange}
                  id="quantityInput"
                  name="quantity"
                  className="quantityInput col-12 ps-3 mb-4"
                  placeholder="Quantidade: 1"
                />

                <div className="btns d-flex justify-content-center mb-4">
                  <button type="submit" className="btn btnAdd col-4 me-2">
                    Adicionar
                  </button>
                  <Link to="/sales" className="btn btnCancel col-4 me-2">
                    Cancelar
                  </Link>
                </div>
              </div>
            </form>
          </div>

          <div className="cartArea col-6">
            <div className="d-flex justify-content-center">
              <h3>Carrinho:</h3>
            </div>

            <ul className="list">
              <div className="itemList">
                {this.state.productsInCart.map((product: any) => (
                  <li key={product._id} className="mb-4 me-2">
                    <div className="item d-flex justify-content-between">
                      <span className="itemName">{product.name}</span>

                      <button
                        onClick={() => {
                          this.removeFromCart(product._id);
                        }}
                        className="btn"
                      >
                        <i className="fa fa-trash" />
                      </button>
                    </div>

                    <div className="itemInfo">
                      <span>Preço = R$</span>
                      {product.sellPrice.toFixed(2).replace(".", ",")} *{" "}
                      <span className="quantity">Qtd = {product.qtd}</span>
                    </div>

                    <div className="itemPrices text-end me-1">
                      <span className="subtotal">Subtotal </span>= R$
                      <span className="totalValue">
                        {product.total.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <hr />
                  </li>
                ))}
              </div>
              <li className="data d-flex justify-content-between mt-2 col-12">
                <input
                  type="text"
                  onChange={this.handleClientChange}
                  id="clientInput"
                  className="selectClient col-3 ps-3 pe-3 mb-4"
                  list="clientList"
                  placeholder="Cliente:"
                />

                <datalist id="clientList">
                  {this.state.clients.map((client: any) => (
                    <option
                      id="clientId"
                      key={client._id}
                      value={client.name}
                    />
                  ))}
                </datalist>

                <select
                  onChange={this.handleStatusChange}
                  name="status"
                  id="statusSelect"
                  className="statusSelect col-3 ps-3 pe-3 mb-4"
                >
                  <option>Pagamento:</option>
                  <option value={0}>Pago</option>
                  <option value={1}>Comanda</option>
                  <option value={2}>Dividido</option>
                </select>

                <select
                  onChange={this.handleMethodChange}
                  name="method"
                  id="methodSelect"
                  className="methodSelect col-3 ps-3 pe-3 mb-4"
                >
                  <option>Metodo:</option>
                  <option value={0}>Dinheiro</option>
                  <option value={1}>Cartão</option>
                  <option value={2}>Pix</option>
                </select>
              </li>
              <li className="text-end">
                <span className="total">
                  Total = R$
                  {this.state.total.toFixed(2).replace(".", ",")}
                </span>
              </li>
            </ul>

            {this.state.productsInCart.length > 0 && (
              <div className="d-flex justify-content-center">
                <button onClick={this.addSale} className="btn btnAdd">
                  Finalizar Compra
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default AddSale;
