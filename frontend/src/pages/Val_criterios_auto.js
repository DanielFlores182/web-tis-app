import React, { useState } from 'react';
import './Val_criterios_auto.css';
import logo from '../images/logo.png';

const AutoevaluacionForm = () => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [habilitadoPara, setHabilitadoPara] = useState('Todos los estudiantes');
    const [showRegisterOptions, setShowRegisterOptions] = useState(false);
    const [showCriteriosOptions, setShowCriteriosOptions] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!fechaInicio || !fechaFin || !horaInicio || !horaFin) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        console.log({ fechaInicio, fechaFin, horaInicio, horaFin, habilitadoPara });
        alert(`Evaluación iniciada para: ${habilitadoPara}`);
    };

    const toggleRegisterOptions = () => setShowRegisterOptions(!showRegisterOptions);
    const toggleCriteriosOptions = () => setShowCriteriosOptions(!showCriteriosOptions);

    return (
        <div className="autoevaluacion-container">
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
                        <li>
                            <a href="#!" onClick={toggleCriteriosOptions}>Criterios de Evaluación</a>
                            {showCriteriosOptions && (
                                <ul className="submenu">
                                    <li><a href="/Ver_criterios">Ver Criterios de Evaluación</a></li>
                                    <li><a href="/Reg_criterios">Registrar Criterios de Evaluación</a></li>
                                    <li><a href="/Val_criterios_eval">Validar Criterios de Evaluación de pares</a></li>
                                    <li><a href="/Val_criterios_auto">Validar Criterios de Autoevaluacion</a></li>
                                </ul>
                            )}
                        </li>
                        <li><a href="/perfil">Ver evaluaciones</a></li>
                        <li><a href="/registro_eva">Programar evaluaciones</a></li>
                        <li><a href="/">Cerrar Sesión</a></li>
                    </ul>
                </nav>
            </aside>

            <div className="content">
                <h2>Autoevaluación</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Fecha inicio</label>
                        <input 
                            type="date" 
                            value={fechaInicio} 
                            onChange={(e) => setFechaInicio(e.target.value)} 
                            required 
                        />
                        <label>Fecha fin</label>
                        <input 
                            type="date" 
                            value={fechaFin} 
                            onChange={(e) => setFechaFin(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Hora inicio</label>
                        <input 
                            type="time" 
                            value={horaInicio} 
                            onChange={(e) => setHoraInicio(e.target.value)} 
                            required 
                        />
                        <label>Hora fin</label>
                        <input 
                            type="time" 
                            value={horaFin} 
                            onChange={(e) => setHoraFin(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Habilitado para:</label>
                        <select 
                            value={habilitadoPara} 
                            onChange={(e) => setHabilitadoPara(e.target.value)}
                        >
                            <option>Todos los estudiantes</option>
                            <option>Grupo específico</option>
                            <option>Estudiante individual</option>
                        </select>
                    </div>
                    <button type="submit" className="start-button">Iniciar</button>
                </form>
            </div>
        </div>
    );
};

export default AutoevaluacionForm;
