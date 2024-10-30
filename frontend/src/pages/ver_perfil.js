import React, { useState, useEffect } from 'react'; // Importa useEffect
import { useNavigate ,useParams} from 'react-router-dom'; // Importa useParams y useNavigate
import './ver_perfil.css';

function VerPerfil() {
    const navigate = useNavigate();
    const { idEstudiante } = useParams();
    //const idEstudiante = 21;
    const [estudiante, setEstudiante] = useState({ nombre: '', apellido: '' });
    const [tareas, setTareas] = useState([]);

    // Llamar al backend para obtener el nombre y las tareas del estudiante
    useEffect(() => {
      if (idEstudiante) {
      fetch(`http://localhost:8081/web-tis-app/backend/obtener_est.php?id=${idEstudiante}`)
       .then(response => response.json())
       .then(data => {
          setEstudiante({
            nombre: data.nombre, 
            apellido: data.apellido
          });

          const tareasConEstado = data.tareas.map(tarea => ({
            id_tarea: tarea.id_tarea,
            nombre: tarea.detalle,
            estado: tarea.entregado ? "Entregado" : "Sin entregar"
    
        }));
        setTareas(tareasConEstado || []);
        console.log("Estado de tareas después de setTareas:", tareasConEstado);
       })
        .catch(error => console.error('Error al obtener datos:', error));
      }
    }, [idEstudiante]);
  
    const handleVerTarea = (idTarea) => {
      navigate(`/ver_tarea/${idTarea}`); // Redirige a la página de detalles de la tarea
    };

    const handleVerPlanilla = () => {
      navigate('/planilla', { state: { tareas } }); // Redirige a la ruta "/planilla"
    };
  
    return (
      <div className="perfil-container">
        <h2 className="titulo">{estudiante.nombre} {estudiante.apellido}</h2>
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
              <button className="btn-ver" onClick={() => handleVerTarea(tarea.id_tarea)}>
                Ver
              </button>
            </div>
          ))
        )}
        </div>
        <div className="botones">
          <button className="btn" onClick={handleVerPlanilla}>
            Ver planilla
          </button>

        </div>
      </div>
    );
  }

export default VerPerfil;