import { useNavigate } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";

function querystring(name, url = window.location.href) {
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default function UnauthenticatedRoute({ children, path }) {
  const { isAuthenticated } = useAppContext();
  const navigate = useNavigate();
  const redirect = querystring("redirect");

  if (isAuthenticated) {
    navigate(
      redirect === "" || redirect === null
        ? "/serverless-stack-client/"
        : redirect
    );
    return null;
  }

  return children;
}
