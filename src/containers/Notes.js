import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { Form, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { s3Upload } from "../libs/awsLib";
import config from "../config";
import "./Notes.css";

export default function Notes() {
  const file = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadNote() {
      return API.get("notes", `/notes/${id}`);
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return content.length > 0;
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  function saveNote(note) {
    return API.put("notes", `/notes/${id}`, {
      body: note,
    });
  }

  async function handleSubmit(event) {
    let attachment;

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
      if (file.current) {
        attachment = await s3Upload(file.current);
      }

      await saveNote({
        content,
        attachment: attachment || note.attachment,
      });
      navigate("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteNote() {
    return API.del("notes", `/notes/${id}`);
  }

  async function handleDelete(event) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteNote();
      navigate("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  function isImageAttachment(attachment) {
    // List of common image file extensions
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];

    // Get the file extension from the attachment name
    const fileExtension = attachment.split(".").pop().toLowerCase();

    // Check if the file extension is in the list of image extensions
    return imageExtensions.includes(fileExtension);
  }

  return (
    <div className="Notes">
      {note && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <FormControl
              as="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mb-4"
            />
          </Form.Group>
          {note.attachment && (
            <Form.Group className="d-flex flex-column mb-3">
              <Form.Label className="mb-2">Attachment</Form.Label>
              {isImageAttachment(note.attachment) ? (
                // Show image preview if the attachment is an image
                <img
                  src={note.attachmentURL}
                  alt={formatFilename(note.attachment)}
                  style={{ maxWidth: "200px", height: "auto" }}
                />
              ) : (
                // Display a link for non-image attachments
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={note.attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              )}
            </Form.Group>
          )}
          <Form.Group controlId="file" className="mb-3">
            {!note.attachment && <Form.Label>Attachment</Form.Label>}
            <FormControl onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
            className="me-4"
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  );
}
