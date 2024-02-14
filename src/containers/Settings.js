import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { API } from "aws-amplify";
import BillingForm from "../components/BillingForm";
import { onError } from "../libs/errorLib";
import config from "../config";
import "./Settings.css";

export default function Settings() {
  const [, setStripe] = useState(null);

  useEffect(() => {
    setStripe(window.Stripe(config.STRIPE_KEY));
  }, []);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  function billUser(details) {
    return API.post("notes", "/billing", {
      body: details,
    });
  }

  async function handleFormSubmit(storage, { token, error }) {
    if (error) {
      onError(error);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({
        storage,
        source: token.id,
      });

      alert("Your card has been charged successfully!");
      navigate("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  const stripePromise = loadStripe(config.STRIPE_KEY);

  return (
    <div className="Settings">
      <Elements stripe={stripePromise}>
        <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
      </Elements>
    </div>
  );
}
