// src/views/GroupView.js
import React, { useEffect, useState } from 'react';
import GroupController from '../../controller/groupController'; // Verifica que esta ruta sea correcta
import Grupo from '../../Models/Group';
import Estudiante from '../../Models/Estudent';

const GroupView = () => {
    const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const toggleRegisterOptions = () => {
      setShowRegisterOptions(!showRegisterOptions); // Cambiar entre mostrar y ocultar
  };
    const [grupo, setGrupo] = useState(new Grupo(1, 'Grupo A', 'Juan Pérez', 'Ingeniería en Sistemas'));
    const [students, setStudents] = useState([]); // Estado separado para estudiantes
    const [newStudent, setNewStudent] = useState({ name: '', age: '', major: '' });
    const [groupName, setGroupName] = useState(grupo.name); // Estado para el nombre del grupo
    const [groupLeader, setGroupLeader] = useState(grupo.lider); // Estado para el líder del grupo

    useEffect(() => {
        GroupController.updateGroup().then(data => {
            const fetchedStudents = data.map(user => new Estudiante(user.id, user.name, user.age, user.major));
            setStudents(fetchedStudents); // Actualiza el estado de estudiantes
            setGrupo(prev => new Grupo(prev.id, prev.name, prev.lider, prev.major, fetchedStudents)); // Asigna estudiantes al grupo
        });
    }, []);

    const handleStudentChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };

    const handleStudentSubmit = (e) => {
        e.preventDefault();
        const { name, age, major } = newStudent;
        if (name && age && major) {
            const studentId = students.length + 1; // Genera un ID simple
            const student = new Estudiante(studentId, name, age, major);
            const updatedStudents = [...students, student]; // Actualiza la lista de estudiantes
            setStudents(updatedStudents); // Actualiza el estado de estudiantes
            setGrupo(prev => new Grupo(prev.id, prev.name, prev.lider, prev.major, updatedStudents)); // Actualiza el grupo
            setNewStudent({ name: '', age: '', major: '' }); // Reinicia los campos del formulario
        }
    };

    const handleGroupChange = (e) => {
        const { name, value } = e.target;
        if (name === 'groupName') {
            setGroupName(value);
            setGrupo(prev => new Grupo(prev.id, value, prev.lider, prev.major, prev.estudiantes)); // Actualiza el grupo
        } else if (name === 'groupLeader') {
            setGroupLeader(value);
            setGrupo(prev => new Grupo(prev.id, prev.name, value, prev.major, prev.estudiantes)); // Actualiza el grupo
        }
    };

    const handleGroupSubmit = async (e) => {
        e.preventDefault();
        console.log(grupo); // Imprime el objeto grupo en la consola

        try {
            const response = await GroupController.updateGroup(grupo); // Envía el grupo al controlador
            console.log('Grupo actualizado:', response); // Imprime la respuesta del servidor
        } catch (error) {
            console.error('Error al actualizar el grupo:', error); // Manejo de errores
        }
    };

    return (
        <div>
            <aside className="sidebar">
        <nav>
          <ul>
          <li><a href="/registro_Group_ind">Registro Grupo</a></li>
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
            <main className="content">
                
                <h1>Grupo: {grupo.name}</h1>
                <h3>Líder: {grupo.lider}</h3>
                <h3>Lista de Estudiantes</h3>

                <h3>Añadir Estudiante</h3>
                <form onSubmit={handleStudentSubmit}>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Nombre" 
                        value={newStudent.name} 
                        onChange={handleStudentChange} 
                        required 
                    />
                    <input 
                        type="number" 
                        name="age" 
                        placeholder="Edad" 
                        value={newStudent.age} 
                        onChange={handleStudentChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="major" 
                        placeholder="Especialidad" 
                        value={newStudent.major} 
                        onChange={handleStudentChange} 
                        required 
                    />
                    <button type="submit">Añadir Estudiante</button>
                </form>
                <h3>Actualizar Grupo</h3>
                <form onSubmit={handleGroupSubmit}>
                    <input 
                        type="text" 
                        name="groupName" 
                        placeholder="Nombre del Grupo" 
                        value={groupName} 
                        onChange={handleGroupChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="groupLeader" 
                        placeholder="Líder del Grupo" 
                        value={groupLeader} 
                        onChange={handleGroupChange} 
                        required 
                    />
                    <button type="submit">Actualizar Grupo</button>
                </form>
            </main>
        </div>
    );
};

export default GroupView;
