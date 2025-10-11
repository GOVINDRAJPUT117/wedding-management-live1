
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
// import './index.css'; // CSS or Tailwind
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from './pages/CartContext';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  
    <BrowserRouter>
    <CartProvider>
      <App />
    </CartProvider>
    </BrowserRouter>
  
);
