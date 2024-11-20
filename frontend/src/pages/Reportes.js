import React, { useState } from 'react';
import './Reportes.css'; // Asegúrate de tener este archivo CSS para estilos

const ReportesDisponibles = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const abrirModal = () => {
        setIsModalOpen(true);
    };

    const cerrarModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="reportes-container">
            <h2>Reportes Disponibles</h2>
            <div className="reportes-grid">
                <ReporteCard
                    icono="📊"
                    titulo="Reporte de Rendimiento"
                    descripcion="Visualiza el rendimiento general de los estudiantes"
                    abrirModal={abrirModal}
                />
                <ReporteCard
                    icono="📅"
                    titulo="Reporte de Asistencia"
                    descripcion="Revisa la asistencia de los estudiantes por período"
                    abrirModal={abrirModal}
                />
                <ReporteCard
                    icono="📄"
                    titulo="Reporte de Evaluaciones"
                    descripcion="Analiza los resultados de las evaluaciones"
                    abrirModal={abrirModal}
                />
                <ReporteCard
                    icono="👤"
                    titulo="Reporte de Progreso Individual"
                    descripcion="Examina el progreso de cada estudiante"
                    abrirModal={abrirModal}
                />
            </div>

            {isModalOpen && <ModalGenerarReporte cerrarModal={cerrarModal} />}
        </div>
    );
};

const ReporteCard = ({ icono, titulo, descripcion, abrirModal }) => (
    <div className="reporte-card">
        <div className="reporte-icono">{icono}</div>
        <h3>{titulo}</h3>
        <p>{descripcion}</p>
        <button onClick={abrirModal}>Generar Reporte</button>
    </div>
);

const ModalGenerarReporte = ({ cerrarModal }) => {
    const [titulo, setTitulo] = useState('');
    const [solicitante, setSolicitante] = useState('');
    const [campos, setCampos] = useState(['']);
    const fechaHoraActual = new Date().toLocaleString();

    const handleCampoChange = (index, value) => {
        const nuevosCampos = [...campos];
        nuevosCampos[index] = value;
        setCampos(nuevosCampos);
    };

    const agregarCampo = () => {
        setCampos([...campos, '']);
    };

    const eliminarCampo = (index) => {
        const nuevosCampos = campos.filter((_, i) => i !== index);
        setCampos(nuevosCampos);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí puedes manejar el envío de los datos del formulario, por ejemplo, enviándolos al backend.
        console.log({ titulo, fechaHoraActual, campos, solicitante });
        cerrarModal(); // Cierra el modal después de enviar
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Generar Reporte</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-field">
                        <label>Título:</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-field">
                        <label>Fecha y Hora:</label>
                        <input type="text" value={fechaHoraActual} disabled />
                    </div>
                    <div className="modal-field">
                        <label>Campos Pedidos:</label>
                        {campos.map((campo, index) => (
                            <div key={index} className="campo-item">
                                <input
                                    type="text"
                                    value={campo}
                                    onChange={(e) => handleCampoChange(index, e.target.value)}
                                    placeholder="Campo"
                                    required
                                />
                                <button type="button" onClick={() => eliminarCampo(index)}>
                                    Eliminar
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={agregarCampo}>Agregar Campo</button>
                    </div>
                    <div className="modal-field">
                        <label>Solicitante:</label>
                        <input
                            type="text"
                            value={solicitante}
                            onChange={(e) => setSolicitante(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit">Generar</button>
                        <button type="button" onClick={cerrarModal}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportesDisponibles;
