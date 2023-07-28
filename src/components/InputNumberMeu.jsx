import React, { useState, useEffect } from 'react';
import { Form, InputNumber as AntInputNumber } from 'antd';

function InputNumberZ({ label, onChange, validate, required, initialValue, step, ...others }) {
    const [errorMessage, setErrorMessage] = useState(null);
    const [changed, setChanged] = useState(null);

    const [value, setValue] = useState(initialValue || '');

    const validateStatus = errorMessage ? 'error' : 'success';

    useEffect(() => {
        //setValue(initialValue || '');
        setValue(initialValue !== undefined ? String(initialValue) : '');
    }, [initialValue]);

    const handleValidation = (value) => {
        setChanged(true);
        let isValid = true;

        // Custom validation for the numeric input
        if (required && !value) {
            setErrorMessage('Digite um valor numérico.');
            isValid = false;
        } else if (isNaN(value)) {
            setErrorMessage('O valor deve ser numérico.');
            isValid = false;
        } else {
            setErrorMessage(null);
        }

        if (onChange) {
            onChange({
                name: others.name,
                input: {
                    value: parseFloat(value),
                    valid: isValid,
                },
            });
        }
    };
    return (
        <Form.Item
            validateStatus={validateStatus}
            label={label}
            required={required}
            help={errorMessage}
            hasFeedback={changed}
            //preserve={true} // Mantém o foco ao validar
        >
            <AntInputNumber
                style={{ width: '100%' }}
                value={value}
                // onChange={(value) => {
                //     setValue(value);
                //     handleValidation(value);
                // }}
                onChange={(value) => {
                    setValue(String(value)); // Armazena o valor como string
                    handleValidation(value);
                }}
                
                step={step || 'any'}                
                {...others}
            />
            {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
        </Form.Item>
    );
}

export default InputNumberZ;
