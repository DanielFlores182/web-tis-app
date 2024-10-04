import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.js';
import Menudoc from './pages/Menu_doc.js';
import Menuest from './pages/Menu_est.js';
import RegEstInd from './pages/registro_est_ind.js';
import GroupView from './pages/Grupos/GruposView.js';
import GruposMod from './pages/Grupos/GruposMod.js';
import RegEstLot from './pages/reg_est_lot.js';
import AgregarEst from './pages/Grupos/agregar_est_view.js'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu_doc" element={<Menudoc />} />
        <Route path="/menu_est" element={<Menuest />} />
        <Route path="/registro_est_ind" element={<RegEstInd />} />
        <Route path="/registro_est_lot" element={<RegEstLot />} />
        <Route path="/registrar_grupo" element={<GroupView />} />
        <Route path="/modificar_grupo" element={<GruposMod />} />
        <Route path="/agregar_estudiante" element={<AgregarEst />} />
      </Routes>
    </Router>
  );
}

export default App;
