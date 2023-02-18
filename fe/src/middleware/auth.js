import api from "@/services/api";

export default async function checkAuth(to, from, next) {
  const token = localStorage.getItem("token");
  if (!token) {
    return next("/login");
  }

  try {
    await api({
      headers: { Authorization: token },
    }).get("/user/info");
  } catch (error) {
    return next("/login");
  }

  return next();
}
