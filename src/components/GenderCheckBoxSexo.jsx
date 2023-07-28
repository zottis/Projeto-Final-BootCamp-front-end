import React, { useState } from 'react';
import { Form, Checkbox } from 'antd';

function GenderCheckbox({ label, onChange, required, ...others }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [changed, setChanged] = useState(null);

  const validateStatus = errorMessage ? 'error' : 'success';

  const handleValidation = (event) => {
    const { name, checked } = event.target;
    setChanged(true);
    let isValid = true;

    // Custom validation for the gender checkbox
    if (required && !checked) {
      setErrorMessage('Selecione o Sexo.');
      isValid = false;
    } else {
      setErrorMessage(null);
    }

    if (onChange) {
      onChange({
        name,
        input: {
          value: checked ? 'M' : 'F',
          valid: isValid,
        },
      });
    }
  };

  return (
    <Form.Item
      validateStatus={validateStatus}
      label={label}
      help={errorMessage}
      hasFeedback={changed}
      required={required}
    >
      <Checkbox
        {...others}
        required={required}
        onChange={handleValidation}
      >
        {label}
      </Checkbox>
    </Form.Item>
  );
}

export default GenderCheckbox;
