import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GruposView.css'; // Asegúrate de tener este archivo para los estilos

const GruposView = () => {
    const [groupName, setGroupName] = useState('');
    const [groupDocente, setGroupDocente] = useState(''); // Aquí se mantendrá el id del docente seleccionado
    const [groupDescription, setGroupDescription] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false); // Estado para controlar el envío
    const [teachers, setTeachers] = useState([]); // Estado para la lista de docentes

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('http://localhost:8081/web-tis-app/backend/get_docentes.php'); // Reemplaza con la ruta de tu API
                const data = await response.json();
                setTeachers(data); // Asume que la respuesta es un array de docentes
            } catch (error) {
                console.error('Error al obtener la lista de docentes:', error);
            }
        };

        fetchTeachers();
    }, []);

    const handleGroupSubmit = async (e) => {
        e.preventDefault();
        // Encontrar el docente seleccionado basado en el ID
        const selectedTeacher = teachers.find(teacher => teacher.id === parseInt(groupDocente));

        if (!selectedTeacher) {
            alert('Por favor, selecciona un docente válido.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/web-tis-app/backend/registrar_grupo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    groupName,
                    groupLeader: {
                        nombres: selectedTeacher.nombres_d,  // Usar nombres_d del docente seleccionado
                        apellidos: selectedTeacher.apellidos_d  // Usar apellidos_d del docente seleccionado
                    },
                    groupDescription
                })
            });
            const result = await response.json();
            if (result.success) {
                alert(result.message);
            } else {
                console.error(result.error);
                alert('Error al agregar el grupo.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Error en la solicitud.');
        }
        setIsSubmitted(true); // Cambia el estado para bloquear los campos
    };

    return (
        <div className="menu-container">
            <aside className="sidebar">
                <nav>
                    <ul>
                        <li><a href="/registrar_grupo">Registro Grupo</a></li>
                        <li><a href="/perfil">Perfil</a></li>
                        <li><a href="/doc_config">Configuraciones</a></li>
                        <li><a href="/">Cerrar Sesión</a></li>
                    </ul>
                </nav>
            </aside>
            <main className="content card px-5">
                <div className="text-danger text-center">
                    <h2>Registro de Datos del Grupo</h2>
                </div>
                <div className="pb-5 text-center">
                    Complete el siguiente formulario para registrar la información básica del grupo.
                </div>
                <div className="card-body background px-5 rounded">
                    <form onSubmit={handleGroupSubmit}>
                        <div className="title-custome text-light mb-3">
                            <h4><b>Crear Grupo</b></h4> {/* Título dentro del recuadro */}
                        </div>
                        <div className="input-group flex-nowrap mb-3">
                            <div className="form-floating">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Nombre del Grupo" 
                                    value={groupName} 
                                    onChange={(e) => setGroupName(e.target.value)} 
                                    required 
                                    disabled={isSubmitted} // Deshabilita el campo si se envió el formulario
                                />
                                <label>Nombre del Grupo</label>
                            </div>
                        </div>
                        <div className="form-floating mb-3">
                            <select 
                                className="form-select" 
                                value={groupDocente} 
                                onChange={(e) => setGroupDocente(e.target.value)} 
                                required 
                                disabled={isSubmitted} // Deshabilita el campo si se envió el formulario
                            >
                                <option value="" disabled>Seleccione un Docente</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>{teacher.nombres_d} {teacher.apellidos_d}</option>
                                ))}
                            </select>
                            <label>Docente</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Descripción del Grupo" 
                                value={groupDescription} 
                                onChange={(e) => setGroupDescription(e.target.value)} 
                                required 
                                disabled={isSubmitted} // Deshabilita el campo si se envió el formulario
                            />
                            <label>Descripción del Grupo</label>
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={isSubmitted}>Registrar Grupo</button> {/* Deshabilita el botón si se envió el formulario */}
                    </form>
                </div>
            </main>
        </div>
    );
};

export default GruposView;
