import React, { useState } from 'react';
// Importa las clases CSS que usas en el diseño anterior
import 'bootstrap/dist/css/bootstrap.min.css';
import './agregar_est_view.css'; 
import logo from '../../images/logo.png'; 

const EvaluacionParesForm = () => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!fechaInicio || !fechaFin || !horaInicio || !horaFin) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        console.log({ fechaInicio, fechaFin, horaInicio, horaFin });
        alert('Evaluación de pares iniciada.');
    };

    return (
        <div className="menu-container">
            {/* Barra lateral */}
            <aside className="sidebar">
                <img src={logo} alt="Logo de la Empresa" className="header-logo" />
                <h1 className="header-title">Evaluación</h1>
                <nav>
                    <ul>
                        <li><a href="/registrar_grupo">Registrar Grupo</a></li>
                        <li><a href="/perfin">Tareas pendientes</a></li>
                        <li><a href="/perfin">Cronograma de actividades</a></li>
                        <li><a href="/perfin">Perfil</a></li>
                        <li><a href="/">Cerrar Sesión</a></li>
                    </ul>
                </nav>
            </aside>

            {/* Contenido principal */}
            <main className="content card px-5">
                <div className="text-danger text-center">
                    <h2>Evaluación de Pares</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col">
                            <label>Fecha inicio</label>
                            <input 
                                type="date" 
                                className="form-control"
                                value={fechaInicio} 
                                onChange={(e) => setFechaInicio(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="col">
                            <label>Fecha fin</label>
                            <input 
                                type="date" 
                                className="form-control"
                                value={fechaFin} 
                                onChange={(e) => setFechaFin(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <label>Hora inicio</label>
                            <input 
                                type="time" 
                                className="form-control"
                                value={horaInicio} 
                                onChange={(e) => setHoraInicio(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="col">
                            <label>Hora fin</label>
                            <input 
                                type="time" 
                                className="form-control"
                                value={horaFin} 
                                onChange={(e) => setHoraFin(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>
                    <p className="note text-muted">
                        *La prueba se realizará a todos los grupos de manera aleatoria.
                    </p>
                    <button type="submit" className="btn btn-success">Iniciar</button>
                </form>
            </main>
        </div>
    );
};

export default EvaluacionParesForm;
