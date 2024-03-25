import React from 'react';

const PopupModal = ({ imageSrc, altText, description, onClose }) => {
  return (
    <div className="popup-modal">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <img src={imageSrc} alt={altText} className="popup-image" />
        <p>{description}</p>
      </div>
    </div>
  );
};

export default PopupModal;
