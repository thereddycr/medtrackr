import React, { useState } from "react";

const ConfirmationModal = (props) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(100, 100, 100, 0.3)",
      }}
    >
      <div
        style={{
          width: "400px",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
          backgroundColor: "white",
        }}
      >
        <div style={{ fontSize: "18px" }}>
          Are you sure you want to continue with this action?
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <button
            className="btn btn-dark"
            style={{ height: "auto", width: "auto", marginRight: "1rem" }}
            onClick={props.handleClose}
          >
            Close
          </button>
          <button
            className="btn btn-dark"
            style={{ height: "auto", width: "auto", marginRight: "1rem" }}
            data-toggle="modal"
            data-target={props.toggleId}
            onClick={() => {
              props.action();
              props.handleClose();
            }}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
