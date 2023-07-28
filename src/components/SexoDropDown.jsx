import React, { useState } from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;

function SexoDropdown({ label, onChange, required, ...others }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [changed, setChanged] = useState(null);

  const validateStatus = errorMessage ? 'error' : 'success';

  const handleValidation = (value) => {
    setChanged(true);
    let isValid = true;

    // Custom validation for the gender dropdown
    if (required && !value) {
      setErrorMessage('Selecione o SEXO.');
      isValid = false;
    } else {
      setErrorMessage(null);
    }

    if (onChange) {
      onChange({
        name: 'sexo',
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
      <Select
        {...others}
        required={required}
        onChange={handleValidation}
        placeholder={`Selecione o ${label}`}
      >
        <Option value="M">Masculino</Option>
        <Option value="F">Feminino</Option>
      </Select>
    </Form.Item>
  );
}

export default SexoDropdown;
