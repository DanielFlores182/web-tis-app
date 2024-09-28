// src/views/GroupView.js
import React, { useEffect, useState } from 'react';
import GroupController from '../../controller/groupController'; // Verifica que esta ruta sea correcta
import Grupo from '../../Models/Group';
import Estudiante from '../../Models/Estudent';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GruposView.css';

const GroupView = () => {
    const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const toggleRegisterOptions = () => {
      setShowRegisterOptions(!showRegisterOptions); // Cambiar entre mostrar y ocultar
  };
    const [grupo, setGrupo] = useState(new Grupo(1, 'Grupo A', 'Juan Pérez'));
    const [students, setStudents] = useState([]); // Estado separado para estudiantes
    const [newStudent, setNewStudent] = useState({ name: '', email: ''});
    const [groupName, setGroupName] = useState(grupo.name); // Estado para el nombre del grupo
    const [groupLeader, setGroupLeader] = useState(grupo.lider); // Estado para el líder del grupo
    const [selectedLeader, setSelectedLeader] = useState(null); // Estado para el líder seleccionado
    const [groupDescription, setGroupDescription] = useState(''); // Nuevo estado para la descripción

    useEffect(() => {
        GroupController.updateGroup().then(data => {
            const fetchedStudents = data.map(user => new Estudiante(user.id, user.name, user.email));
            setStudents(fetchedStudents); // Actualiza el estado de estudiantes
            setGrupo(prev => new Grupo(prev.id, prev.name, prev.lider, fetchedStudents)); // Asigna estudiantes al grupo
        });
    }, []);

    const handleStudentChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };

    const handleStudentSubmit = (e) => {
        e.preventDefault();
        const { name, email } = newStudent;
        if (name && email) {
            const studentId = students.length + 1; // Genera un ID simple
            const student = new Estudiante(studentId, name, email); // Crea el nuevo estudiante
            const updatedStudents = [...students, student]; // Actualiza la lista de estudiantes
            setStudents(updatedStudents); // Actualiza el estado de estudiantes
            setGrupo(prev => new Grupo(prev.id, prev.name, prev.lider, updatedStudents)); // Actualiza el grupo
            setNewStudent({ name: '', email: '' }); // Reinicia los campos del formulario
        }
    };
    
    const handleLeaderSelection = (selectedLeader) => {
        setGroupLeader(selectedLeader); // Actualiza el líder del grupo
        setGrupo(prev => new Grupo(prev.id, prev.name, selectedLeader, prev.estudiantes)); // Actualiza el objeto grupo
    };

    const handleGroupChange = (e) => {
        const { name, value } = e.target;
        if (name === 'groupName') {
            setGroupName(value);
            setGrupo(prev => new Grupo(prev.id, value, prev.lider, prev.estudiantes)); // Actualiza el grupo
        } else if (name === 'groupDescription') {
            setGroupDescription(value); // Actualiza la descripción
        }
    };

    const handleDeleteStudent = (id) => {
        const updatedStudents = students.filter(student => student.id !== id);
        setStudents(updatedStudents); // Actualiza la lista de estudiantes
        setGrupo(prev => new Grupo(prev.id, prev.name, prev.lider, updatedStudents)); // Actualiza el grupo
    };

    const handleGroupSubmit = async (e) => {
        e.preventDefault();
        const grupo = {
            ...Grupo,
            leader: selectedLeader, // Añade el líder seleccionado
            description: groupDescription // Añade la descripción al grupo
        };
        console.log(grupo); // Imprime el objeto grupo en la consola

        try {
            const response = await GroupController.updateGroup(grupo); // Envía el grupo al controlador
            console.log('Grupo actualizado:', response); // Imprime la respuesta del servidor
        } catch (error) {
            console.error('Error al actualizar el grupo:', error); // Manejo de errores
        }
    };

    return (
        <div class="menu-container">
            <aside className="sidebar">
                <nav>
                <ul>
                <li><a href="/registrar_grupo">Registro Grupo</a></li>
                    <li>
                    <a href="#!" onClick={toggleRegisterOptions}>Registrar Estudiante</a>
                    {showRegisterOptions && (
                        <ul className="submenu">
                        <li><a href="/registro_est_ind">Registro Individual</a></li>
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
            <main className="content card px-5">

                <div class="text-danger text-center">
                    <h2>Registro de Datos del grupo empresarial/Equipo</h2>
                    
                </div>
                <div class="pb-5 text-center">
                    Complete el siguiente formulario para registrar la informacion basica del equipo
                </div>
                <div class="card-body background px-5 rounded">

                    <div class="p-3">
                        <div class="title-custome text-light" >
                            <h4><b>Actualizar Grupo</b></h4>
                        </div>
                    </div>
                    <form onSubmit={handleGroupSubmit}>
                        <div class="input-group flex-nowrap">
                            <div class="form-floating">
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    name="groupName" 
                                    placeholder="Nombre del Grupo" 
                                    value={groupName} 
                                    onChange={handleGroupChange} 
                                    required 
                                />
                                <label for="floatingInput">Nombre del Grupo</label>
                            </div>
                            
                            <button class="btn btn-primary" type="submit">Guardar Grupo</button>
                        </div>
                        {/* Nuevo bloque para la Descripción */}
                    <div class="p-3">
                            <div class="title-custome text-light" >
                                <h4><b>Descripción del Grupo</b></h4>
                            </div>
                            <div class="form-floating">
                                <textarea 
                                    class="form-control" 
                                    name="groupDescription" 
                                    placeholder="Descripción del Grupo" 
                                    value={groupDescription} 
                                    onChange={handleGroupChange} 
                                    rows="3" 
                                    required 
                                />
                                <label for="floatingInput">Descripción del Grupo</label>
                            </div>
                            
                        </div>
                    </form>
                    <div class="p-3">
                        <div class="title-custome text-light" >
                            <h4><b>Añadir Estudiante</b></h4>
                        </div>
                    </div>
                    
                    <form onSubmit={handleStudentSubmit}>
                        <div class="input-group flex-nowrap">
                            <div class="form-floating">
                                <input 
                                    type="text" 
                                    name="name" 
                                    placeholder="Nombre" 
                                    class="form-control" 
                                    id="floatingInput"
                                    value={newStudent.name} 
                                    onChange={handleStudentChange} 
                                    required 
                                />
                                <label for="floatingInput">Nombre</label>
                            </div>
                            <div class="form-floating">
                                <input 
                                    type="text" 
                                    name="email" 
                                    placeholder="Correo" 
                                    class="form-control" 
                                    id="floatingInput"
                                    value={newStudent.email} 
                                    onChange={handleStudentChange} 
                                    required 
                                />
                                <label for="floatingInput">Correo</label>
                            </div>
                            <button class="btn btn-danger" type="submit">Añadir Estudiante</button>
                        </div>
                    </form>

                    <div class="p-3">
                        <div class="title-custome text-light" >
                            <h4><b>Lista de Estudiantes</b></h4>
                        </div>
                    </div>
                    <ul class ="text-light">
                    <table class="table table-light table-striped">
                        <thead>
                            <tr>
                            <th scope="col"></th>
                            <th scope="col">Nombres</th>
                            <th scope="col">Correo</th>
                            <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grupo.estudiantes.map(student => (
                                <tr key={student.id}>
                                    <th scope="row">{student.id}</th>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>
                                    <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                                        <button onClick={() => handleDeleteStudent(student.id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                                    </svg></button>
                                    {/* Checkbox para seleccionar líder */}
                                        <div className="form-check form-check-inline">
                                         <input 
                                             className="form-check-input" 
                                             type="radio" 
                                             name="groupLeader" 
                                             id={`leaderCheckbox-${student.id}`} 
                                             value={student.name} 
                                             onChange={(e) => handleLeaderSelection(e.target.value)}
                                             checked={groupLeader === student.name} // Marca el checkbox si es el líder actual
                                            />
                                        <label className="form-check-label" htmlFor={`leaderCheckbox-${student.id}`}>
                                            Líder
                                        </label>
                                         </div> 
                                         </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table> 
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default GroupView;
