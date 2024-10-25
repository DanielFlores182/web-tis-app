import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../controller/userContex'; // Importar el contexto

function Login() {
  const { setUsername } = useUser(); // Extraer setUsername del contexto
  const [username, setUsernameState] = useState(''); // Declarar username aquí
  const [clave, setClave] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8081/web-tis-app/backend/login_check.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, clave }), // Usar el username del estado
    })
      .then(response => response.json())
      .then(data => {
        if (data.role === 1) {
          setUsername(username); // Guardar username en el contexto
          navigate('/menu_doc');
        } else if (data.role === 2) {
          
          setUsername(username); // Guardar username en el contexto
          navigate('/menu_est', { state: { username } });
        } else {
          setErrorMessage('Usuario o contraseña incorrectos');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setErrorMessage('Error en el servidor');
      });
  };

  return (
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
              value={username} // Usar el valor del estado username
              onChange={(e) => setUsernameState(e.target.value)} // Cambia el valor aquí
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
          <button type="submit" className="login-button">Ingresar</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
