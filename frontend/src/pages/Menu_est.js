import React from 'react';
import './Menu_est.css';

function MenuEst() {
  return (
    <div className="menu-container">
      <aside className="sidebar">
        <nav>
          <ul>
            <li><a href="/registrar_grupo">Registrarse en grupos</a></li>
            <li><a href="/perfin">Perfil</a></li>
            <li><a href="/est_config">Configuraciones</a></li>
            <li><a href="/evaluacion_semanal">Evaluación Semanal</a></li>
            <li><a href="/">Cerrar Sesion</a></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <h1>Bienvenido al menú principal</h1>
        <h3>Esta es la pagina principal para Estudiante para la materia TIS</h3>
        <p>Selecciona una opción de la barra de navegación.</p>
      </main>
    </div>
  );
}

export default MenuEst;
