import React, { useState, useEffect } from 'react'; // Importa useEffect
import { useNavigate, useParams } from 'react-router-dom'; // Importa useParams y useNavigate
import './ver_perfil.css';

function VerPerfil() {
    const navigate = useNavigate();
    const { idEstudiante } = useParams(); // Obtener el ID del estudiante desde la URL
    const [nombreEstudiante, setNombreEstudiante] = useState('');
    const [tareas, setTareas] = useState([]);

    // Llamar al backend para obtener el nombre y las tareas del estudiante
    useEffect(() => {
      fetch(`http://localhost/backend/obtener_estudiante.php?id=${idEstudiante}`)
       .then(response => response.json())
       .then(data => {
          setNombreEstudiante(data.nombre);
          setTareas(data.tareas);
        })
        .catch(error => console.error('Error al obtener datos:', error));
    }, [idEstudiante]);
  
    const handleVerTarea = (idTarea) => {
      navigate(`/ver_tarea/${idTarea}`); // Redirige a la página de detalles de la tarea
    };
  
    const handleAgregarTarea = () => {
      // Lógica para agregar una nueva tarea
      setTareas([...tareas, { nombre: '', estado: '' }]);
    };

    const handleVerPlanilla = () => {
      navigate('/planilla', { state: { tareas } }); // Redirige a la ruta "/planilla"
    };
  
    return (
      <div className="perfil-container">
        <h2 className="titulo">{nombreEstudiante}</h2>
        <div className="tareas-container">
          <h3 className="subtitulo">Tareas Asignadas Individuales</h3>
          {tareas.length === 0 ? (
          <p>Sin tareas</p> // Mostrar este mensaje si no hay tareas
          ) : (
          tareas.map((tarea, index) => (
            <div key={index} className="tarea">
              <span>{tarea.nombre}:</span>
              <span className={tarea.estado === 'Entregado' ? 'entregado' : 'sin-entregar'}>
                {tarea.estado}
              </span>
              <button className="btn-ver" onClick={() => handleVerTarea(tarea.id)}>
                Ver
              </button>
            </div>
          ))
        )}
        </div>
        <div className="botones">
          <button className="btn" onClick={handleAgregarTarea}>
            Agregar Tarea
          </button>
          <button className="btn" onClick={handleVerPlanilla}>
            Ver planilla
          </button>

        </div>
      </div>
    );
  }

export default VerPerfil;