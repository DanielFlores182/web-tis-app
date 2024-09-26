import React from 'react';
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      <div className="bubble"> {/* Burbuja blanca */}
        <h1 className="login-title">Iniciar Sesión</h1>
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input type="text" id="username" placeholder="Ingrese su usuario" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" placeholder="Ingrese su contraseña" required />
          </div>
          <button type="submit" className="login-button">Ingresar</button>
          <div className="forgot-password">
            <a href="Con_olvidado">¿Olvidaste tu contraseña?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

