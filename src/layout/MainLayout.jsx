import { Suspense, lazy } from 'react';
import {
  Routes, Route, Navigate,
} from 'react-router-dom';
import CriarAvaliacaoPage from '../pages/CriarAvaliacaoPage';

/**
 * Arquivos importadas utilizando a técnica de lazy/Suspense do React.
 * Docs: https://pt-br.react.dev/reference/react/Suspense
 *
 * Isso permite que os arquivos sejam carregados apenas quando as páginas foram acessadas
 * pelo usuário.
 */
const PrivateRoute = lazy(() => import('../components/PrivateRoute'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SubscriptionPage = lazy(() => import('../pages/SubscriptionPage'));
const CriarAlunoPage = lazy(() => import('../pages/CriarAlunoPage'));
const ListaAlunosPage = lazy(() => import('../pages/ListaAlunosPage'));
const ListaAvaliacoesPage = lazy(() => import('../pages/ListaAvaliacoesPage'));

const AppLayout = lazy(() => import('./AppLayout'));

//Para importar usando o lazy, é brigatório que as rotas estejem dentro de um suspense<Suspense>

function MainLayout() {
  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<Navigate to="/alunos" />} />
        <Route path="/" element={<Navigate to="/avaliacoes" />} />
        <Route
          path="/alunos"
          element={(
            <PrivateRoute>
              <AppLayout>
                <ListaAlunosPage />
              </AppLayout>
            </PrivateRoute>
          )}
        />
        <Route
          path="/alunos/new"
          element={(
            <PrivateRoute>
              <AppLayout>
                <CriarAlunoPage />
              </AppLayout>
            </PrivateRoute>
          )}
        />
        <Route
          path="/alunos/:alunoId"
          element={(
            <PrivateRoute>
              <AppLayout>
                <CriarAlunoPage />
              </AppLayout>
            </PrivateRoute>
          )}
        />
         <Route
          path="/avaliacoes/new/:alunoId"
          element={(
            <PrivateRoute>
              <AppLayout>
                <CriarAvaliacaoPage />
              </AppLayout>
            </PrivateRoute>
          )} 
        />        
        <Route
          path="/avaliacoes/:avaliacaoId/:alunoId"
          element={(
            <PrivateRoute>
              <AppLayout>
                <CriarAvaliacaoPage />
              </AppLayout>
            </PrivateRoute>
          )}
        />
        <Route
          path="/avaliacoes/alunos/:alunoId"
          element={(
            <PrivateRoute>
              <AppLayout>
                <ListaAvaliacoesPage />
              </AppLayout>
            </PrivateRoute>
          )}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
      </Routes>
    </Suspense>
  );
}

export default MainLayout;
