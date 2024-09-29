import React, { useState } from 'react';
import './GruposMod.css';
import GroupController from '../../controller/groupController';

function GruposMod() {
  const [groupData, setGroupData] = useState({
    nombre: '',
    docente: '',
    descripcion: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData({ ...groupData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await GroupController.addGroup(groupData.nombre, groupData.docente, groupData.descripcion);
      setMessage(response.message || 'Error al agregar el grupo');
    } catch (error) {
      setMessage('Error en el servidor al agregar el grupo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-container">
      <main className="content">
        <h1>Registro de Nuevo Grupo</h1>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Grupo:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={groupData.nombre}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="docente">Docente del Grupo:</label>
            <input
              type="text"
              id="docente"
              name="docente"
              value={groupData.docente}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción del Grupo:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={groupData.descripcion}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {loading ? 'Cargando...' : 'Registrar Grupo'}
          </button>
          {message && <p>{message}</p>}
        </form>
      </main>
    </div>
  );
}

export default GruposMod;
