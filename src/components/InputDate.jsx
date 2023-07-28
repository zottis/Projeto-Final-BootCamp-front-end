import React, { useState, useEffect } from 'react';
import { Form } from 'antd';

function InputDate({ label, onChange, required, initialDate, ...others }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [changed, setChanged] = useState(null);

  const [selectedDate, setSelectedDate] = useState(initialDate || '');

  const validateStatus = errorMessage ? 'error' : 'success';

  useEffect(() => {
    setSelectedDate(initialDate || '');
  }, [initialDate]);
  
  
  const handleValidation = (event) => {
    const { name, value } = event.target;
    setChanged(true);
    let isValid = true;

    // Custom validation for the date input
    if (required && !value) {
      setErrorMessage('selecione a data.');
      isValid = false;
    } else {
      setErrorMessage(null);
    }

    if (onChange) {
      onChange({
        name,
        input: {
          value,
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
      <input
        type="date"
        value={selectedDate.slice(0, 10)}
        {...others}
        required={required}
        onChange={(e) => {
          setSelectedDate(e.target.value);
          handleValidation(e);
        }}
      />
    </Form.Item>
  );
}

export default InputDate;
