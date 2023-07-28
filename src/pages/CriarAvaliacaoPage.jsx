import { Button, Col, Form, Modal, notification, Row, Space, } from 'antd';
import { Content } from 'antd/es/layout/layout';
import axios from 'axios';
import { useEffect, useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import InputDate from '../components/InputDate';
import InputNumberZ from '../components/InputNumberMeu';
import { validateAvaliacaoData, validateAvaliacaoInt } from '../validatiors/avaliacoes';
import { validateAvaliacaoFloat } from '../validatiors/avaliacoes';
import { UserOutlined } from '@ant-design/icons';
import InputText from '../components/InputText';


// Função para determinar a cor do IMC com base no valor
const imcColor = (imc) => {
  if (imc < 18.5) return 'orange'; // Altere para 'orange' para usar a cor laranja
  if (imc >= 18.5 && imc < 25) return 'green';
  if (imc >= 25 && imc < 30) return 'gold'; // Altere para 'gold' para usar a cor amarela
  if (imc >= 30) return 'red';
  return 'black';
};

// Função para determinar a cor da Situação com base no valor
const situacaoColor = (situacao) => {
  if (situacao === 'Abaixo do peso') return 'orange'; // Altere para 'orange' para usar a cor laranja
  if (situacao === 'Peso normal') return 'green';
  if (situacao === 'Sobrepeso') return 'gold'; // Altere para 'gold' para usar a cor amarela
  if (situacao === 'Obesidade') return 'red';
  return 'black';
};


function CriarAvaliacaoPage() {
  const { avaliacaoId } = useParams();
  let { alunoId } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);

  console.log('ID DO ALUNO', alunoId);
  console.log('ID AVALIAÇÃO', avaliacaoId);


  // Função para calcular o IMC com base na altura e peso fornecidos
  const calculateIMC = (altura, peso) => {
    const alturaMetros = parseFloat(altura) / 100; // Converta a altura para metros
    const imc = parseFloat(peso) / (alturaMetros * alturaMetros);
    return imc.toFixed(2); // Arredonde o resultado para 2 casas decimais
  };

  // Função para determinar a situação do aluno com base no IMC
  const getIMCSituation = (imc) => {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc >= 18.5 && imc < 25) return 'Peso normal';
    if (imc >= 25 && imc < 30) return 'Sobrepeso';
    if (imc >= 30) return 'Obesidade';
    return '';
  };

  const handleInputChange = useCallback((event) => {
    const { name, input } = event;

    setFormValues({
      ...formValues,
      [name]: input,
    });
  }, [formValues]);

  const requestAvaliacao = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(`/avaliacoes/${avaliacaoId}`);
      const { data } = response;

      if (data[0]) {

        alunoId = data[0].id_aluno;

        setFormValues({
          dt_avaliacao: {
            value: data[0].dt_avaliacao.slice(0, 10),
            valid: true,
          },
          idade: {
            value: data[0].idade,
            valid: true,
          },
          peso: {
            value: data[0].peso,
            valid: true,
          },
          altura: {
            value: data[0].altura,
            valid: true,
          },
          resultado: {
            value: data[0].resultado,
            valid: true,
          },
          situacao: {
            value: data[0].situacao,
            valid: true,
          },
          id_aluno: {
            value: data[0].id_aluno,
            valid: true,
          },
        });
      }
    } catch (error) {
      console.warn(error);
      Modal.error({
        title: 'Não foi possível carregar a avaliação, tente novamente mais tarde.',
      });

      navigate(`/avaliacoes/${avaliacaoId}`);

    } finally {
      setLoading(false);
    }
  }, [avaliacaoId, navigate]);

  useEffect(() => {
    if (avaliacaoId) {
      requestAvaliacao();
    } else {
      setFormValues({});
    }
  }, [requestAvaliacao, avaliacaoId]);

  const handleCriarAvaliacao = useCallback(async () => {
    try {
      setLoading(true);

      const { dt_avaliacao, idade, peso, altura } = formValues;

      if (!dt_avaliacao?.valid || !idade?.valid || !peso?.valid || !altura?.valid) return;

      // Função para calcular o IMC
      // const calculateIMC = () => {
      //   if (altura.value && peso.value) {
      //     console.log('Entrou Calculate IMC');
      //     const alturaMetros = altura.value / 100; // Converta a altura para metros
      //     const imc = peso.value / (alturaMetros * alturaMetros);
      //     return imc.toFixed(2); // Arredonde o resultado para 2 casas decimais
      //   } else {
      //     return 0;
      //   }
      // };

      // Função para determinar a situação do aluno com base no IMC
      // const getIMCSituation = (imc) => {
      //   if (imc < 18.5) return 'Abaixo do peso';
      //   if (imc >= 18.5 && imc < 25) return 'Peso normal';
      //   if (imc >= 25 && imc < 30) return 'Sobrepeso';
      //   if (imc >= 30) return 'Obesidade';
      //   return '';
      // };



      // Cálculo do IMC e situação do aluno       
      const imc = calculateIMC(altura.value, peso.value);
      const situacao = getIMCSituation(imc);

      const body = {
        dt_avaliacao: dt_avaliacao.value.slice(0, 10),
        idade: idade.value,
        peso: peso.value,
        altura: altura.value,
        resultado: imc, //resultado.value,
        id_aluno: alunoId,
        situacao: situacao, // Use a situação determinada com base no IMC        
      };

      setFormValues({
        resultado: {
          value: imc,
          valid: true,
        },
        situacao: {
          value: situacao,
          valid: true,
        },
        id_aluno: {
          value: alunoId,
          valid: true,
        },
      });

      console.log('ID DO ALUNO', alunoId);
      console.log('ID AVALIAÇÃO', avaliacaoId);

      
      if (avaliacaoId) {
        await axios.patch(`/avaliacoes/${avaliacaoId}`, body);
      } else {
        await axios.post('/avaliacoes', body);
      }

      notification.success({
        message: 'Avaliação cadastrada com sucesso!',
      });

      navigate(`/avaliacoes/alunos/${alunoId}`);

    } catch (error) {
      console.warn(error);
      Modal.error({
        title: 'Não foi cadastrar, tente novamente mais tarde.',
      });
    } finally {
      setLoading(false);
    }
  }, [formValues, navigate, avaliacaoId]);


  return (
    <Content>
      <br />
      <Space direction="vertical" style={{ display: 'flex' }}>

        <Row justify="center">
          <Col xs={23} sl={14} md={12} lg={10} xl={8}>

            <Form layout="vertical">
              <InputDate
                name="dt_avaliacao"
                label="Data Avaliação"
                size="large"
                onChange={handleInputChange}
                validate={validateAvaliacaoData}
                disabled={loading}
                required
                initialDate={formValues.dt_avaliacao?.value}
              />
              <InputNumberZ
                label="Idade(Anos)"
                name="idade"
                size="large"
                onChange={handleInputChange}
                validate={validateAvaliacaoInt('Idade')}
                disabled={loading}
                required
                initialValue={formValues.idade?.value}
                step="1" // Permite apenas númeos inteiros
                icon={<UserOutlined />} // Ícone antes do campo de input                
                placeholder="Informe a idade"
              />
              <InputNumberZ
                label="Peso(Kilos)"
                name="peso"
                size="large"
                onChange={handleInputChange}//handleInputChange
                validate={validateAvaliacaoFloat('Peso')}
                disabled={loading}
                required
                initialValue={formValues.peso?.value}
                step="0.01" // Permite números com uma casa decimal
                icon={<UserOutlined />} // Ícone antes do campo de input                
                placeholder="Informe o peso"
              />
              <InputNumberZ
                label="Altura(Centímetros)"
                name="altura"
                size="large"
                onChange={handleInputChange}//handleInputChange
                //onblur={calculateIMC(formValues.altura?.value, formValues.peso?.value)}
                validate={validateAvaliacaoFloat('Altura')}
                disabled={loading}
                required
                initialValue={formValues.altura?.value}
                step="1" // Permite números com uma casa decimal
                icon={<UserOutlined />} // Ícone antes do campo de input                
                placeholder="Informe a altura"
              />
              {/* Mostrar o IMC e a Situação 
              <p>IMC: <span style={{ color: imcColor, fontWeight: 'bold' }}>{imcAux}</span></p>
              <p>Situação: <span style={{ color: situacaoColor, fontWeight: 'bold' }}>{situacaoAux}</span></p>
*/}
              {/* <InputNumberZ
                label="Resultado"
                name="resultado"
                size="large"
                //onChange={handleInputChange}
                //validate={validateAvaliacaoFloat}
                disabled={true}
                required
                initialValue={formValues.resultado?.value}
                step="0.01" // Permite números com uma casa decimal
              />
              <InputText
                name="situacao"
                label="Situação"
                size="large"
                //onChange={handleInputChange}
                //validate={validateAlunoNome}
                disabled={true}
                required
                value={formValues.situacao?.value}
              //value={situacao}
              /> */}
              <Button
                block
                type="primary"
                size="large"
                onClick={handleCriarAvaliacao}
                loading={loading}
              >
                Salvar
              </Button>
              <br />
              <br />
              <Button
                block
                type="primary"
                size="large"
                onClick={() => {
                  navigate(`/avaliacoes/alunos/${alunoId}`);
                }}
                loading={loading}
              >

                Cancelar
              </Button>

            </Form>
          </Col>
        </Row>
      </Space>
    </Content>
  );
}

export default CriarAvaliacaoPage;
