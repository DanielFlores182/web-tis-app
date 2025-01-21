import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//paginas principales
import Login from './pages/Login.js';
import Menudoc from './pages/Menu_doc.js';
import Menuest from './pages/Menu_est.js';
import MenuPrin from './pages/Menu.js';
//paginas de registro de estudiantes
import RegEstInd from './pages/registro_est_ind.js';
import RegEstLot from './pages/reg_est_lot.js'
import NuevaOrden from './pages/Trabajos/nueva_orden.js'
//paginas de reportes 
import TablaAnu from './pages/Reportes/tabla_anuncios.js';
import TablaAnuEst from './pages/Reportes/tabla_anuncios_est.js'
import ListEst from './pages/Reportes/Lista_estudiantes.js';
import NuevoAnu from './pages/Reportes/nuevo_anuncio.js'
import TablaEva from './pages/Reportes/tabla_evaluaciones.js'
//paginas de grupos 
import GroupView from './pages/Grupos/GruposView.js';
import SelectGrupo from './pages/Grupos/select_grupo.js';
import EditarEstGrupo from './pages/Grupos/edit_est_grupo.js';
import AgregarEst from './pages/Grupos/agregar_est_view.js'
//paginas de tareas
import AsigTarea from './pages/asignar_tareas';
import VerTarea from './pages/ver_tarea.js';
//paginas de evaluaciones
import RegistroEvaluacion from './pages/registro_eva.js';
//paginas de criterios
import VerCriterios from './pages/Ver_criterio';
import ValCriterioPares from './pages/Val_criterios_eval';
import ValCriterioAuto from './pages/Val_criterios_auto';
import RegCriterios from './pages/Reg_criterios.js';
//paginas de actas
import ActasSemanales from './pages/EvaluacionSemanal/ActasSemanales';
import ResultadoSem from './pages/resultado_sem.js';
//pagina de planificacion
import RegPlan from './pages/registro_planificacion.js';
import VerPlanilla from './pages/planilla.js';

import VerPerfil from './pages/ver_perfil.js';
import { UserProvider } from './controller/userContex';
import './App.css';

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
        <Route path="/evaluacion_semanal/actas_semanales" element={<ActasSemanales />} /> 
        <Route path="/resultado_sem" element={<ResultadoSem />} />
        <Route path="/registro_est_lot" element={<RegEstLot />} />
        <Route path="/registrar_grupo" element={<GroupView />} />
        <Route path="/agregar_estudiante" element={<AgregarEst />} />
        <Route path="/registro_planificacion" element={<RegPlan />} />
        <Route path="/asignar_tareas" element={<AsigTarea />} />
        <Route path="/select_grupo" element={<SelectGrupo />} />
        <Route path="/ver_tarea" element={<VerTarea />} />
        <Route path="/planilla" element={<VerPlanilla />} />
        <Route path="/ver_perfil_tareas" element={<VerPerfil />} />
        <Route path="/Ver_criterio" element={<VerCriterios />} />
        <Route path="/Val_criterios_eval" element={<ValCriterioPares />} />
        <Route path="/Val_criterios_auto" element={<ValCriterioAuto/>} />
        <Route path="/editar_est_grupo" element={<EditarEstGrupo />} />
        <Route path="/registro_eva" element={<RegistroEvaluacion />} />
        <Route path="/reg_criterios" element={<RegCriterios/>}/>
        <Route path="/lista_estudiantes" element={<ListEst/>}/>
        <Route path="/tabla_anuncios" element={<TablaAnu/>}/>
        <Route path="/tabla_anuncios_est" element={<TablaAnuEst/>}/>
        <Route path="/nuevo_anuncio" element={<NuevoAnu/>}/>
        <Route path="/tabla_evaluaciones" element={<TablaEva/>}/>
        <Route path="/menu_principal" element={<MenuPrin/>}/>
        <Route path="/nueva_orden" element={<NuevaOrden/>}/>
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
