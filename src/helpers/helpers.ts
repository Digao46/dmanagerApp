export const handleChange = (classe: any, e: any) => {
  const inputName = e.target.name;
  const value = e.target.value;

  classe.setState({ [inputName]: value });
};
