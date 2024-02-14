import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem, Spinner } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { LinkContainer } from "react-router-bootstrap";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify";
import "./Home.css";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  function renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <LinkContainer
          key={note.noteId}
          to={`/serverless-stack-client/notes/${note.noteId}`}
        >
          <ListGroupItem>
            <h6>
              <b>{note.content.trim().split("\n")[0]}</b>
            </h6>
            <small>Created: {new Date(note.createdAt).toLocaleString()}</small>
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/serverless-stack-client/notes/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new note
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadNotes() {
    return API.get("notes", "/notes");
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes mt-4">
        <h1>Your Notes</h1>
        {isLoading ? (
              <Spinner glyph="refresh" className="spinning" />
          ) : (
            ""
          )}
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
