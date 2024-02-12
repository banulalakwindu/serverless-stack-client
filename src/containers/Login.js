import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormGroup, FormControl, FloatingLabel } from "react-bootstrap";
import "./Login.css";
import { Auth } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import { useFormFields } from "../libs/hookLib";

export default function Login() {
  const navigate = useNavigate();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      navigate("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <FloatingLabel>Email</FloatingLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup className="mt-2" controlId="password" bsSize="large">
          <FloatingLabel>Password</FloatingLabel>
          <FormControl
            value={fields.password}
            onChange={handleFieldChange}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          className="mt-4 w-100"
          block
          bsSize="large"
          disabled={!validateForm()}
          isLoading={isLoading}
          type="submit"
        >
          {!isLoading ? "Login" : ""}
        </LoaderButton>
      </form>
    </div>
  );
}
