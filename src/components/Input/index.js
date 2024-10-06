import React from 'react'
import './style.css'
const Input = ({ label, name, value, onChange, error, placeholder, type = "number" }) => {
    return (
      <div className="input-field">
        <label>{label}</label>
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
        {error && <p className="error">{error}</p>}
      </div>
    );
  };

export default Input