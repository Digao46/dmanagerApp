import React from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  findCanMountProducts,
  addProduct,
} from "../../services/Api/Storage/StorageEndpoint";

import "./AddProduct.scss";

class AddProduct extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      productsQuery: {
        limit: 200,
        page: 1,
        orderBy: JSON.stringify([
          { field: "category", direction: "asc" },
          { field: "name", direction: "asc" },
        ]),
        where: {},
      },
      products: [],

      product: {},

      canMount: false,
      isMounted: false,

      item: {
        name: "",
        costPrice: 0,
        sellPrice: 0,
        storage: 0,
        category: "",
        use: [],
      },

      redirectTo: null,
    };
  }

  componentDidMount(): void {
    findCanMountProducts()
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

        return toast.error(err.response.data.message);
      });
  }

  handleIsMountedCheckChange = () => {
    let checkbox = document.getElementById(
      "isMountedCheck"
    ) as HTMLInputElement;

    if (checkbox.checked) {
      this.setState({ isMounted: true });
    } else {
      this.setState({ isMounted: false });
    }
  };

  handleCanMountCheckChange = () => {
    let checkbox = document.getElementById("canMountCheck") as HTMLInputElement;

    if (checkbox.checked) {
      this.setState({ canMount: true });
    } else {
      this.setState({ canMount: false });
    }
  };

  handleItemChange = (e: any) => {
    const item = { ...this.state.item };
    const field = e.target.name;

    item[field] = e.target.value;

    this.setState({ item: item });
  };

  handleUsedProdChange = (e: any) => {
    const productName = e.target.value;

    const productFound = this.state.products.find(
      (product: any) =>
        product.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") ===
        productName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
    );

    let newProduct: any;

    if (productFound)
      newProduct = {
        _id: productFound._id,
        name: productFound.name,
      };

    this.setState({ product: newProduct });
  };

  handleUsedProdQtdChange = (e: any) => {
    const product = { ...this.state.product };

    product.qtd = +e.target.value;

    this.setState({ product: product });
  };

  addUsedProduct = (e: any) => {
    e.preventDefault();

    const product = { ...this.state.product };

    const item = { ...this.state.item };

    if (!product._id) return toast.error("Produto não encontrado");

    item.use.push(product);

    const useInput = document.getElementById("use") as HTMLInputElement;
    const qtdInput = document.getElementById("qtd") as HTMLInputElement;

    useInput.value = "";
    qtdInput.value = "";

    this.setState({ item: item, product: {} });
  };

  removeProduct = (id: string) => {
    const item = { ...this.state.item };

    const useFiltered = item.use.filter((item: any) => item._id !== id);

    item.use = useFiltered;

    this.setState({ item: item });
  };

  addProduct = async (e: any) => {
    e.preventDefault();

    const product = { ...this.state.item };

    product.canMount = this.state.canMount;
    product.isMounted = this.state.isMounted;
    product.storage = +product.storage;
    product.costPrice = +product.costPrice;
    product.sellPrice = +product.sellPrice;

    addProduct(product)
      .then((res: any) => {
        toast.success(res.data.message);

        this.setState({ redirectTo: "/storage" });
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
      <section className="addSale container d-flex flex-column align-items-center">
        <div className="title d-flex justify-content-center align-items-center">
          <h1> Adicionar Produto </h1>
        </div>

        <div className="content container d-flex justify-content-center">
          <div className="productForm col-6">
            <form
              onSubmit={this.addProduct}
              className="d-flex justify-content-center col-12"
            >
              <div className="col-8">
                <input
                  type="text"
                  name="name"
                  className="nameInput col-12 ps-3 mb-4"
                  placeholder="Nome do produto"
                  onChange={this.handleItemChange}
                  autoFocus
                  required
                />

                <div className="d-flex col-12 mb-4">
                  <div className="input-group">
                    <span className="holder input-group-text">R$</span>
                    <input
                      type="text"
                      name="costPrice"
                      className="costPriceInput form-control col-12 ps-2"
                      placeholder="Preço Custo"
                      onChange={this.handleItemChange}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <span className="holder input-group-text">R$</span>
                    <input
                      type="text"
                      name="sellPrice"
                      className="sellPriceInput form-control col-12 ps-2"
                      placeholder="Preço Venda"
                      onChange={this.handleItemChange}
                      required
                    />
                  </div>
                </div>

                <input
                  id="storageInput"
                  name="storage"
                  className="storageInput col-12 ps-3 mb-4"
                  placeholder="Estoque"
                  onChange={this.handleItemChange}
                  required
                />

                <select
                  id="categoryInput"
                  name="category"
                  className="categoryInput col-12 ps-3 mb-4"
                  onChange={this.handleItemChange}
                >
                  <option>Categoria:</option>
                  <option value={"Cervejas"}>Cervejas</option>
                  <option value={"Combos"}>Combos</option>
                  <option value={"Comidas"}>Comidas</option>
                  <option value={"Doses/Drinks"}>Doses/Drinks</option>
                  <option value={"Garrafas"}>Garrafas</option>
                  <option value={"Refrigerantes"}>Refrigerantes</option>
                  <option value={"Tabaco"}>Tabaco</option>
                  <option value={"Outros"}>Outros</option>
                </select>

                <div className="canMountArea d-flex align-items-center justify-content-center">
                  <input
                    type="checkbox"
                    id="canMountCheck"
                    onChange={this.handleCanMountCheckChange}
                  />
                  <label htmlFor="canMountCheck" className="ms-2">
                    Pode montar outros produtos
                  </label>
                </div>

                <div className="canMountArea d-flex align-items-center justify-content-center">
                  <input
                    type="checkbox"
                    id="isMountedCheck"
                    onChange={this.handleIsMountedCheckChange}
                  />
                  <label htmlFor="isMountedCheck" className="ms-2">
                    Adicionar produtos
                  </label>
                </div>

                {this.state.isMounted && (
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <input
                      className="col-6 ps-2"
                      id="use"
                      type="text"
                      name="use"
                      placeholder="Selecione o produto:"
                      onChange={this.handleUsedProdChange}
                      list="productsList"
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

                    <input
                      className="col-2 ps-2"
                      id="qtd"
                      type="number"
                      min={1}
                      name="qtd"
                      placeholder="Qtd:"
                      onChange={this.handleUsedProdQtdChange}
                    />

                    <button
                      type="button"
                      className="btn btnAdd col-2"
                      onClick={this.addUsedProduct}
                    >
                      Add
                    </button>
                  </div>
                )}

                {this.state.isMounted && (
                  <div className="d-flex align-items-center justify-content-center col-12">
                    <h5>Produtos usados:</h5>
                  </div>
                )}

                {this.state.item.use?.map((product: any) => (
                  <div className="col-12 d-flex flex-column justify-content-center aling-itens-center">
                    <span className="itemsLists d-flex justify-content-center col-12">
                      {product.name} - qtd: {product.qtd}
                      <i
                        className="deleteButton d-flex justify-content-center align-items-center fa fa-trash col-2 ms-4 py-0"
                        onClick={() => this.removeProduct(product._id)}
                      />
                    </span>
                    <hr className="separatorLine col-12" />
                  </div>
                ))}

                <div className="btns d-flex justify-content-center mb-4">
                  <button type="submit" className="btn btnAdd col-4 me-2">
                    Adicionar
                  </button>
                  <Link to="/storage" className="btn btnCancel col-4 me-2">
                    Cancelar
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
}

export default AddProduct;
