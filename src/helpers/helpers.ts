export const handleChange = (classe: any, e: any) => {
  const inputName = e.target.name;
  const value = e.target.value;

  classe.setState({ [inputName]: value });
};

export const filter = async (
  classe: any,
  field: string,
  conditions: any[],
  func: Function
) => {
  const whereQuery = { ...classe.state.query };

  whereQuery.where = JSON.stringify({
    field: field,
    conditions: conditions,
  });

  whereQuery.page = 1;

  classe.setState({ query: whereQuery });

  return await func(whereQuery);
};
