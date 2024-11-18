import React, { useState } from 'react';
import logo from '../images/logo.png';
import './Val_criterios_eval.css';

const EvaluacionParesForm = () => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación simple para asegurarse de que todos los campos estén completos
        if (!fechaInicio || !fechaFin || !horaInicio || !horaFin) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Aquí podrías manejar los datos para su envío o procesamiento
        console.log({
            fechaInicio,
            fechaFin,
            horaInicio,
            horaFin
        });

        alert('Evaluación de pares iniciada.');
    };
    const [showRegisterOptions, setShowRegisterOptions] = useState(false);
    const [showCriteriosOptions, setShowCriteriosOptions] = useState(false);
    const toggleRegisterOptions = () => {
      setShowRegisterOptions(!showRegisterOptions); // Cambiar entre mostrar y ocultar
    }
    const toggleCriteriosOptions = () => {
      setShowCriteriosOptions(!showCriteriosOptions);
    };
    return (
        <div className="evaluacion-pares-container">
             <aside className="sidebar">
        <img src={logo} alt="Logo de la Empresa" className="header-logo"></img>
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

            <h2>Evaluacion de pares</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <div>
                        <label>Fecha inicio</label>
                        <input 
                            type="date" 
                            value={fechaInicio} 
                            onChange={(e) => setFechaInicio(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Fecha fin</label>
                        <input 
                            type="date" 
                            value={fechaFin} 
                            onChange={(e) => setFechaFin(e.target.value)} 
                            required 
                        />
                    </div>
                </div>
                <div className="form-group">
                    <div>
                        <label>Hora inicio</label>
                        <input 
                            type="time" 
                            value={horaInicio} 
                            onChange={(e) => setHoraInicio(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Hora fin</label>
                        <input 
                            type="time" 
                            value={horaFin} 
                            onChange={(e) => setHoraFin(e.target.value)} 
                            required 
                        />
                    </div>
                </div>
                <p className="note">
                    *La prueba se realizara a todos los grupos de manera aleatoria
                </p>
                <button type="submit" className="start-button">Iniciar</button>
            </form>
        </div>
    );
};

export default EvaluacionParesForm;
