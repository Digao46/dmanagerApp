import React from "react";
import { toast } from "react-hot-toast";

import isAuthenticated from "../../services/Authentication/Authentication";
import isAuthorizated from "../../services/Authorization/Authorization";
import {
  findProducts,
  findProduct,
  findProductsByName,
  deleteProduct,
} from "../../services/Api/Storage/StorageEndpoint";

import {
  nextPage,
  prevPage,
  goToPage,
  handleChange,
} from "../../helpers/helpers";

import Table from "../../components/Table/Table";

import "./Storage.scss";
import { Redirect } from "react-router";

class Storage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      // pagination
      perPage: [12, 25, 50, 100, 200],
      totalPages: 0,
      query: {
        limit: 12,
        page: 1,
        orderBy: JSON.stringify([
          { field: "category", direction: "asc" },
          { field: "name", direction: "asc" },
        ]),
        where: JSON.stringify({}),
      },

      products: [],
      product: {},
      productName: "",

      content: [
        { head: "Produto", field: "name", authorizated: true },
        { head: "Categoria", field: "category", authorizated: true },
        { head: "Estoque", field: "storage", authorizated: true },
        { head: "Montado", field: "isMounted", authorizated: true },
        {
          head: "Preço Venda",
          field: "sellPrice",
          flag: "R$",
          authorizated: true,
        },
        {
          head: "Preço Custo",
          field: "costPrice",
          flag: "R$",
          authorizated: isAuthorizated(),
        },
      ],

      actions: [
        {
          class: "edit",
          icon: "fa fa-edit",
          func: this.findProduct,
          linkTo: "edit",
        },
        {
          class: "delete",
          icon: "fa fa-trash-can",
          func: this.deleteProduct,
        },
      ],

      isFiltered: false,

      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      window.alert("Sessão Expirada. Por favor efetue o login novamente!");
      this.setState({ redirectTo: "/login" });
    }

    this.findProducts(this.state.query);
  }

  findProducts = async (query: any) => {
    await findProducts(query)
      .then((res) => {
        let pages = Math.ceil(res.data.data.documents.qtd / query.limit);

        this.setState({
          products: res.data.data.products,
          totalPages: pages,
        });
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        }

        this.setState({
          products: [],
          totalPages: 1,
        });

        return toast.error(err.response.data.message);
      });
  };

  findProduct = async (productId: string) => {
    await findProduct(productId).then((res: any) => {
      localStorage.setItem("product", JSON.stringify(res.data.product));

      this.setState({ product: res.data.product, redirectTo: "/storage/edit" });
    });
  };

  findProductsByName = async (productName: any, query: any, e?: any) => {
    if (e) e.preventDefault();

    const newQuery = { ...query };
    newQuery.page = 1;

    await findProductsByName(productName, newQuery)
      .then((res) => {
        let pages = Math.ceil(res.data.data.documents.qtd / query.limit);

        this.setState({
          products: res.data.data.products,
          totalPages: pages,
          query: newQuery,
          isFiltered: true,
        });
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        }

        this.setState({
          products: [],
          totalPages: 1,
        });

        return toast.error(err.response.data.message);
      });
  };

  deleteProduct = async (productId: string) => {
    const newProducts = this.state.products.filter(
      (product: any) => product._id !== productId
    );

    if (window.confirm("Realmente deseja excluir esse produto?")) {
      await deleteProduct(productId).then((res: any) => {
        toast.success(res.data.message);
      });

      this.syncProductsAfterDeleting(newProducts);
    }

    return;
  };

  syncProductsAfterDeleting = (newProducts: any) => {
    this.setState({ products: newProducts });
  };

  handleChange = async (e: any) => {
    if (this.state.isFiltered) {
      await this.findProducts(this.state.query);
      this.setState({ isFiltered: false });
    }

    handleChange(this, e);
  };

  handleLimitChange = async (e: any) => {
    e.preventDefault();

    const query = { ...this.state.query };

    query.limit = e.target.value;
    query.page = 1;

    this.setState({ query: query });

    if (this.state.isFiltered) {
      this.findProductsByName(this.state.productName, this.state.query, e);
    } else {
      await this.findProducts(query);
    }
  };

  goToPage = async (e: any) => {
    e.preventDefault();

    if (this.state.isFiltered) {
      goToPage(
        this,
        this.findProductsByName,
        +e.target.textContent,
        this.state.productName
      );
    } else {
      goToPage(this, this.findProducts, +e.target.textContent);
    }
  };

  previousPage = async (e: any) => {
    e.preventDefault();
    if (this.state.isFiltered) {
      prevPage(this, this.findProductsByName, this.state.productName);
    } else {
      prevPage(this, this.findProducts);
    }
  };

  nextPage = async (e: any) => {
    e.preventDefault();

    if (this.state.isFiltered) {
      nextPage(this, this.findProductsByName, this.state.productName);
    } else {
      nextPage(this, this.findProducts);
    }
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="container d-flex justify-content-center col-12">
        <div className="container d-flex align-items-center flex-column">
          <div className="formProductArea container d-flex justify-content-center align-items-center mb-2">
            <form
              className="d-flex justify-content-center align-itens-center"
              onSubmit={(e) =>
                this.findProductsByName(
                  this.state.productName,
                  this.state.query,
                  e
                )
              }
            >
              <input
                type="text"
                onChange={this.handleChange}
                name="productName"
                id="productInput"
                className="selectProduct col-6 me-2 px-4 py-1"
                placeholder="Pesquisar produto"
                required
              />

              <button
                type="submit"
                className="btn col-1 d-flex justify-content-center align-items-center"
              >
                <i className="fa fa-search" />
              </button>
            </form>
          </div>

          <div className="tableArea d-flex justify-content-center align-items-center my-2 col-12">
            <Table
              content={this.state.content}
              data={this.state.products}
              actions={this.state.actions}
              previousPage={this.previousPage}
              nextPage={this.nextPage}
              goToPage={this.goToPage}
              handleLimitChange={this.handleLimitChange}
              state={this.state}
            />
          </div>
        </div>
      </section>
    );
  }
}

export default Storage;
