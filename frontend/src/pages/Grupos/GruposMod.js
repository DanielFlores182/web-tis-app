import React, { useState, useEffect } from 'react';
import './GruposMod.css';
import GroupController from '../../controller/groupController';

function GruposMod() {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const toggleRegisterOptions = () => {
      setShowRegisterOptions(!showRegisterOptions); // Cambiar entre mostrar y ocultar
  };
  const [groupDescription, setGroupDescription] = useState('');

  // Este useEffect se ejecutará al montar el componente
  useEffect(() => {
    // Establece el valor inicial
    setGroupDescription('Ana Saenz');
    handleLiderChange({ target: { value: 'Ana Saenz' } }); 
  }, []); // Se ejecuta solo una vez

  // Función para manejar el cambio del líder
  const handleLiderChange = async (e) => {
    const liderSeleccionado = e.target.value;
    setLoading(true);
    
    try {
      const grupo = await GroupController.getGroupByLeader(liderSeleccionado);
      setGrupoSeleccionado(grupo);
    } catch (error) {
      console.error('Error al obtener el grupo:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un estudiante
  const handleDeleteStudent = (studentId) => {
    if (grupoSeleccionado) {
      const updatedGroup = { ...grupoSeleccionado };
      updatedGroup.estudiantes = updatedGroup.estudiantes.filter(est => est.id !== studentId);
      setGrupoSeleccionado(updatedGroup);
    }
  };

  return (
    <div className="menu-container">
      <aside className="sidebar">
                <nav>
                <ul>
                <li><a href="/registrar_grupo">Registro Grupo</a></li>
                    <li>
                    <a href="#!" onClick={toggleRegisterOptions}>Registrar Estudiante</a>
                    {showRegisterOptions && (
                        <ul className="submenu">
                        <li><a href="/registro_est_ind">Registro Individual</a></li>
                        <li><a href="/registro_est_lot">Registrar Por Lote</a></li>
                        </ul>
                    )}
                    </li>
                    <li><a href="/perfil">Perfil</a></li>
                    <li><a href="/doc_config">Configuraciones</a></li>
                    <li><a href="/">Cerrar Sesion</a></li>
                </ul>
                </nav>
            </aside>

      <main className="content">
        <div className="text-secondary text-center">
          <h2>Nombre de la Empresa</h2>   
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="text-secondary title-custome">
              <h6>Lider del grupo</h6>   
            </div>
            <div class="form-floating mt-3">
              <input 
                  type="text" 
                  class="form-control" 
                  name="groupDescription" 
                  placeholder="Nombre del Grupo" 
                  onChange={(e) => setGroupDescription(e.target.value)} 
                  required 
                  value={groupDescription}
                  disabled
              />
              <label for="floatingInput">Descripcion del grupo</label>
          </div>

          </div>
        </div>

        {loading && <p>Cargando grupo...</p>}

        {grupoSeleccionado && (
          <div className="card">
            <div className="card-body">
            <div className="text-secondary title-custome">
            <h6>Descripción</h6>
            </div>
          <div className="text-secondary">
            <p> {grupoSeleccionado.descripcion}</p>
          </div>

              <div className="text-secondary title-custome">
                <h6>Integrantes del Grupo: {grupoSeleccionado.name}</h6>   
              </div>
              <table className="table table-light table-striped">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Nombres</th>
                    <th scope="col">Correo</th>

                  </tr>
                </thead>
                <tbody>
                  {grupoSeleccionado.estudiantes.map(student => (
                    <tr key={student.id}>
                      <th scope="row">{student.id}</th>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default GruposMod;
