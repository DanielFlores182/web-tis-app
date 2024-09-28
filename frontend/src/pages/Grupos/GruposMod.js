import React, { useState } from 'react';
import './GruposMod.css';
import GroupController from '../../controller/groupController';

function GruposMod() {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

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
            <li><a href="#!">Registrar Estudiante</a></li>
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
            <div className="form-floating">
            <select className="form-select" id="floatingSelect" onChange={handleLiderChange}>
                <option value="" selected>Selecciona un líder</option>
                <option value="Rene Angosta">Rene Angosta</option>
                <option value="Carlos Perez">Carlos Perez</option>
                <option value="Ana Saenz">Ana Saenz</option>
            </select>
            <label htmlFor="floatingSelect">Selecciona un líder</label>
            </div>

          </div>
        </div>

        {loading && <p>Cargando grupo...</p>}

        {grupoSeleccionado && (
          <div className="card">
            <div className="card-body">
              <div className="text-secondary title-custome">
                <h6>Integrantes del Grupo: {grupoSeleccionado.name}</h6>   
              </div>
              <table className="table table-light table-striped">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Nombres</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {grupoSeleccionado.estudiantes.map(student => (
                    <tr key={student.id}>
                      <th scope="row">{student.id}</th>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>
                        <button onClick={() => handleDeleteStudent(student.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                          </svg>
                        </button>
                      </td>
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
