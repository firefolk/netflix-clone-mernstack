import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import WatchPage from './pages/WatchPage';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authUser';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import SearchPage from './pages/SearchPage';
import SearchHistoryPage from './pages/SearchHistoryPage';
import NotFoundPage from './pages/404';

function App() {
  const { user, isCheckingAuth, authCheck } = useAuthStore();

  console.log('App Rendered');
  console.log('user:', user);
  console.log('isCheckingAuth:', isCheckingAuth);

  useEffect(() => {
    console.log('useEffect - authCheck called');
    authCheck();
  }, [authCheck]);

  if (isCheckingAuth) {
    console.log('Auth is being checked, showing loader...');
    return (
      <div className='h-screen'>
        <div className='flex justify-center items-center bg-black h-full'>
          <Loader className='animate-spin text-red-600 size-10' />
        </div>
      </div>
    );
  }

  console.log(
    'Rendering routes. User is',
    user ? 'logged in' : 'not logged in'
  );

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route
          path='/login'
          element={
            !user
              ? (() => {
                  console.log('Rendering LoginPage');
                  return <LoginPage />;
                })()
              : (() => {
                  console.log('Redirecting to / from /login');
                  return <Navigate to={'/'} />;
                })()
          }
        />
        <Route
          path='/signup'
          element={
            !user
              ? (() => {
                  console.log('Rendering SignUpPage');
                  return <SignUpPage />;
                })()
              : (() => {
                  console.log('Redirecting to / from /signup');
                  return <Navigate to={'/'} />;
                })()
          }
        />
        <Route
          path='/watch/:id'
          element={
            user
              ? (() => {
                  console.log('Rendering WatchPage');
                  return <WatchPage />;
                })()
              : (() => {
                  console.log('Redirecting to /login from /watch/:id');
                  return <Navigate to={'/login'} />;
                })()
          }
        />
        <Route
          path='/search'
          element={
            user
              ? (() => {
                  console.log('Rendering SearchPage');
                  return <SearchPage />;
                })()
              : (() => {
                  console.log('Redirecting to /login from /search');
                  return <Navigate to={'/login'} />;
                })()
          }
        />
        <Route
          path='/history'
          element={
            user
              ? (() => {
                  console.log('Rendering SearchHistoryPage');
                  return <SearchHistoryPage />;
                })()
              : (() => {
                  console.log('Redirecting to /login from /history');
                  return <Navigate to={'/login'} />;
                })()
          }
        />
        <Route
          path='/*'
          element={(() => {
            console.log('Rendering NotFoundPage');
            return <NotFoundPage />;
          })()}
        />
      </Routes>
      <Footer />
      <Toaster />
    </>
  );
}

export default App;
