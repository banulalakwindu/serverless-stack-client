import React, { useState } from "react";
import { FormGroup, FormControl, FloatingLabel } from "react-bootstrap";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import LoaderButton from "./LoaderButton";
import { useFormFields } from "../libs/hookLib";
import "./BillingForm.css";

function BillingForm({ isLoading, onSubmit }) {
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    storage: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  isLoading = isProcessing || isLoading;

  function validateForm() {
    return fields.name !== "" && fields.storage !== "" && isCardComplete;
  }

  async function handleSubmitClick(event) {
    event.preventDefault();

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    const { token, error } = await stripe.createToken(cardElement, {
      name: fields.name,
    });

    setIsProcessing(false);

    onSubmit(fields.storage, { token, error });
  }

  return (
    <form className="BillingForm" onSubmit={handleSubmitClick}>
      <FormGroup bsSize="large" controlId="storage">
        <FloatingLabel className="mb-1">Storage</FloatingLabel>
        <FormControl
          min="0"
          type="number"
          value={fields.storage}
          onChange={handleFieldChange}
          placeholder="Number of notes to store"
        />
      </FormGroup>
      <hr />
      <FormGroup bsSize="large" controlId="name">
        <FloatingLabel className="mt-3 mb-1">Cardholder's name</FloatingLabel>
        <FormControl
          type="text"
          value={fields.name}
          onChange={handleFieldChange}
          placeholder="Name on the card"
        />
      </FormGroup>
      <FloatingLabel className="mt-3 mb-1">Credit Card Info</FloatingLabel>
      <CardElement
        className="card-field"
        onChange={(e) => setIsCardComplete(e.complete)}
        style={{
          base: { fontSize: "18px", fontFamily: '"Open Sans", sans-serif' },
        }}
      />
      <LoaderButton
        block
        type="submit"
        bsSize="large"
        isLoading={isLoading}
        disabled={!validateForm()}
      >
        Purchase
      </LoaderButton>
    </form>
  );
}

export default BillingForm;
