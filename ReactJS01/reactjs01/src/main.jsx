import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import PaymentPage from './components/PaymentPage.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import Header from './components/layout/header.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'user',
        element: <UserPage />,
      },
      {
        path: 'product/:productId',
        element: <ProductDetail />,
      },
      {
        path: 'payment/:productId',
        element: <PaymentPage />,
      },
    ],
  },
  {
    path: 'register',
    element: (
      <>
        <Header />
        <RegisterPage />
      </>
    ),
  },
  {
    path: 'login',
    element: (
      <>
        <Header />
        <LoginPage />
      </>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>
);