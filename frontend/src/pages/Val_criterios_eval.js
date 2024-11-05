import React, { useState } from 'react';
//import './Val_criterios_eval.css';

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

    return (
        <div className="evaluacion-pares-container">
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
