import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout, Row, Col, Table, Modal, Button, Space, Popconfirm, } from 'antd';
import { BorderOutlined, CheckOutlined, DeleteOutlined, EditOutlined, FileAddOutlined, FormOutlined, SolutionOutlined, } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Column } = Table;

function ListaAlunosPage() {
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState(''); // Novo estado para a caixa de pesquisa
  const [originalAlunos, setOriginalAlunos] = useState([]);

  const requestAlunos = async () => {
    try {
      setLoading(true);

      const response = await axios.get('/alunos');

      const { data } = response;

      setAlunos(data);
      setOriginalAlunos(data);

    } catch (error) {
      console.warn(error);
      Modal.error({
        title: 'Não foi possível carregar os Alunos, tente novamente mais tarde.',
      });
    } finally {
      setLoading(false);
    }
  };
  
   useEffect(() => {
     requestAlunos();
   }, []);

// Função para filtrar os alunos com base no texto de pesquisa
const filterAlunos = () => {
  const filtered = originalAlunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(searchText.toLowerCase())
  );
  setAlunos(filtered);
};

// Atualizar a lista filtrada sempre que houver uma mudança no texto de pesquisa
useEffect(() => {
  filterAlunos();
}, [searchText, originalAlunos]);


  const completeAluno = async (alunoId) => {
    try {
      setLoading(true);

      let response;

      const { data } = response;

      const novoAluno = [...alunos];
      const index = novoAluno.findIndex((aluno) => aluno.id_aluno === alunoId);

      novoAluno.splice(index, 1, data);

      setAlunos(novoAluno);

    } catch (error) {
      console.warn(error);
      Modal.error({
        title: 'Não foi possível processar, tente novamente mais tarde.',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeAluno = async (alunoId) => {
    try {
      setLoading(true);

      await axios.delete(`/alunos/${alunoId}`);

      const novoAluno = [...alunos];
      const index = novoAluno.findIndex((aluno) => aluno.id_aluno === alunoId);

      novoAluno.splice(index, 1);

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

  const renderActions = (aluno) => (
    <Button.Group>
      <Button
        title='Adicionar Avaliação para o Aluno'
        onClick={() => {
          navigate(`/avaliacoes/new/${aluno.id_aluno}`);
        }}
        icon={<FileAddOutlined />}
      />

      <Button
        title='Lista de Avaliações do Aluno'
        onClick={() => {
          navigate(`/avaliacoes/alunos/${aluno.id_aluno}`);
        }}
        icon={<SolutionOutlined />}
      />


      <Button
        title='Editar Aluno'
        onClick={() => {
          navigate(`/alunos/${aluno.id_aluno}`);
        }}
        icon={<EditOutlined />}
      />

      <Popconfirm
        title="Deseja excluir o Aluno?"
        okText="Sim, excluir"
        cancelText="Não, cancelar"
        onConfirm={() => {
          removeAluno(aluno.id_aluno);
        }}
      >
        <Button
          title='Excluir Aluno'
          icon={<DeleteOutlined />}
        />
      </Popconfirm>
    </Button.Group>
  );

  return (
    <Content>
      <br />
      <h2>Lista de Alunos</h2>
      {/* Caixa de pesquisa */}
      <input
        size={50}        
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Digite o nome para pesquisar"
      />
      <Space direction="vertical" style={{ display: 'flex' }}>

        <Row justify="center">
          <Col span={23}>
            <Table
              dataSource={alunos}
              pagination
              loading={loading}
              rowKey={(aluno) => aluno.id_aluno}
            >
              <Column
                title="ID"
                dataIndex="id_aluno"
                key="id"
              />
              <Column
                title="Nome"
                dataIndex="nome"
                key="nome"
              />
              <Column
                title="Nascimento"
                dataIndex="dt_nasc"
                key="dt_nasc"
                render={(data) => new Date(data).toLocaleString().slice(0, 10)}
              />
              <Column
                title="Sexo"
                dataIndex="sexo"
                key="sexo"
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
    </Content>
  );
}

export default ListaAlunosPage;
