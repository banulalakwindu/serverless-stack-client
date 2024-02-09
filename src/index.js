import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Amplify } from "aws-amplify";
import config from "./config";
import { BrowserRouter as Router } from "react-router-dom";

Amplify.configure({
  Auth: {
    // loginwith: null,
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: "notes",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ],
  },
});

const root = createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>
);
