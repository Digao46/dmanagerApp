import React from "react";

import isAuthorizated from "../../services/Authorization/Authorization";

import "./Table.scss";

class Table extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  renderPages = () => {
    const elements: any[] = [];

    const currentPage = this.props.state.query.page;
    const totalPages = this.props.state.totalPages;

    for (let group = 0; group < Math.ceil(totalPages / 3); group++) {
      const pageGroupStart = group * 3 + 1;
      const pageGroupEnd = Math.min(pageGroupStart + 2, totalPages);

      for (let page = pageGroupStart; page <= pageGroupEnd; page++) {
        let element: JSX.Element;

        if (page === currentPage) {
          element = (
            <li className="page-item" key={page}>
              <span className="page-link active">{currentPage}</span>
            </li>
          );
        } else {
          element = (
            <li className="page-item" key={page} onClick={this.props.goToPage}>
              <span className="page-link">{page}</span>
            </li>
          );
        }

        elements.push(element);
      }
    }
    return elements;
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

            <th>Ações</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {this.props.data.map((data: any) => (
            <tr key={data._id}>
              {this.props.content.map(
                (td: any, key: any) =>
                  td.authorizated && (
                    <td key={key} scope="col">
                      {
                        //   Verificando se é boolean
                        typeof data[td.field] == "boolean"
                          ? //   Verificando o resultado do dado para mostrar "Sim" ou "Não"
                            data[td.field]
                            ? "Sim"
                            : "Não"
                          : //   Verificando se é number
                          typeof data[td.field] == "number"
                          ? //   Verificando se existe flag para adicionar antes do dado
                            td.flag
                            ? td.flag +
                              data[td.field].toFixed(2).replace(".", ",")
                            : data[td.field] + " uni"
                          : //   Caso não seja nenhum desses, ele simplesmente imprime o dado
                            data[td.field]
                      }
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
                        onClick={() => {action.func(data._id)}}
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
              <div className="perPage d-flex justify-content-center align-itens-center col-12">
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

              <div className="prevNext d-flex justify-content-center align-items-center col-12">
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
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }
}

export default Table;
