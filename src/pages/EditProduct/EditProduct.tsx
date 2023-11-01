import React from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-hot-toast";

import { checkObjectsEquality } from "../../helpers/helpers";

import {
  findCanMountProducts,
  editProduct,
} from "../../services/Api/Storage/StorageEndpoint";

import "./EditProduct.scss";

class EditProduct extends React.Component<any, any> {
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

      item: {},

      canMount: false,
      isMounted: false,

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

    const product = JSON.parse(localStorage.getItem("product")!);

    this.handleIsMountedCheckChange("", product.isMounted);
    this.handleCanMountCheckChange("", product.canMount);

    this.setState({ item: product });
  }

  handleIsMountedCheckChange = (e?: any, state?: any) => {
    let checkbox = document.getElementById(
      "isMountedCheck"
    ) as HTMLInputElement;

    if (state) {
      checkbox.checked = state;
      this.setState({ isMounted: state });
      return;
    }

    if (checkbox.checked) {
      this.setState({ isMounted: true });
    } else {
      this.setState({ isMounted: false });
    }
  };

  handleCanMountCheckChange = (e?: any, state?: any) => {
    let checkbox = document.getElementById("canMountCheck") as HTMLInputElement;

    if (state) {
      checkbox.checked = true;
      return this.setState({ canMount: true });
    }

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

  editProduct = async (e: any, id: any) => {
    e.preventDefault();

    const item = { ...this.state.item };
    const baseItem = JSON.parse(localStorage.getItem("product")!);

    item.canMount = this.state.canMount;
    item.isMounted = this.state.isMounted;

    if (!item.isMounted) item.use = [];

    delete item.updatedAt;
    delete item.createdAt;
    delete item.deletedAt;
    delete item._id;

    if (item.name == baseItem.name) delete item.name;
    if (item.sellPrice == baseItem.sellPrice) delete item.sellPrice;
    if (item.costPrice == baseItem.costPrice) delete item.costPrice;
    if (item.category == baseItem.category) delete item.category;
    if (item.canMount == baseItem.canMount) delete item.canMount;
    if (item.isMounted == baseItem.isMounted) delete item.isMounted;
    if (item.storage == baseItem.storage) delete item.storage;

    if (checkObjectsEquality(item.use, baseItem.use, ["_id", "name", "qtd"]))
      delete item.use;

    if (Object.keys(item).length <= 0)
      return toast.error("Nenhuma alteração identificada!");

    editProduct(id, item)
      .then((res: any) => {
        toast.success(res.data.message);

        localStorage.removeItem("product");
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
              onSubmit={(e: any) => this.editProduct(e, this.state.item._id)}
              className="d-flex justify-content-center col-12"
            >
              <div className="col-8">
                <input
                  type="text"
                  name="name"
                  className="nameInput col-12 ps-3 mb-4"
                  placeholder="Nome do produto"
                  onChange={this.handleItemChange}
                  value={this.state.item.name ?? ""}
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
                      value={this.state.item.costPrice ?? ""}
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
                      value={this.state.item.sellPrice ?? ""}
                    />
                  </div>
                </div>
                <input
                  id="storageInput"
                  name="storage"
                  className="storageInput col-12 ps-3 mb-4"
                  placeholder="Estoque"
                  onChange={this.handleItemChange}
                  value={this.state.item.storage ?? ""}
                />
                <select
                  id="categoryInput"
                  name="category"
                  className="categoryInput col-12 ps-3 mb-4"
                  onChange={this.handleItemChange}
                  value={this.state.item.category ?? ""}
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

                {this.state.isMounted &&
                  this.state.item.use?.map((product: any) => (
                    <div
                      key={product._id}
                      className="col-12 d-flex flex-column justify-content-center aling-itens-center"
                    >
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
                    Atualizar
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

export default EditProduct;
