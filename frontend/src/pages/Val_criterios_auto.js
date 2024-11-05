import React, { useState } from 'react';
//import './Val_criterios_eval.css';


const AutoevaluacionForm = () => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [habilitadoPara, setHabilitadoPara] = useState('Todos los estudiantes');

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
            horaFin,
            habilitadoPara
        });

        alert(`Evaluación iniciada para: ${habilitadoPara}`);
    };

    return (
        <div className="autoevaluacion-container">
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
    );
};

export default AutoevaluacionForm;
