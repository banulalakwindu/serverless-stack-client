import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormGroup, FormControl, FloatingLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import { s3Upload } from "../libs/awsLib";
import { API } from "aws-amplify";
import config from "../config";
import "./NewNote.css";

export default function NewNote() {
  const file = useRef(null);
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const attachment = file.current ? await s3Upload(file.current) : null;

      await createNote({ content, attachment });
      navigate("/serverless-stack-client/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createNote(note) {
    return API.post("notes", "/notes", {
      body: note,
    });
  }

  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit} className="mt-2">
        <FormGroup controlId="content">
          <FormControl
            value={content}
            as="textarea"
            rows={2}
            onChange={(e) => setContent(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="file" className="mt-2">
          <FloatingLabel>Attachment</FloatingLabel>
          <FormControl onChange={handleFileChange} type="file" />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          className="mt-4 w-100"
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </form>
    </div>
  );
}
