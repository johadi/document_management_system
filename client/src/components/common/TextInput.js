import React, {PropTypes} from 'react';

const TextInput = (
  {type, name, label, onChange, icon, value, error, checkUserExists, clearError}) => {
  let wrapperClass = 'input-field col s12';
  if (error && error.length > 0) {
    wrapperClass += " red-text";
  }

  return (
    <div className={wrapperClass}>
      <i className="material-icons prefix">{icon}</i>
      <input
        type={type}
        name={name}
        className="validate"
        value={value}
        onChange={onChange}
        onBlur={checkUserExists}
        onFocus={clearError}
      />
      {error && <span className="red-text">
        <i className="material-icons">error_outline</i> {error}</span>}
      <label htmlFor={name}>{label}</label>
    </div>
  );
};

TextInput.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  value: PropTypes.string,
  error: PropTypes.string,
  checkUserExists: React.PropTypes.func,
  clearError: React.PropTypes.func
};

export default TextInput;
