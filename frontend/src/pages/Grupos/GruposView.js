import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GruposView.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/logo.png';

const GruposView = () => {
    const [groupName, setGroupName] = useState('');
    const [groupDocente, setGroupDocente] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [teachers, setTeachers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('http://web-tis-app-production.up.railway.app/get_docentes.php');
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
            const response = await fetch('http://web-tis-app-production.up.railway.app/registrar_grupo.php', {
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
           // En el lugar donde haces la redirección
            if (result.success) {
                alert(result.message);
            // Pasar el nombre del grupo como estado al navegar
                navigate('/agregar_estudiante', { state: { nombreGrupo: groupName } });
            } else {
                    console.error(result.error);
                    alert('Error al agregar el grupo.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Error en la solicitud.');
        }
    };
    const [showRegisterOptions, setShowRegisterOptions] = useState(false);

    const toggleRegisterOptions = () => {
      setShowRegisterOptions(!showRegisterOptions); // Cambiar entre mostrar y ocultar
    };
  
    return (
        <div className="menu-container">
            <aside className="sidebar">
             <img src={logo} alt="Logo de la Empresa" className="header-logo"></img>
             <h1 className="header-title">Estudiante</h1>
                <nav>
                  <ul>
                    <li>
                        <a href="#!" onClick={toggleRegisterOptions}>Registrar Grupo</a>
                        {showRegisterOptions && (
                        <ul className="submenu">
                        <li><a href="/registrar_grupo">Nuevo Grupo</a></li>
                        <li><a href="/agregar_est">Agregar Estudiantes</a></li>
                        </ul>
                        )}
                    </li>
                    <li><a href="/perfin">Tareas pendientes</a></li>
                    <li><a href="/perfin">Cronograma de actividades</a></li>
                    <li><a href="/perfin">Historial de evaluaciones</a></li>
                    <li><a href="/perfin">Ver grupo</a></li>
                    <li><a href="/perfin">Perfil</a></li>
                    <li><a href="/perfin">Darse de baja</a></li>
                    <li><a href="/est_config">Configuraciones</a></li>
                    <li><a href="/">Cerrar Sesion</a></li>
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
                            />
                            <label>Descripción del Grupo</label>
                        </div>
                        <button className="btn btn-primary" type="submit">Registrar Grupo</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default GruposView;
