import React, { useState } from 'react';
import './asignar_tareas.css'; // estilos importados

function AsignarTareas() {
  const [tasks, setTasks] = useState([
    { id: 1, nombreTarea: '', responsable: '', fechaEntrega: '' },
    { id: 2, nombreTarea: '', responsable: '', fechaEntrega: '' }
  ]);

  const [showPlanningOptions, setShowPlanningOptions] = useState(false); // Estado para mostrar/ocultar el submenu

  // Maneja el cambio en los inputs de las tareas
  const handleTaskChange = (id, field, value) => {
    const updatedTasks = tasks.map((task) => 
      task.id === id ? { ...task, [field]: value } : task
    );
    setTasks(updatedTasks);
  };

  // Añadir nueva tarea
  const addTask = () => {
    const newTask = { id: tasks.length + 1, nombreTarea: '', responsable: '', fechaEntrega: '' };
    setTasks([...tasks, newTask]);
  };

  // Eliminar tarea
  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Asignar tarea
  const assignTask = (id) => {
    const task = tasks.find(task => task.id === id);
    alert(`Tarea ${id} asignada a ${task.responsable}`);
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
                  <li><a href="/registro_planificacion">Nuevo Planificación</a></li>
                  <li><a href="/asignar_tareas">Asignar Tareas</a></li>
                </ul>
              )}
            </li>
            <li><a href="/perfil">Perfil</a></li>
            <li><a href="/doc_config">Configuraciones</a></li>
            <li><a href="/">Cerrar Sesión</a></li>
          </ul>
        </nav>
      </aside>

      <main className="content">
        <h1>Asignación de Tareas</h1>
        <form className="assign-task-form">
          <h3>Tareas Sprint 0</h3>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre de tarea</th>
                <th>Responsable</th>
                <th>Fecha de entrega</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>
                    <input 
                      type="text" 
                      value={task.nombreTarea}
                      onChange={(e) => handleTaskChange(task.id, 'nombreTarea', e.target.value)}
                      placeholder="Nombre de la tarea"
                      required
                    />
                  </td>
                  <td>
                    <select
                      value={task.responsable}
                      onChange={(e) => handleTaskChange(task.id, 'responsable', e.target.value)}
                      required
                    >
                      <option value="" disabled>Miembro de equipo</option>
                      <option value="Miembro 1">Miembro 1</option>
                      <option value="Miembro 2">Miembro 2</option>
                      <option value="Miembro 3">Miembro 3</option>
                    </select>
                  </td>
                  <td>
                    <input 
                      type="date" 
                      value={task.fechaEntrega}
                      onChange={(e) => handleTaskChange(task.id, 'fechaEntrega', e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <button 
                      type="button" 
                      className="btn btn-success" 
                      onClick={() => assignTask(task.id)}
                    >
                      Asignar tarea
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger" 
                      onClick={() => removeTask(task.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={addTask}
          >
            Agregar más tareas
          </button>
        </form>
      </main>
    </div>
  );
}

export default AsignarTareas;
