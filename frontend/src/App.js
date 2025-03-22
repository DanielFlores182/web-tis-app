import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//paginas principales
import Login from './pages/Login.js';
import MenuPrin from './pages/Menu.js';
import BarraTrabajos from './pages/Trabajos/barra_trabajos.js';
import NuevaOrden from './pages/Trabajos/nueva_orden.js'

import { UserProvider } from './controller/userContex';
import './App.css';

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu_principal" element={<MenuPrin/>}/>
        <Route path="/nueva_orden" element={<NuevaOrden/>}/>
        <Route path="/barra_trabajos" element={<BarraTrabajos/>}/>
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
