const isAuthorizated = () => {
  const user = JSON.parse(localStorage.getItem("user")!);

  if (!user) return false;

  return user.isAdmin;
};

export default isAuthorizated;
