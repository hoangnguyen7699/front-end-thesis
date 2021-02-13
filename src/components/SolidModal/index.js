import FoldersTree from "../FoldersTree";
import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import Modal from "react-modal";
import Alert from "@material-ui/lab/Alert";
import { CircularProgress, Snackbar } from "@material-ui/core";
import { getFoldersForUrl } from "../../utils/utils";
import "./index.css";
const auth = require("solid-auth-client");
const FC = require("solid-file-client");
const fc = new FC(auth);

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export function SolidModal(props) {
  const [foldersTree, setFoldersTree] = useState();
  const [url, setUrl] = useState();
  const [open, setOpen] = useState();
  const [isError, setError] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");

  const updateFoldersTreeForUrl = async (url) => {
    const folder = await getFoldersForUrl(url);
    setFoldersTree(folder);
  };
  useEffect(() => {
    updateFoldersTreeForUrl(props.rootUrl);
    console.log(props.type);
    setMessage(
      `You should choose a ${props.type === "file" ? "file" : "folder!"}`
    );
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <div>
      <Modal
        ariaHideApp={false}
        style={customStyles}
        isOpen={props.isModalOpen}
        onRequestClose={() => props.modalClose()}
      >
        <div className="solid-modal">
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            open={snackBarOpen}
            autoHideDuration={2000}
            onClose={() => setSnackBarOpen(false)}
          >
            <Alert severity={isError && isError ? "error" : "success"}>
              {message}
            </Alert>
          </Snackbar>
          <div className="solid-modal-tree">
            <FoldersTree
              foldersTreeItems={foldersTree}
              onSelectNode={(event, url) => {
                setUrl(url);
              }}
            />
          </div>
          <Button
            className="solid-button-confirm"
            variant="contained"
            color="secondary"
            maxW
            onClick={async () => {
              if (!url) {
                setError(true);
                setSnackBarOpen(true);
                return;
              }

              const res = await fc.head(url);
              const type =
                res.url.charAt(res.url.length - 1) === "/" ? "folder" : "file";

              if (props.type !== type) {
                setError(true);
                setSnackBarOpen(true);
                return;
              }

              setOpen(true);
              props.modalConfirm(url);
              updateFoldersTreeForUrl(props.rootUrl).then(() => {
                setOpen(false);
                setError(false);
                setMessage("Success");
                setSnackBarOpen(true);
              });
            }}
          >
            {open ? <CircularProgress color="inherit" /> : "CONFIRM"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
