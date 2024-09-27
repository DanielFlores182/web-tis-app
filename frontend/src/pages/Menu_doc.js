import React from 'react';
import './Menu_doc.css';

function MenuDoc() {
  return (
    <div className="menu-container">
      <aside className="sidebar">
        <nav>
          <ul>
            <li><a href="/registrar_est">Registrar Estudiante</a></li>
            <li><a href="/perfin">Perfil</a></li>
            <li><a href="/doc_config">Configuraciones</a></li>
            <li><a href="/">Cerrar Sesion</a></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <h1>Bienvenido al menú principal</h1>
        <h3>Esta es la pagina principal para Docentes para el control de la materia TIS</h3>
        <p>Selecciona una opción de la barra de navegación.</p>
      </main>
    </div>
  );
}

export default MenuDoc;
