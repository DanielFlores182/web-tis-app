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
          navigate('/menu-docente'); // Redirigir a la página del administrador
        } else if (data.role === 2) {
          navigate('/menu-estudiante'); // Redirigir a la página de usuario
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
      <div className="bubble">
        <h1 className="login-title">Iniciar Sesión</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Ingrese su usuario" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Ingrese su contraseña" 
              value={clave} 
              onChange={(e) => setClave(e.target.value)} 
              required 
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
