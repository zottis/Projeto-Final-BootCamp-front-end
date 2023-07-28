import { Button, Col, Form, Modal, notification, Row, Space, } from 'antd';
import { Content } from 'antd/es/layout/layout';
import axios from 'axios';
import { useEffect, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import InputText from '../components/InputText';
import SexoDropdown from '../components/SexoDropDown';
import { validateAlunoDataNasc, validateAlunoNome, validateAlunoSexo } from '../validatiors/alunos';
import InputDate from '../components/InputDate';



function CriarAlunoPage() {
  const { alunoId } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = useCallback((event) => {
    const { name, input } = event;

    const upperCaseValue = input.value.toUpperCase();

    setFormValues({
      ...formValues,
      [name]: {
        ...input,
        value: upperCaseValue,
      },
    });
  }, [formValues]);

  const requestAluno = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(`/alunos/${alunoId}`);

      const { data } = response;

      setFormValues({
        nome: {
          value: data.nome,
          valid: true,
        },

        dt_nasc: {
          value: data.dt_nasc,
          valid: true,
        },

        sexo: {
          value: data.sexo,
          valid: true,
        },

      });

    } catch (error) {
      console.warn(error);
      Modal.error({
        title: 'Não foi possível carregar o Aluno, tente novamente mais tarde.',
      });

      navigate('/alunos');

    } finally {
      setLoading(false);
    }
  }, [alunoId, navigate]);

  useEffect(() => {
    if (alunoId) {
      requestAluno();
    } else {
      setFormValues({});
    }
  }, [requestAluno, alunoId]);


  const handleCriarAluno = useCallback(async () => {
    try {
      setLoading(true);

      const { nome, dt_nasc, sexo } = formValues;

      if (!nome?.valid || !dt_nasc?.valid || !sexo?.valid) return;      

      const body = {
        nome: nome.value,
        dt_nasc: dt_nasc.value.slice(0, 10),
        sexo: sexo.value,
      };      
      
      //console.log(`Body: ${Object.values(body)}`);     

      if (alunoId) {
        await axios.patch(`/alunos/${alunoId}`, body);
      } else {
        await axios.post('/alunos', body);
      }

      notification.success({
        message: 'Aluno cadastrado com sucesso!',
      });


      navigate('/alunos');

    } catch (error) {
      console.warn(error);
      Modal.error({
        title: 'Não foi Possível cadastrar, tente novamente mais tarde.',

      });
    } finally {
      setLoading(false);
    }
  }, [formValues, navigate, alunoId]);

  return (
    <Content>
      <br />
      <Space direction="vertical" style={{ display: 'flex' }}>

        <Row justify="center">
          <Col xs={23} sl={14} md={12} lg={10} xl={8}>

            <Form layout="vertical">
              <InputText
                name="nome"
                label="Nome do Aluno"
                size="large"
                onChange={handleInputChange}
                validate={validateAlunoNome}
                disabled={loading}
                required
                value={formValues.nome?.value}
              />

              <InputDate
                name="dt_nasc"
                label="Data nascimento"
                size="large"
                onChange={handleInputChange}
                //validate={validateAlunoDataNasc}
                disabled={loading}
                required
                //value={formValues.dt_nasc?.value}
                initialDate={formValues.dt_nasc?.value}
              />

              <SexoDropdown
                label="Sexo"
                name="sexo"
                onChange={handleInputChange}
                //validate={validateAlunoSexo}
                required
                value={formValues.sexo?.value}
              />

              <Button
                block
                type="primary"
                size="large"
                onClick={handleCriarAluno}
                loading={loading}
              >
                Salvar
              </Button>
            </Form>
          </Col>
        </Row>
      </Space>
    </Content>
  );
}

export default CriarAlunoPage;
