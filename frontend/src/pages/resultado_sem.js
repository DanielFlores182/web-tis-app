import React, { useState, useEffect } from 'react';
import './resultado_sem.css'; // Archivo CSS para los estilos

function ResultadoSem() {
    const [showRegisterOptions, setShowRegisterOptions] = useState(false);
    const [grupos, setGrupos] = useState([]); // Grupos disponibles
    const [selectedGrupo, setSelectedGrupo] = useState(''); // Grupo seleccionado
    const [evaluacion, setEvaluacion] = useState([]); // Resultado de la evaluación

    // Función para alternar el submenú
    const toggleRegisterOptions = () => {
        setShowRegisterOptions(!showRegisterOptions);
    };

    // Función para obtener la evaluación del grupo
    const fetchEstadoEvaluacion = async (grupoMateria) => {
        try {
            const response = await fetch('http://localhost:8081/web-tis-app/backend/get_todas_las_actas.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ grupo_materia: grupoMateria })
            });
            const data = await response.json();
            setEvaluacion(data); // Guardar el resultado de la evaluación
        } catch (error) {
            console.error('Error al obtener la evaluación del grupo:', error);
        }
    };

    // Obtener los grupos disponibles
    useEffect(() => {
        const fetchGrupos = async () => {
            try {
                const response = await fetch('http://localhost:8081/web-tis-app/backend/get_grupo_mat.php');
                const data = await response.json();
                setGrupos(data); // Guardar los grupos obtenidos
            } catch (error) {
                console.error('Error al obtener los grupos:', error);
            }
        };

        fetchGrupos(); // Obtener grupos al montar el componente
    }, []);

    // Manejar el cambio del grupo seleccionado y hacer la solicitud de evaluación
    const handleGrupoChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedGrupo(selectedValue);
        if (selectedValue) {
            fetchEstadoEvaluacion(selectedValue); // Obtener el estado de evaluación del grupo
        }
    };

    return (
        <div className="menu-container">
            <aside className="sidebar">
                <nav>
                    <ul>
                        <li>
                            <a href="#!" onClick={toggleRegisterOptions}>Registrar Estudiante</a>
                            {showRegisterOptions && (
                                <ul className="submenu">
                                    <li><a href="/registro_est_lot">Registrar Por Lote</a></li>
                                </ul>
                            )}
                        </li>
                        <li><a href="/perfil">Perfil</a></li>
                        <li><a href="/doc_config">Configuraciones</a></li>
                        <li><a href="/">Cerrar Sesion</a></li>
                    </ul>
                </nav>
            </aside>
            <main className="content">
                <h1>Resultados semanales</h1>

                {/* Contenido de la página */}
                <div className="options-container">
                    <h2>Seleccione el grupo</h2>
                    <select 
                        value={selectedGrupo} 
                        onChange={handleGrupoChange} // Actualizar el grupo seleccionado
                    >
                        <option value="">Seleccione un grupo</option>
                        {grupos.map((grupo) => (
                            <option key={grupo.grupos} value={grupo.grupos}>
                                Grupo {grupo.grupos}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Mostrar resultados de evaluación */}
                {evaluacion.length > 0 && (
                    <div className="table-container">
                        <h2>Estado de Evaluación del Grupo</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre del grupo</th>
                                    <th>Estado de evaluación</th>
                                    <th>Fecha del acta actual</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evaluacion.map((item) => (
                                    <tr key={item.grupo_nombre}>
                                        <td>{item.grupo_nombre}</td>
                                        <td>{item.estado_evaluacion}</td>
                                        <td>{item.fecha_acta_actual}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

export default ResultadoSem;
