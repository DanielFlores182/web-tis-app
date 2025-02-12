import React, { useState, useEffect } from 'react';
import './nueva_orden.css';
import logo from '../../images/dentall 1.png';

function NuevaOrden() {
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const [showCriteriosOptions, setShowCriteriosOptions] = useState(false);

  const toggleRegisterOptions = () => {
    setShowRegisterOptions(!showRegisterOptions);
  };

  const toggleCriteriosOptions = () => {
    setShowCriteriosOptions(!showCriteriosOptions);
  };

  // Estados para los datos del formulario
  const [formData, setFormData] = useState({
    clinica: '',
    odontologo: '',
    direccion: '',
    telefono: '',
    descripcion: '',
    paciente: '',
    colorimetro: '',
    urgente: false,
    entregado: false,
    fechaRecibo: '',
    fechaEntrega: '',
    edad: '',
    sexo: '',
    ingresa: {
      Antagonista: false,
      Articulador: false,
    },
    implante: {
      Transfer: false,
      Análogo: false,
      Tornillo: false,
      Uclas: false,
      Otros: false,
    },
    caraoclusal: {
      Si: false,
      No: false,
    },
    zonacervical: {
      Oscura: false,
      Normal: false,
    },
    incisal: {
      Translucida: false,
      Normal: false,
    },
    mamelones: {
      Si: false,
      No: false,
    },
  });

  // Estados para las sugerencias de autocompletado
  const [clinicas, setClinicas] = useState([]);
  const [clinicaSuggestions, setClinicaSuggestions] = useState([]);
  const [direccionSuggestions, setDireccionSuggestions] = useState([]);
  const [telefonoSuggestions, setTelefonoSuggestions] = useState([]);

  // Obtener datos de clínicas al cargar el componente
  useEffect(() => {
    const fetchClinicas = async () => {
      try {
        const response = await fetch('https://web-tis-app-production.up.railway.app/get_clinicas.php');
        const data = await response.json();
        if (Array.isArray(data)) {
          // Convertir las cadenas JSON en arrays
          const clinicasFormateadas = data.map((clinica) => ({
            ...clinica,
            direccion: JSON.parse(clinica.direccion),
            telefono: JSON.parse(clinica.telefono),
          }));
          setClinicas(clinicasFormateadas);
        } else {
          console.error('Error: La respuesta de clínicas no es un array');
        }
      } catch (error) {
        console.error('Error al obtener clínicas:', error);
      }
    };

    fetchClinicas();
  }, []);

  // Manejar cambios en el campo de clínica
  const handleClinicaChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, clinica: value });

    // Filtrar sugerencias de clínicas
    const suggestions = clinicas.filter((clinica) =>
      clinica.nombre.toLowerCase().includes(value.toLowerCase())
    );
    setClinicaSuggestions(suggestions);

    // Si se selecciona una clínica, mostrar sugerencias de direcciones y teléfonos
    if (suggestions.length === 1) {
      const clinicaSeleccionada = suggestions[0];
      setDireccionSuggestions(clinicaSeleccionada.direccion || []);
      setTelefonoSuggestions(clinicaSeleccionada.telefono || []);
    } else {
      setDireccionSuggestions([]);
      setTelefonoSuggestions([]);
    }
  };

  // Manejar clic en una sugerencia de clínica
  const handleClinicaSuggestionClick = (clinica) => {
    setFormData({
      ...formData,
      clinica: clinica.nombre,
      direccion: clinica.direccion?.[0] || '', // Tomar la primera dirección
      telefono: clinica.telefono?.[0] || '', // Tomar el primer teléfono
    });
    setClinicaSuggestions([]);
  };

  // Manejar clic en una sugerencia de dirección
  const handleDireccionSuggestionClick = (direccion) => {
    setFormData({ ...formData, direccion });
  };

  // Manejar clic en una sugerencia de teléfono
  const handleTelefonoSuggestionClick = (telefono) => {
    setFormData({ ...formData, telefono });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    alert('Formulario enviado exitosamente.');
  };

  return (
    <div className="menu-container">
      <aside className="sidebar">
        <img src={logo} alt="Logo de la Empresa" className="header-logo" />
        <h1 className="header-title">Menu</h1>
        <nav>
          <ul>
            <li><a href="/nueva_orden">Nueva Orden</a></li>
            <li>
              <a href="#!" onClick={toggleRegisterOptions}>Buscador</a>
              {showRegisterOptions && (
                <ul className="submenu">
                  <li><a href="/registro_est_ind">Trabajos</a></li>
                  <li><a href="/registro_est_lot">Contactos</a></li>
                </ul>
              )}
            </li>
            <li>
              <a href="#!" onClick={toggleCriteriosOptions}>Pendientes</a>
              {showCriteriosOptions && (
                <ul className="submenu">
                  <li><a href="/Ver_criterios">Trabajos regulares</a></li>
                  <li><a href="/Reg_criterios">Urgentes</a></li>
                  <li><a href="/Val_criterios_eval">Encargo especiales</a></li>
                  <li><a href="/Val_criterios_auto">Largo Plazo</a></li>
                </ul>
              )}
            </li>
            <li><a href="/registro_eva">Notas</a></li>
            <li><a href="/registro_eva">Configuracion</a></li>
            <li><a href="/">Cerrar Sesión</a></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <h1>Registrar Nueva Orden de Trabajo</h1>
        <form onSubmit={handleSubmit} className="register-form">
          {/* Campo de clínica con autocompletado */}
          <div className="form-group">
            <label htmlFor="clinica">Clínica:</label>
            <div className="autocomplete-container">
              <input
                type="text"
                id="clinica"
                name="clinica"
                value={formData.clinica}
                onChange={handleClinicaChange}
                required
              />
              {clinicaSuggestions.length > 0 && (
                <ul className="list-group mt-1">
                  {clinicaSuggestions.map((clinica, index) => (
                    <li
                      key={index}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleClinicaSuggestionClick(clinica)}
                    >
                      <strong>{clinica.nombre}</strong>
                      <div>
                        <small>Direcciones: {clinica.direccion?.join(', ')}</small>
                      </div>
                      <div>
                        <small>Teléfonos: {clinica.telefono?.join(', ')}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Campo de dirección con sugerencias */}
          <div className="form-group">
            <label htmlFor="direccion">Dirección:</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              required
            />
            {direccionSuggestions.length > 0 && (
              <ul className="list-group mt-1">
                {direccionSuggestions.map((direccion, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleDireccionSuggestionClick(direccion)}
                  >
                    {direccion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Campo de teléfono con sugerencias */}
          <div className="form-group">
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              required
            />
            {telefonoSuggestions.length > 0 && (
              <ul className="list-group mt-1">
                {telefonoSuggestions.map((telefono, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleTelefonoSuggestionClick(telefono)}
                  >
                    {telefono}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Resto del formulario */}
          {/* ... (mantén el resto de los campos del formulario) ... */}

          <button type="submit" className="submit-button">Registrar</button>
        </form>
      </main>
    </div>
  );
}

export default NuevaOrden;