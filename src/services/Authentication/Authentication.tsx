const isAuthenticated = () => {
  const user = JSON.parse(localStorage.getItem("user")!);

  if (!user || !user.token) return false;

  return true;
};

export default isAuthenticated;
