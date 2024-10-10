import React, { useState } from 'react';
import './resultado_sem.css'; // Archivo CSS para los estilos

function ResultadoSem() {
const [showRegisterOptions, setShowRegisterOptions] = useState(false);

  // Función para alternar el submenú
const toggleRegisterOptions = () => {
    setShowRegisterOptions(!showRegisterOptions);
};

return (
    <div className="menu-container">
    <aside className="sidebar">
        <nav>
            <ul>
                <li>
                    <a href="#!" onClick={toggleRegisterOptions}>Registrar Estudiante</a>
                    {showRegisterOptions && (
                <ul className="submenu">
                <li><a href="/registro_est_lot">Registrar Por Lote</a></li>
                </ul>
                    )}
            </li>
            <li><a href="/perfil">Perfil</a></li>
            <li><a href="/doc_config">Configuraciones</a></li>
            <li><a href="/">Cerrar Sesion</a></li>
            </ul>
        </nav>
    </aside>
    <main className="content">
        <h1>Resultados semanales</h1>
        {/* contenido pagina */}
        <div className="options-container">
            <h2>Opciones</h2>
                <select>
                <option value="opcion1">Opción 1</option>
                <option value="opcion2">Opción 2</option>
                <option value="opcion3">Opción 3</option>
                </select>
</div>

        <div className="table-container">
        <h2>Tabla de Trabajo</h2>
        <table>
            <thead>
            <tr>
                <th>Integrantes</th>
                <th>Trabajo Asignado</th>
                <th>Trabajo Concluido</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Juan Pérez</td>
                <td>Diseño del frontend</td>
                <td>En progreso</td>
            </tr>
            <tr>
                <td>Maria López</td>
                <td>Base de datos</td>
                <td>Concluido</td>
            </tr>
            <tr>
                <td>Carlos Martínez</td>
                <td>Documentación</td>
                <td>Pendiente</td>
            </tr>
            </tbody>
        </table>
        </div>

    </main>
    </div>
);
}

export default ResultadoSem;
