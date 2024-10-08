import React, { useState } from 'react';
import './registro_planificacion.css'; // estilos importados


function RegistroPlanificacion() {
  const [formData, setFormData] = useState({
    objetivo: '',
    sprints: [{ id: 0, name: 'Sprint 0', fechaInicio: '', fechaFin: '' }]
  });

  const [showPlanningOptions, setShowPlanningOptions] = useState(false); // Estado para mostrar/ocultar el submenu

  // Maneja el cambio en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Maneja el cambio en los inputs de sprints
  const handleSprintChange = (id, field, value) => {
    const updatedSprints = formData.sprints.map((sprint) => 
      sprint.id === id ? { ...sprint, [field]: value } : sprint
    );
    setFormData({
      ...formData,
      sprints: updatedSprints
    });
  };

  // Añade un nuevo sprint
  const addSprint = () => {
    const newSprint = { id: formData.sprints.length, name: `Sprint ${formData.sprints.length}`, fechaInicio: '', fechaFin: '' };
    setFormData({
      ...formData,
      sprints: [...formData.sprints, newSprint]
    });
  };

  // Elimina un sprint
  const removeSprint = (id) => {
    setFormData({
      ...formData,
      sprints: formData.sprints.filter(sprint => sprint.id !== id)
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8081/web-tis-app/backend/reg_planificacion.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objetivo: formData.objetivo,
          sprints: formData.sprints
        }) 
      });

      const data = await response.json();

      // Maneja la respuesta del servidor
      if (data.success) {
        alert('Planificación registrada exitosamente!');
      } else {
        alert('Mensaje: ' + data.message);
      }
    } catch (error) {
      console.error('Error en el envío:', error);
      alert('Ocurrió un error al enviar los datos.');
    }
  };

  // Muestra/Oculta el submenu de planificación
  const togglePlanningOptions = () => {
    setShowPlanningOptions(!showPlanningOptions);
  };

  return (
    <div className="menu-container">
      <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <a href="#!" onClick={togglePlanningOptions}>Planificación</a>
              {showPlanningOptions && (
                <ul className="submenu">
                  <li><a href="/nuevo_planificacion">Nuevo Planificación</a></li>
                  <li><a href="/asignar_tareas">Asignar Tareas</a></li>
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
        <h1>Registro de Planificación</h1>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="objetivo">Objetivo:</label>
            <input 
              type="text" 
              id="objetivo" 
              name="objetivo" 
              value={formData.objetivo} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          <h3>Sprints</h3>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Sprint</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {formData.sprints.map((sprint) => (
                <tr key={sprint.id}>
                  <td>{sprint.id + 1}</td>
                  <td>{sprint.name}</td>
                  <td>
                    <input 
                      type="date" 
                      value={sprint.fechaInicio} 
                      onChange={(e) => handleSprintChange(sprint.id, 'fechaInicio', e.target.value)} 
                      required 
                    />
                  </td>
                  <td>
                    <input 
                      type="date" 
                      value={sprint.fechaFin} 
                      onChange={(e) => handleSprintChange(sprint.id, 'fechaFin', e.target.value)} 
                      required 
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => removeSprint(sprint.id)} className="btn btn-danger">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="form-group">
            <button type="button" className="btn btn-primary" onClick={addSprint}>Añadir nuevo Sprint</button>
          </div>

          <button type="submit" className="btn btn-success">Guardar Planificación</button>
        </form>
      </main>
    </div>
  );
}

export default RegistroPlanificacion;
