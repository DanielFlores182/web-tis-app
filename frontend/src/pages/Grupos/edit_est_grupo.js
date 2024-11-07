import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './agregar_est_view.css';
import logo from '../../images/logo.png';

const EditEstGrupoView = () => {
    const location = useLocation();
    const [grupo_nombre, setGrupoNombre] = useState('');
    const [studentName, setStudentName] = useState('');
    const [studentLastName, setStudentLastName] = useState('');
    const [isGroupLeader, setIsGroupLeader] = useState(false);
    const [studentsList, setStudentsList] = useState([]);
    const [studentSuggestions, setStudentSuggestions] = useState([]);
    const [students, setStudents] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (location.state && location.state.grupo_nombre) {
            setGrupoNombre(location.state.grupo_nombre);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchRegisteredStudents = async () => {
            if (grupo_nombre) {
                try {
                    const response = await fetch('https://web-tis-app-production.up.railway.app/get_est_from_grupo.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ grupo_nombre })
                    });

                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setStudentsList(data);
                    } else {
                        console.error('La respuesta no es un array:', data);
                    }
                } catch (error) {
                    console.error('Error al obtener estudiantes del grupo:', error);
                }
            }
        };

        fetchRegisteredStudents();
    }, [grupo_nombre]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('https://web-tis-app-production.up.railway.app/get_estudiantes.php');
                const data = await response.json();

                if (Array.isArray(data)) {
                    setStudents(data);
                } else {
                    console.error('La respuesta no es un array:', data);
                }
            } catch (error) {
                console.error('Error al obtener la lista de estudiantes:', error);
            }
        };

        fetchStudents();
    }, []);

    const handleStudentNameChange = (e) => {
        const value = e.target.value;
        setStudentName(value);

        if (Array.isArray(students)) {
            const suggestions = students.filter(student =>
                student.nombres_e.toLowerCase().includes(value.toLowerCase())
            );
            setStudentSuggestions(suggestions);
        }
    };

    const handleSuggestionClick = (student) => {
        setStudentName(student.nombres_e);
        setStudentLastName(student.apellidos_e);
        setStudentSuggestions([]);
    };

    const handleStudentSubmit = async (e) => {
        e.preventDefault();
        const updatedStudent = {
            nombres_e: studentName,
            apellidos_e: studentLastName,
            lider: isGroupLeader,
            nombreGrupo: grupo_nombre
        };

        try {
            const response = await fetch('https://web-tis-app-production.up.railway.app/add_estu_to_group.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombres_estudiante: updatedStudent.nombres_e,
                    apellidos_estudiante: updatedStudent.apellidos_e,
                    rol: updatedStudent.lider ? 1 : 0,
                    nombre_grupo: updatedStudent.nombreGrupo
                })
            });

            const result = await response.json();
            if (result.success) {
                setMessage(result.message);
                setStudentsList([...studentsList, {
                    id: result.id,
                    nombres_e: updatedStudent.nombres_e,
                    apellidos_e: updatedStudent.apellidos_e,
                    lider: updatedStudent.lider
                }]);
            } else {
                setMessage(result.error || 'Error al actualizar el estudiante.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setMessage('Error en la solicitud.');
        }

        setStudentName('');
        setStudentLastName('');
        setIsGroupLeader(false);
    };

    const handleDeleteStudent = async (student) => {
        try {
            const response = await fetch('https://web-tis-app-production.up.railway.app/eliminar_estudiante.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombres_e: student.nombres_e,
                    apellidos_e: student.apellidos_e,
                    nombre_grupo: grupo_nombre
                })
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message);
                setStudentsList(studentsList.filter(s => s.id !== student.id));
            } else {
                alert(result.error || 'Error al eliminar el estudiante.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Error en la solicitud.');
        }
    };

    return (
        <div className="menu-container">
            <aside className="sidebar">
                <img src={logo} alt="Logo de la Empresa" className="header-logo" />
                <h1 className="header-title">Estudiante</h1>
                <nav>
                    <ul>
                        <li><a href="#!">Registrar Grupo</a></li>
                        <li><a href="/perfin">Tareas pendientes</a></li>
                        <li><a href="/perfin">Cronograma de actividades</a></li>
                        <li><a href="/perfin">Historial de evaluaciones</a></li>
                        <li><a href="/perfin">Ver grupo</a></li>
                        <li><a href="/perfin">Perfil</a></li>
                        <li><a href="/perfin">Darse de baja</a></li>
                        <li><a href="/est_config">Configuraciones</a></li>
                        <li><a href="/">Cerrar Sesión</a></li>
                    </ul>
                </nav>
            </aside>
            <main className="content card px-5">
                <div className="text-danger text-center">
                    <h2>Editar Estudiante en el Grupo: {grupo_nombre}</h2>
                </div>
                {message && <div className="alert alert-info">{message}</div>}
                <div className="pb-5 text-center">
                    Complete el formulario para editar un estudiante en el grupo.
                </div>
                <div className="card-body background px-5 rounded">
                    <form onSubmit={handleStudentSubmit}>
                    <div className="row mb-3">
    <div className="col">
        <div className="form-floating">
            <input
                type="text"
                className="form-control"
                placeholder="Nombre del Estudiante"
                value={studentName}
                onChange={handleStudentNameChange}
                required
            />
            <label>Nombre del Estudiante</label>
            {studentSuggestions.length > 0 && (
                <ul className="list-group mt-1">
                    {studentSuggestions.map(student => (
                        <li
                            key={student.id}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleSuggestionClick(student)}
                        >
                            {student.nombres_e} {student.apellidos_e}
                        </li>
                    ))}
                </ul>
            )}
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
    <div className="col-auto d-flex align-items-center">
        <input
            type="checkbox"
            className="form-check-input"
            id="isGroupLeader"
            checked={isGroupLeader}
            onChange={() => setIsGroupLeader(!isGroupLeader)}
        />
        <label className="form-check-label small text-light" htmlFor="isGroupLeader">
            ¿Líder del Grupo?
        </label>
    </div>
</div>

                        <button type="submit" className="btn btn-primary">Agregar Estudiante</button>
                    </form>
                </div>
                <div className="card-body mt-4 p-3">
    <h4 className="mt-4">Lista de Estudiantes en el Grupo:</h4>
    <div className="alert alert-primary p-3">
        <ul className="list-group">
            {studentsList.map(student => (
                <li key={student.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {student.nombres_e} {student.apellidos_e}
                    <button className="btn btn-danger" onClick={() => handleDeleteStudent(student)}>Eliminar</button>
                </li>
            ))}
        </ul>
    </div>
</div>

            </main>
        </div>
    );
};

export default EditEstGrupoView;
