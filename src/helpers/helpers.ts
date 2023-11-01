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

export const prevPage = async (classe: any, func: Function, param?: any) => {
  const query = { ...classe.state.query };

  query.page = query.page - 1;

  classe.setState({ query: query });

  if (param) {
    return await func(param, query);
  }

  await func(query);
};

export const nextPage = async (classe: any, func: Function, param?: any) => {
  const query = { ...classe.state.query };

  query.page = query.page + 1;

  classe.setState({ query: query });

  if (param) {
    return await func(param, query);
  }

  await func(query);
};

export const goToPage = async (
  classe: any,
  func: Function,
  desiredPage: number,
  param?: any
) => {
  const query = { ...classe.state.query };

  query.page = desiredPage;

  classe.setState({ query: query });

  if (param) {
    return await func(param, query);
  }

  await func(query);
};

export const checkObjectsEquality = (
  object1: any,
  object2: any,
  fields: string[]
) => {
  let equal: boolean = true;

  if (object1.length !== object2.length) {
    return false;
  }

  for (let i = 0; i < object1.length; i++) {
    const element1 = object1[i];
    const element2 = object2[i];

    fields.forEach((field: string) => {
      if (element1[field] !== element2[field] && equal) {
        equal = false;
      }
    });
  }

  return equal;
};
