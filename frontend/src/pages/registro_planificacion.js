import React, { useState } from 'react';
import './registro_planificacion.css';
import logo from '../images/logo.png';

const PlanificacionForm = () => {
    const [grupoNombre, setGrupoNombre] = useState('');
    const [grupoDocente, setGrupoDocente] = useState('');
    const [objetivo, setObjetivo] = useState('');
    const [sprints, setSprints] = useState([{ nombre: 'Sprint 0', fechaInicio: '', fechaFin: '' }]);
    const [showRegisterPlanningOptions, setShowRegisterPlanningOptions] = useState(false);

    const toggleRegisterPlanningOptions = () => {
        setShowRegisterPlanningOptions(!showRegisterPlanningOptions);
    };

    const handleInputChange = (e, index, field) => {
        const newSprints = [...sprints];
        newSprints[index][field] = e.target.value;
        setSprints(newSprints);
    };

    const addSprint = () => {
        setSprints([...sprints, { nombre: `Sprint ${sprints.length}`, fechaInicio: '', fechaFin: '' }]);
    };

    const removeSprint = (index) => {
        const newSprints = sprints.filter((_, i) => i !== index);
        setSprints(newSprints);
    };

    // Función para formatear la fecha de yyyy-mm-dd a dd-mm-yyyy
    const formatDate = (date) => {
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de fechas: asegurarse de que no haya solapamientos entre los sprints
        for (let i = 0; i < sprints.length; i++) {
            const sprint = sprints[i];
            if (!sprint.fechaInicio || !sprint.fechaFin) {
                alert('Por favor, completa todos los campos de los sprints.');
                return;
            }
            for (let j = i + 1; j < sprints.length; j++) {
                const otroSprint = sprints[j];
                // Comparar las fechas de inicio y fin de los sprints
                const fechaInicio1 = new Date(sprint.fechaInicio);
                const fechaFin1 = new Date(sprint.fechaFin);
                const fechaInicio2 = new Date(otroSprint.fechaInicio);
                const fechaFin2 = new Date(otroSprint.fechaFin);

                // Verificar si las fechas se solapan
                if ((fechaInicio1 < fechaFin2 && fechaInicio2 < fechaFin1)) {
                    alert(`El Sprint ${sprint.nombre} se solapa con el Sprint ${otroSprint.nombre}.`);
                    return;
                }
            }
        }

        // Formatear las fechas antes de enviarlas
        const data = {
            grupo_nombre: grupoNombre,
            grupo_id_docente: grupoDocente,
            objetivo: objetivo,
            sprints: sprints.map(sprint => ({
                nombre: sprint.nombre,
                fecha_ini: formatDate(sprint.fechaInicio),
                fecha_fin: formatDate(sprint.fechaFin)
            }))
        };

        try {
            console.log(data, sprints)
            const response = await fetch('http://localhost:8081/web-tis-app/backend/reg_planificacion.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (result.success) {
                alert('Plan registrado con éxito');
            } else {
                alert('Error al registrar el plan: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar en la BD');
        }
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <img src={logo} alt="Logo de la Empresa" className="header-logo"></img>
                <h1 className="header-title">Estudiante</h1>
                <nav>
                    <ul>
                        <li>
                            <a href="#!" onClick={toggleRegisterPlanningOptions}>Registrar Planificación</a>
                            {showRegisterPlanningOptions && (
                                <ul className="submenu">
                                    <li><a href="/registro_planificacion">Crear Plan</a></li>
                                    <li><a href="/asignar_tareas">Asignar Tareas</a></li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>
            </aside>

            <div className="planificacion-form">
                <h2> Soda Corp S.R.L</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Equipo:
                        <input
                            type="text"
                            value={grupoNombre}
                            onChange={(e) => setGrupoNombre(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Grupo Docente:
                        <input
                            type="number"
                            value={grupoDocente}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 4)) {
                                    setGrupoDocente(value);
                                }
                            }}
                            min="1"
                            max="4"
                            required
                        />
                    </label>

                    <label>
                        Nombre del proyecto:
                        <input
                            type="text"
                            value={objetivo}
                            onChange={(e) => setObjetivo(e.target.value)}
                            required
                        />
                    </label>

                    <h3>Sprints a realizar:</h3>
                    {sprints.map((sprint, index) => (
                        <div key={index} className="sprint-row">
                            <label>
                                Sprint {index}:
                                <input
                                    type="text"
                                    value={sprint.nombre}
                                    onChange={(e) => handleInputChange(e, index, 'nombre')}
                                />
                            </label>
                            <label>
                                Fecha Inicio:
                                <input
                                    type="date"
                                    value={sprint.fechaInicio}
                                    onChange={(e) => handleInputChange(e, index, 'fechaInicio')}
                                />
                            </label>
                            <label>
                                Fecha Fin:
                                <input
                                    type="date"
                                    value={sprint.fechaFin}
                                    onChange={(e) => handleInputChange(e, index, 'fechaFin')}
                                />
                            </label>
                            <button type="button" onClick={() => removeSprint(index)}>
                                Eliminar
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addSprint}>
                        Añadir nuevo Sprint
                    </button>

                    <button type="submit">Guardar</button>
                </form>
            </div>
        </div>
    );
};

export default PlanificacionForm;