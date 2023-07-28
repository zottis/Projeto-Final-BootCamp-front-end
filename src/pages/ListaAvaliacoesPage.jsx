import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout, Row, Col, Table, Modal, Button, Space, Popconfirm, } from 'antd';
import { BorderOutlined, CheckOutlined, DeleteOutlined, EditOutlined, FileAddOutlined, FormOutlined, SolutionOutlined, } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { Content } = Layout;
const { Column } = Table;

function ListaAvaliacoesPage() {
  const { alunoId } = useParams();
  const navigate = useNavigate();
  
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(false);

  const requestAvaliacoes = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`/avaliacoes/alunos/${alunoId}`);

      const { data } = response;

      setAvaliacoes(data);

      //console.log('Data (Avaliações): ', data);           

    } catch (error) {
      console.warn(error);
      Modal.error({
        title: 'Não foi possível carregar suas Avaliacoes, tente novamente mais tarde.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestAvaliacoes();
  }, []);

  const completeAvaliacao = async (avaliacaoId) => {
    try {
      setLoading(true);

      let response;

      const { data } = response;

      const novoAvaliacao = [...avaliacoes];
      const index = novoAvaliacao.findIndex((avaliacao) => avaliacao.id_avaliacao === avaliacaoId);

      novoAvaliacao.splice(index, 1, data);

      setAvaliacoes(novoAvaliacao);

    } catch (error) {
      console.warn(error);
      Modal.error({
        title: 'Não foi possível processar, tente novamente mais tarde.',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeAvaliacao = async (avaliacaoId) => {
    try {
      setLoading(true);

      await axios.delete(`/avaliacoes/${avaliacaoId}`);

      const novoAvaliacao = [...avaliacoes];
      const index = novoAvaliacao.findIndex((avaliacao) => avaliacao.id_avaliacao === avaliacaoId);

      novoAvaliacao.splice(index, 1);

    } catch (error) {
      console.warn(error);
      Modal.error({
        title: 'Não foi possível processar, tente novamente mais tarde.',
      });
    } finally {
      setLoading(false);
      window.location.reload();//Para atualizar a página
    }
  };    

  const renderActions = (avaliacao) => (
    <Button.Group>
      <Button
        title="Editar avaliação"
        onClick={() => {
          navigate(`/avaliacoes/${avaliacao.id_avaliacao}/${alunoId}`);
        }}
        icon={<FormOutlined />}
      />
      <Popconfirm
        title="Deseja excluir a avaliação?"
        okText="Sim, excluir"
        cancelText="Não, cancelar"
        onConfirm={() => {
          removeAvaliacao(avaliacao.id_avaliacao);
        }}
      >
        <Button
          title="Excluir avaliação"
          icon={<DeleteOutlined />}
        />
      </Popconfirm>
    </Button.Group>
  );

// Função para determinar a cor com base no IMC
const getIMCColor = (imc) => {
  if (imc < 18.5) return '#f5222d'; // Vermelho para abaixo do peso
  if (imc >= 18.5 && imc < 25) return '#52c41a'; // Verde para peso normal
  if (imc >= 25 && imc < 30) return  '#ffa500'; //#fadb14 Amarelo para sobrepeso
  if (imc >= 30) return '#f5222d'; // Vermelho para obesidade
  return ''; // Nenhuma cor padrão definida
};  

  return (
    <Content>
      <br />      
      <h2>Lista de Avaliações do Aluno: {alunoId}</h2>
      <Space direction="vertical" style={{ display: 'flex' }}>

        <Row justify="center">
          <Col span={23}>
            <Table
              dataSource={avaliacoes}
              pagination
              loading={loading}
              rowKey={(avaliacao) => avaliacao.idavaliacao}
            >

              <Column
                title="ID"
                dataIndex="id_avaliacao"
                key="id_avaliacao"
              />
              <Column
                title="Data Aval."
                dataIndex="dt_avaliacao"
                key="dt_avaliacao"
                render={(data) => new Date(data).toLocaleString()}
              />
              <Column
                title="Idade"
                dataIndex="idade"
                key="idade"
              />
              <Column
                title="Peso"
                dataIndex="peso"
                key="peso"
              />
              <Column
                title="Altura"
                dataIndex="altura"
                key="altura"
              />
              <Column
                title="Resultado"
                dataIndex="resultado"
                key="resultado"                
                // render={(resultado, record) => (
                //   <span style={{ color: getIMCColor(parseFloat(resultado)) }}>{resultado}</span>
                // )}                
                render={(resultado, record) => (
                  <span style={{ color: getIMCColor(parseFloat(resultado)), fontWeight: 'bold' }}>
                    {resultado}
                  </span>
                  )} 
              />
              <Column
                title="Situação"
                dataIndex="situacao"
                key="situacao"
                render={(situacao, record) => (
                  <span style={{ color: getIMCColor(parseFloat(record.resultado)), fontWeight: 'bold' }}>{situacao}</span>
                )}
              />
              <Column
                title="Criada em"
                dataIndex="criado_em"
                key="criado_em"
                render={(data) => new Date(data).toLocaleString()}
              />
              <Column
                title="Atualizada em"
                dataIndex="atualizado_em"
                key="atualizado_em"
                render={(data) => new Date(data).toLocaleString()}
              />
              <Column
                title="Ações"
                key="acoes"
                render={renderActions}
              />

            </Table>
          </Col>
        </Row>
      </Space>
    </Content >
  );
}

export default ListaAvaliacoesPage;
