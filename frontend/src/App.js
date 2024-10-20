import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.js';
import Menudoc from './pages/Menu_doc.js';
import Menuest from './pages/Menu_est.js';
import RegEstInd from './pages/registro_est_ind.js';
import RegEstLot from './pages/reg_est_lot.js'
import GroupView from './pages/Grupos/GruposView.js';
import GruposMod from './pages/Grupos/GruposMod.js';
import ActasSemanales from './pages/EvaluacionSemanal/ActasSemanales';
import ResultadoSem from './pages/resultado_sem.js';
import GroupView from './pages/Grupos/GruposView.js';
import GruposMod from './pages/Grupos/GruposMod.js';
import RegEstLot from './pages/reg_est_lot.js';
import AgregarEst from './pages/Grupos/agregar_est_view.js'
import SelectGrupo from './pages/Grupos/select_grupo.js'
import VerTarea from './pages/ver_tarea.js';
import VerPlanilla from './pages/planilla.js';
import VerPerfil from './pages/ver_perfil.js';
import { UserProvider } from './controller/userContex';
import EditarEstGrupo from './pages/Grupos/edit_est_grupo.js';

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu_doc" element={<Menudoc />} />
        <Route path="/menu_est" element={<Menuest />} />
        <Route path="/registro_est_ind" element={<RegEstInd />} />
        <Route path="/registro_est_lot" element={<RegEstLot />} />
        <Route path="/registrar_grupo" element={<GroupView />} />
        <Route path="/modificar_grupo" element={<GruposMod />} />
        <Route path="/evaluacion_semanal/actas_semanales" element={<ActasSemanales />} /> 
        <Route path="/resultado_sem" element={<ResultadoSem />} />
        <Route path="/registro_est_lot" element={<RegEstLot />} />
        <Route path="/registrar_grupo" element={<GroupView />} />
        <Route path="/modificar_grupo" element={<GruposMod />} />
        <Route path="/agregar_estudiante" element={<AgregarEst />} />
        <Route path="/select_grupo" element={<SelectGrupo />} />
        <Route path="/ver_tarea" element={<VerTarea />} />
        <Route path="/planilla" element={<VerPlanilla />} />
        <Route path="/ver_perfil_tareas" element={<VerPerfil />} />
        <Route path="/editar_est_grupo" element={<EditarEstGrupo />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
