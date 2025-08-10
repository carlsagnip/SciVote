import React from "react";
import PropTypes from "prop-types";
import "./ErrorBanner.css";

export default function ErrorBanner({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="error-banner rounded-md">
      <span>{message}</span>
      <button className="close-btn" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

ErrorBanner.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func,
};
