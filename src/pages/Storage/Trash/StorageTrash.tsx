import React from "react";
import { toast } from "react-hot-toast";

import isAuthenticated from "../../../services/Authentication/Authentication";
import isAuthorizated from "../../../services/Authorization/Authorization";

import {
  findDeletedProducts,
  findProduct,
  restoreProduct,
} from "../../../services/Api/Storage/StorageEndpoint";

import { nextPage, prevPage, goToPage } from "../../../helpers/helpers";

import Table from "../../../components/Table/Table";

import "./StorageTrash.scss";
import { Redirect } from "react-router";

class StorageTrash extends React.Component<any, any> {
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
          { field: "deletedAt", direction: "asc" },
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
          type: "currency",
          authorizated: true,
        },
        {
          head: "Preço Custo",
          field: "costPrice",
          type: "currency",
          authorizated: isAuthorizated(),
        },
      ],

      actions: [
        {
          class: "restore",
          icon: "fa fa-trash-can-arrow-up",
          func: this.restoreProduct,
        },
      ],

      redirectTo: null,
    };
  }

  componentDidMount(): void {
    if (!isAuthenticated()) {
      window.alert("Sessão Expirada. Por favor efetue o login novamente!");
      this.setState({ redirectTo: "/login" });
    }

    this.findDeletedProducts(this.state.query);
  }

  findDeletedProducts = async (query: any) => {
    await findDeletedProducts(query)
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
    await findProduct(productId)
      .then((res: any) => {
        this.setState({ product: res.data.product });
      })
      .catch((err: any) => {
        if (err.response.status === 401) {
          toast.error(err.response.data.message);

          this.setState({ redirectTo: "/login" });

          localStorage.removeItem("user");

          return;
        }

        this.setState({
          product: {},
        });

        return toast.error(err.response.data.message);
      });
  };

  restoreProduct = async (productId: string) => {
    const newProducts = this.state.products.filter(
      (product: any) => product._id !== productId
    );

    if (window.confirm("Realmente deseja restaurar esse produto?")) {
      await restoreProduct(productId)
        .then((res: any) => {
          toast.success(res.data.message);
          this.syncProductsAfterRestoring(newProducts);
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

    return;
  };

  syncProductsAfterRestoring = (newProducts: any) => {
    this.setState({ products: newProducts });
  };

  handleLimitChange = async (e: any) => {
    e.preventDefault();

    const query = { ...this.state.query };

    query.limit = e.target.value;
    query.page = 1;

    this.setState({ query: query });

    await this.findDeletedProducts(query);
  };

  goToPage = async (e: any) => {
    e.preventDefault();

    goToPage(this, this.findDeletedProducts, +e.target.textContent);
  };

  previousPage = async (e: any) => {
    e.preventDefault();

    prevPage(this, this.findDeletedProducts);
  };

  nextPage = async (e: any) => {
    e.preventDefault();

    nextPage(this, this.findDeletedProducts);
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <section className="container d-flex justify-content-center col-12">
        <div className="container d-flex align-items-center flex-column">
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

export default StorageTrash;
