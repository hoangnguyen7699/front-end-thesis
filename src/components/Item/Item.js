import "./Item.css";
import React, { useState } from "react";
import { Controlled as ControlledZoom } from "react-medium-image-zoom";
import Modal from "react-modal";
import { Input, InputLabel, InputAdornment } from "@material-ui/core";
import "react-medium-image-zoom/dist/styles.css";
import { Button } from "@material-ui/core";

import { IconButton, CircularProgress } from "@material-ui/core";
import { RemoveCircle, BorderColor } from "@material-ui/icons";

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
export default function Item(props) {
  const [url, setUrl] = useState(null);
  const [isZoom, setZoom] = useState(false);
  const [imageName, setImageName] = useState("");
  const [modalFileName, setModalFileName] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);

  var file = props.file;

  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function (e) {
    setUrl(reader.result);
    setImageName(file.name);
  };

  const renameFile = (name) => {
    Object.defineProperty(file, "name", {
      writable: true,
      value: name,
    });
    Object.defineProperty(file, "originalname", {
      writable: true,
      value: name,
    });
    console.log(file);
    setImageName(name);
    setModalFileName(name);
    setIsOpenModal(false);
  };

  return url !== null ? (
    <div className="u-item">
      <Modal
        style={customStyles}
        ariaHideApp={false}
        isOpen={isOpenModal}
        onRequestClose={() => {
          setModalFileName(imageName);
          setIsOpenModal(false);
        }}
      >
        <InputLabel className="nav-e" htmlFor="modalFileName">
          Name
        </InputLabel>

        <Input
          id="modalFileName"
          className="nav-e"
          style={{ width: "200px" }}
          value={modalFileName}
          onChange={(d) => {
            setModalFileName(d.target.value);
          }}
          aria-describedby="standard-weight-helper-text"
          inputProps={{
            "aria-label": "Name",
          }}
        />
        <Button
          className="nav-name"
          variant="contained"
          color="secondary"
          onClick={() => renameFile(modalFileName)}
        >
          Save
        </Button>
      </Modal>
      <div className="u-edit">
        {props.editName === true ? (
          <div className="u-edit-button">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={() => {
                setModalFileName(imageName);
                setIsOpenModal(true);
              }}
            >
              <BorderColor />
            </IconButton>
          </div>
        ) : (
          <div />
        )}
        {props.delete ? (
          <div className="u-edit-button">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={() => props.onDelete()}
            >
              <RemoveCircle />
            </IconButton>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      {/* ) : (
        <div></div>
      )} */}
      {/* <div className="u-edit">
        
      </div> */}
      <div>
        <ControlledZoom
          isZoomed={isZoom}
          onZoomChange={(zoom) => setZoom(zoom)}
        >
          {/* ${isZoom ? 'u-img-zoom' : '' */}
          <div className="u-zoom">
            <img className="u-img" alt="" src={url}></img>
            <div className="u-title">Name: {imageName}</div>
            {file.detection ? (
              <div className="u-title">{file.detection}</div>
            ) : (
              <div />
            )}
          </div>
        </ControlledZoom>
      </div>
    </div>
  ) : (
    <div className="progress">
      <CircularProgress size="100px" color="secondary" />
    </div>
  );
}
