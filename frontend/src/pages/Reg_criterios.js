import React, { useState, useEffect } from 'react';
import './Reg_criterios.css';
import logo from '../images/logo.png';
import { FaEdit, FaTrash } from 'react-icons/fa';

const RegCriterios = () => {
    const [showRegisterOptions, setShowRegisterOptions] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false); // Nuevo estado para controlar el modo de edición
    const [criterios, setCriterios] = useState([
        { nombre: 'Funcionalidad', descripcion: 'Cumplimiento de los requisitos funcionales', porcentaje: 50 },
        { nombre: 'Diseño', descripcion: 'Desc. del diseño', porcentaje: 50 }
    ]);
    const [tareas, setTareas] = useState(5);
    const [sprints, setSprints] = useState(5);
    const [faltas, setFaltas] = useState(0);
    const [criterioActual, setCriterioActual] = useState({ nombre: '', descripcion: '', porcentaje: 0 });
    const [editIndex, setEditIndex] = useState(null); 
    useEffect(() => {
        cargarCriterios();
    }, []);

    const cargarCriterios = async () => {
        try {
            const response = await fetch('https://web-tis-app-production.up.railway.app/cargar_criterios.php');
            const data = await response.json();
            setCriterios(data.criterios || []);
            setTareas(data.tareas || 5);
            setSprints(data.sprints || 5);
            setFaltas(data.faltas || 0);
        } catch (error) {
            console.error("Error al cargar los criterios:", error);
        }
    };

    const handleGuardarCriterio = () => {
        const nuevosCriterios = [...criterios];
        if (editMode) {
            nuevosCriterios[editIndex] = criterioActual;
        } else {
            nuevosCriterios.push(criterioActual);
        }
        setCriterios(nuevosCriterios);
        setShowModal(false);
    };

    const handleGuardar = async () => {
        try {
            const response = await fetch('https://web-tis-app-production.up.railway.app/guardar_criterios.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    criterios,
                    tareas,
                    sprints,
                    faltas,
                }),
            });

            if (response.ok) {
                alert('Datos guardados exitosamente');
            } else {
                console.error('Error al guardar los datos');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
        }
    };

    const toggleRegisterOptions = () => setShowRegisterOptions(!showRegisterOptions);
    const agregarCriterio = () => {
        setCriterioActual({ nombre: '', descripcion: '', porcentaje: 0 });
        setEditMode(false);
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCriterioActual({
            ...criterioActual,
            [name]: name === 'porcentaje' ? Math.min(parseInt(value, 10) || 0, 100) : value,
        });
    };

    const handleCancel = () => setShowModal(false);
    const handleEditarCriterio = (index) => {
        setCriterioActual(criterios[index]);
        setEditIndex(index);
        setEditMode(true);
        setShowModal(true);
    };

    const eliminarCriterio = (index) => setCriterios(criterios.filter((_, i) => i !== index));



    return (
        <div className="menu-container">
            <aside className="sidebar">
                <img src={logo} alt="Logo de la Empresa" className="header-logo" />
                <h1 className="header-title">Docente</h1>
                <nav>
                    <ul>
                        <li>
                            <a href="#!" onClick={toggleRegisterOptions}>Registrar Estudiante</a>
                            {showRegisterOptions && (
                                <ul className="submenu">
                                    <li><a href="/registro_est_ind">Registro Individual</a></li>
                                    <li><a href="/registro_est_lot">Registrar Por Lote</a></li>
                                </ul>
                            )}
                        </li>
                        <li><a href="/perfil">Ver grupos</a></li>
                        <li><a href="/perfil">Ver evaluaciones</a></li>
                        <li><a href="/registro_eva">Programar evaluaciones</a></li>
                        <li><a href="/Reg_criterios">Criterios de evaluacion</a></li>
                        <li><a href="/perfil">Perfil</a></li>
                        <li><a href="/doc_config">Configuraciones</a></li>
                        <li><a href="/">Cerrar Sesion</a></li>
                    </ul>
                </nav>
            </aside>

            <main className="content">
                <h2 className="text-danger text-center">Registro de criterios de evaluación</h2>
                <button className="btn btn-primary mb-3" onClick={agregarCriterio}>+ Agregar criterio</button>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Porcentaje</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {criterios.map((criterio, index) => (
                            <tr key={index}>
                                <td>{criterio.nombre}</td>
                                <td>{criterio.descripcion}</td>
                                <td>{criterio.porcentaje}%</td>
                                <td>
                                    <button className="btn btn-secondary me-2" onClick={() => handleEditarCriterio(index)}>
                                        <FaEdit />
                                    </button>
                                    <button className="btn btn-danger" onClick={() => eliminarCriterio(index)}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-3">
                    <div className="input-group">
                        <label className="input-label">Mínimo de tareas entregadas:</label>
                        <input type="number" className="input-small" value={tareas} onChange={(e) => setTareas(e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Sprints completados:</label>
                        <input type="number" className="input-small" value={sprints} onChange={(e) => setSprints(e.target.value)} />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Máximo de faltas:</label>
                        <input type="number" className="input-small" value={faltas} onChange={(e) => setFaltas(e.target.value)} />
                    </div>
                </div>

                <button className="btn btn-danger mt-4" onClick={handleGuardar}>Guardar</button>

                {/* Modal para agregar o editar criterio */}
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>{editMode ? 'Editar Criterio' : 'Agregar Criterio'}</h3>
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={criterioActual.nombre}
                                onChange={(e) => setCriterioActual({ ...criterioActual, nombre: e.target.value })}
                            />
                            <label>Descripción</label>
                            <textarea
                                value={criterioActual.descripcion}
                                onChange={(e) => setCriterioActual({ ...criterioActual, descripcion: e.target.value })}
                            ></textarea>
                            <label>Porcentaje</label>
                            <input
                                type="number"
                                name="porcentaje"
                                value={criterioActual.porcentaje}
                                onChange={handleInputChange}
                                max="100" // Limita el input de porcentaje a 100 en el frontend
                            />
                            <div className="modal-buttons">
                                <button className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                                <button className="btn btn-primary" onClick={handleGuardarCriterio}>Guardar</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default RegCriterios;