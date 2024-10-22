import React, { useState, useEffect } from 'react';
import './asignar_tareas.css';
import logo from '../images/logo.png';

const AsignarTareas = () => {
    const [tareas, setTareas] = useState([{ nombre: '', responsable: '', fechaEntrega: '', entregable: '' }]);
    const [sprints, setSprints] = useState([]); // Estado para almacenar los sprints
    const [sprintSeleccionado, setSprintSeleccionado] = useState(''); // Estado para el sprint seleccionado
    const [showRegisterOptions, setShowRegisterOptions] = useState(false);
    const [showRegisterPlanningOptions, setShowRegisterPlanningOptions] = useState(false);

    useEffect(() => {
        // Llamada al backend para obtener los sprints
        const fetchSprints = async () => {
            try {
                const response = await fetch('http://localhost:8081/web-tis-app/backend/get_sprints.php'); // Cambiar URL según corresponda
                const result = await response.json();
                if (result.success) {
                    setSprints(result.sprints); // Supone que el resultado es un array de nombres de sprints
                } else {
                    console.error('Error al obtener sprints:', result.error);
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
            }
        };

        fetchSprints();
    }, []);

    const toggleRegisterOptions = () => {
        setShowRegisterOptions(!showRegisterOptions);
    };

    const toggleRegisterPlanningOptions = () => {
        setShowRegisterPlanningOptions(!showRegisterPlanningOptions);
    };

    const addTarea = () => {
        setTareas([...tareas, { nombre: '', responsable: '', fechaEntrega: '', entregable: '' }]);
    };

    const handleInputChange = (index, field, value) => {
        const nuevasTareas = [...tareas];
        nuevasTareas[index][field] = value;
        setTareas(nuevasTareas);
    };

    const removeTarea = (index) => {
        const nuevasTareas = tareas.filter((_, i) => i !== index);
        setTareas(nuevasTareas);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!sprintSeleccionado) {
            alert('Por favor, selecciona un sprint.');
            return;
        }

        const data = {
            sprint_nombre: sprintSeleccionado,
            tareas: tareas,
        };

        try {
            const response = await fetch('http://localhost:8081/web-tis-app/backend/asig_tarea.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (result.success) {
                alert('Tareas asignadas correctamente');
            } else {
                alert('Error al asignar tareas: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <img src={logo} alt="Logo de la Empresa" className="header-logo" />
                <h1 className="header-title">Estudiante</h1>
                <nav>
                    <ul>
                        <li>
                            <a href="#!" onClick={toggleRegisterOptions}>Registrar Grupo</a>
                            {showRegisterOptions && (
                                <ul className="submenu">
                                    <li><a href="/registrar_grupo">Nuevo Grupo</a></li>
                                    <li><a href="/agregar_est">Agregar Estudiantes</a></li>
                                </ul>
                            )}
                        </li>
                        <li>
                            <a href="#!" onClick={toggleRegisterPlanningOptions}>Registrar Planificación</a>
                            {showRegisterPlanningOptions && (
                                <ul className="submenu">
                                    <li><a href="/registro_planificacion">Crear Plan</a></li>
                                    <li><a href="/asignar_tareas">Asignar Tareas</a></li>
                                </ul>
                            )}
                        </li>
                        <li><a href="/perfil">Tareas pendientes</a></li>
                        <li><a href="/perfil">Cronograma de actividades</a></li>
                        <li><a href="/perfil">Historial de evaluaciones</a></li>
                        <li><a href="/perfil">Ver grupo</a></li>
                        <li><a href="/perfil">Darse de baja</a></li>
                        <li><a href="/configuracion">Configuraciones</a></li>
                        <li><a href="/">Cerrar Sesión</a></li>
                    </ul>
                </nav>
            </aside>

            <div className="tareas-container">
                <h2>Asignar Tareas a un Sprint</h2>
                {/* Selector de Sprint */}
                <label>
                    Seleccionar Sprint:
                    <select
                        value={sprintSeleccionado}
                        onChange={(e) => setSprintSeleccionado(e.target.value)}
                        required
                    >
                        <option value="">Seleccionar Sprint</option>
                        {sprints.map((sprint, index) => (
                            <option key={index} value={sprint.nombre}>
                                {sprint.nombre}
                            </option>
                        ))}
                    </select>
                </label>
                <form onSubmit={handleSubmit}>
                    {tareas.map((tarea, index) => (
                        <div key={index} className="tarea-row">
                            {/* Campos de entrada para cada tarea */}
                            <label>
                                Nombre de tarea:
                                <input
                                    type="text"
                                    value={tarea.nombre}
                                    onChange={(e) => handleInputChange(index, 'nombre', e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Responsable:
                                <select
                                    value={tarea.responsable}
                                    onChange={(e) => handleInputChange(index, 'responsable', e.target.value)}
                                    required
                                >
                                    <option value="">Miembro de equipo</option>
                                    <option value="miembro1">Miembro 1</option>
                                    <option value="miembro2">Miembro 2</option>
                                </select>
                            </label>
                            <label>
                                Fecha de entrega:
                                <input
                                    type="date"
                                    value={tarea.fechaEntrega}
                                    onChange={(e) => handleInputChange(index, 'fechaEntrega', e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Que se entregará:
                                <input
                                    type="text"
                                    value={tarea.entregable}
                                    onChange={(e) => handleInputChange(index, 'entregable', e.target.value)}
                                    required
                                />
                            </label>
                            <button type="button" className="eliminar-btn" onClick={() => removeTarea(index)}>
                                Eliminar tarea
                            </button>
                        </div>
                    ))}
                    <button type="button" className="agregar-btn" onClick={addTarea}>
                        Agregar más tareas
                    </button>
                    <button type="submit" className="submit-btn">
                        Guardar tareas
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AsignarTareas;
