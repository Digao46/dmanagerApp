import React from "react";

import isAuthorizated from "../../services/Authorization/Authorization";

import "./Table.scss";

class Table extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  renderPages = () => {
    const elements: JSX.Element[] = [];

    const currentPage = this.props.state.query.page;
    const totalPages = this.props.state.totalPages;
    const pagesToShow = 5;

    let startPage = Math.max(currentPage - 1, 1);
    let endPage = Math.min(startPage + pagesToShow - 1, totalPages);

    startPage = Math.max(endPage - pagesToShow + 1, 1);

    for (let page = startPage; page <= endPage; page++) {
      const element = (
        <li className="page-item" key={page} onClick={this.props.goToPage}>
          <span className={`page-link ${page === currentPage ? "active" : ""}`}>
            {page}
          </span>
        </li>
      );

      elements.push(element);
    }

    return elements;
  };

  verifyType = (data: any, tData: any) => {
    if (typeof data[tData.field] == "boolean") {
      return data[tData.field] ? "Sim" : "Não";
    }

    if (typeof data[tData.field] == "number") {
      if (tData.type == "currency") {
        return data[tData.field].toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      }

      return data[tData.field] + " uni";
    }

    if (typeof data[tData.field] == "string") {
      if (tData.type == "date") {
        const date = new Date(data[tData.field]);

        const newDate = `
        ${date.getDay() < 10 ? "0" + date.getDay() : date.getDay()}
        /
        ${date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()}
        /
        ${date.getFullYear()}`;

        return newDate;
      }

      if (tData.type == "phone") {
        const number = data[tData.field].replace(/\D/g, "");

        if (number.length === 9) {
          return `${number.substring(0, 5)}-${number.substring(5)}`;
        } else if (number.length === 11) {
          return `(${number.substring(0, 2)}) ${number.substring(
            2,
            7
          )}-${number.substring(7)}`;
        } else {
          return "Telefone inválido";
        }
      }
    }

    return data[tData.field];
  };

  render() {
    return (
      <table className="table-bordered col-10">
        <thead className="text-center">
          <tr>
            {this.props.content.map(
              (th: any, key: any) =>
                th.authorizated && (
                  <th key={key} scope="col">
                    {th.head}
                  </th>
                )
            )}

            {isAuthorizated() && <th>Ações</th>}
          </tr>
        </thead>

        <tbody className="text-center">
          {this.props.data.map((data: any) => (
            <tr key={data._id}>
              {this.props.content.map(
                (td: any, key: any) =>
                  td.authorizated && (
                    <td key={key} scope="col">
                      {this.verifyType(data, td)}
                    </td>
                  )
              )}

              {isAuthorizated() && (
                <td scope="col">
                  <div className="d-flex justify-content-center">
                    {this.props.actions.map((action: any, key: any) => (
                      <button
                        key={key}
                        className="btn"
                        onClick={() => {
                          action.func(data._id);
                        }}
                      >
                        <i className={`${action.class} ${action.icon}`} />
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>

        <tfoot className="text-center">
          <tr>
            <td className="pagination col-12">
              <div className="perPage d-flex justify-content-center align-itens-center col-8">
                <span className="d-flex flex-column justify-content-center align-itens-center col-5 mx-1">
                  Produtos por página:
                </span>
                <div className="selArea d-flex flex-column justify-content-center align-itens-center col-4 mx-1">
                  <select
                    className="text-center"
                    value={this.props.state.query.limit}
                    onChange={this.props.handleLimitChange}
                  >
                    {this.props.state.perPage.map(
                      (option: number, index: number) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="prevNext d-flex justify-content-center align-items-center col-8">
                <nav className="d-flex align-items-center justify-content-center">
                  <ul className="pagination d-flex justify-content-center align-items-center">
                    {this.props.state.query.page > 1 ? (
                      <li className="page-item">
                        <span
                          className="page-link"
                          onClick={this.props.previousPage}
                        >
                          &lt;
                        </span>
                      </li>
                    ) : (
                      <li className="page-item disabled">
                        <span className="page-link">&lt;</span>
                      </li>
                    )}

                    {this.renderPages()}

                    {this.props.state.query.page <
                    this.props.state.totalPages ? (
                      <li className="page-item">
                        <span
                          className="page-link"
                          onClick={this.props.nextPage}
                        >
                          &gt;
                        </span>
                      </li>
                    ) : (
                      <li className="page-item disabled">
                        <span className="page-link">&gt;</span>
                      </li>
                    )}
                  </ul>
                </nav>
              </div>

              <div className="totalPages d-flex justify-content-start align-items-center col-4">
                {`${
                  this.props.state.query.limit * this.props.state.query.page >
                  this.props.state.totalDocs
                    ? this.props.state.totalDocs
                    : this.props.state.query.limit * this.props.state.query.page
                } de ${this.props.state.totalDocs ?? 0} | (Pág ${
                  this.props.state.query.page
                } de ${this.props.state.totalPages})`}
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }
}

export default Table;
