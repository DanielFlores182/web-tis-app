import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../controller/userContex'; 
import logo1 from '../images/dentall new 2.png'
import logo2 from '../images/dentall 1.png'

function Login() {
  const { setUsername } = useUser(); 
  const [username, setUsernameState] = useState('');
  const [clave, setClave] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Estado para manejar el cargando
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !clave) {
      setErrorMessage('Por favor, ingrese usuario y contraseña');
      return;
    }

    setLoading(true); // Activa el loading
    fetch('https://web-tis-app-production.up.railway.app/login_check.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, clave }),
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false); // Desactiva el loading
        if (data.role === 1) {
          setUsername(username);
          navigate('/menu_principal');
        } else if (data.role === 2) {
          setUsername(username);
          navigate('/menu_est', { state: { username } });
        } else {
          setErrorMessage('Usuario o contraseña incorrectos');
        }
      })
      .catch(error => {
        setLoading(false);
        setErrorMessage('Error en el servidor');
      });
  };

  return (
  <div className="login-wrapper">
   <img src={logo1} alt="Imagen izquierda" className="form-image left-image" />
    <div className="login-container">
      <h1 className="login-title">Iniciar Sesión</h1>
      <p className="login-subtitle">Inicia sesión en tu cuenta para continuar</p>
      <div className="bubble">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Usuario</label>
            <input
              type="text"
              id="username"
              placeholder="Ingrese su usuario"
              value={username}
              onChange={(e) => setUsernameState(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Ingrese su contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
    <img src={logo2} alt="Imagen derecha" className="form-image right-image" />
    </div>
  );
}

export default Login;
