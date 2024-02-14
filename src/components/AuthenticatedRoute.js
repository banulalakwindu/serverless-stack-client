import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";
import { useEffect } from "react";

export default function AuthenticatedRoute({ children }) {
  const { isAuthenticated } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(
        `/serverless-stack-client/login?redirect=${location.pathname}${location.search}`
      );
    }
  }, [isAuthenticated, navigate, location]);

  return isAuthenticated ? children : null;
}
