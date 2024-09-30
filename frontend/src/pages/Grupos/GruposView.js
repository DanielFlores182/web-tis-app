import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GruposView.css'; // Asegúrate de tener este archivo para los estilos

const GruposView = () => {
    const [groupName, setGroupName] = useState('');
    const [groupDocente, setGroupDocente] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [studentName, setStudentName] = useState('');
    const [studentLastName, setStudentLastName] = useState('');
    const [isGroupLeader, setIsGroupLeader] = useState(false);
    const [studentsList, setStudentsList] = useState([]); // Estado para almacenar los estudiantes

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('http://localhost:8081/web-tis-app/backend/get_docentes.php');
                const data = await response.json();
                setTeachers(data);
            } catch (error) {
                console.error('Error al obtener la lista de docentes:', error);
            }
        };

        fetchTeachers();
    }, []);

    const handleGroupSubmit = async (e) => {
        e.preventDefault();
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
                        nombres: selectedTeacher.nombres_d,
                        apellidos: selectedTeacher.apellidos_d
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
        setIsSubmitted(true);
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
                            <h4><b>Crear Grupo</b></h4>
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
                                    disabled={isSubmitted} 
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
                                disabled={isSubmitted} 
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
                                disabled={isSubmitted} 
                            />
                            <label>Descripción del Grupo</label>
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={isSubmitted}>Registrar Grupo</button>
                    </form>
                </div>

                {/* Formulario para agregar estudiantes (sin lógica) */}
                <div className="card-body background px-5 rounded mt-5">
                    <div className="title-custome text-light mb-3">
                        <h4><b>Agregar Estudiante al Grupo</b></h4>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <div className="form-floating">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Nombre del Estudiante" 
                                    value={studentName} 
                                    onChange={(e) => setStudentName(e.target.value)} 
                                    required 
                                />
                                <label>Nombre del Estudiante</label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-floating">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Apellido del Estudiante" 
                                    value={studentLastName} 
                                    onChange={(e) => setStudentLastName(e.target.value)} 
                                    required 
                                />
                                <label>Apellido del Estudiante</label>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="form-check">
                                <input 
                                    type="checkbox" 
                                    className="form-check-input" 
                                    id="liderGrupo" 
                                    checked={isGroupLeader} 
                                    onChange={(e) => setIsGroupLeader(e.target.checked)} 
                                />
                                <label className="form-check-label small text-light" htmlFor="liderGrupo">Líder de Grupo</label>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-success" type="button" disabled>Agregar Estudiante</button>
                </div>

                {/* Burbuja con la lista de estudiantes añadidos (sin lógica) */}
                <div className="card-body background px-5 rounded mt-5">
                    <div className="title-custome text-light mb-3">
                        <h4><b>Estudiantes en el Grupo</b></h4>
                    </div>
                    <ul className="list-group">
                        {/* Aquí puedes agregar estudiantes manualmente para la visualización */}
                        <li className="list-group-item">Ejemplo Estudiante 1 (Líder de Grupo)</li>
                        <li className="list-group-item">Ejemplo Estudiante 2</li>
                        <li className="list-group-item">Ejemplo Estudiante 3</li>
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default GruposView;
