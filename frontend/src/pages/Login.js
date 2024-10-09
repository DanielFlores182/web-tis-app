import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom'; // Necesario para redireccionar

function Login() {
  const [username, setUsername] = useState('');
  const [clave, setClave] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error
  const navigate = useNavigate(); // Hook para redireccionar

  const handleSubmit = (e) => {
    e.preventDefault();
    // Enviar datos al backend
    fetch('http://localhost:8081/web-tis-app/backend/login_check.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, clave }),
    })
      .then(response => response.json())
      .then(data => {
        // Verificar la respuesta del backend
        if (data.role === 1) {
          navigate('/menu_doc'); // Redirigir a la página del administrador
        } else if (data.role === 2) {
          navigate('/menu_est', { state: { username } }); // Redirigir a la página de usuario
        } else if (data.role === 0) {
          setErrorMessage('Usuario o contraseña incorrectos'); // Mostrar mensaje de error
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
      <p className="login-subtitle">Inicia sesión en tu cuenta para continuar
      </p>
      <div className="bubble">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Usuario</label>
            <input 
              type="text"
              id="username" 
              placeholder="Ingrese su usuario" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
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
          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Mensaje de error */}
        </form>
      </div>
    </div>
  );
}

export default Login;
