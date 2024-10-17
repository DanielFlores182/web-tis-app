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
            <h2>Seleccione el grupo</h2>
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
                    <th>Nombre del equipo</th>
                    <th>Estado de evaluación</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Equipo Alpha</td>
                    <td><span className="estado-pendiente">Pendiente</span></td> 
                    <td>11/10/2024</td>
                    <td><button className="btn-ver-actas">Ver Actas</button> </td>
                    </tr>
                    <tr>
                    <td>Equipo Beta</td>
                    <td><span className="estado-completado">Completado</span> </td>
                    <td>18/10/2024</td>
                    <td><button className="btn-ver-actas">Ver Actas</button> </td>
                    </tr>
                    <tr>
                    <td>Equipo Omega</td>
                    <td><span className="estado-atrasado">Atrasado</span> </td>
                    <td>25/10/2024</td>
                    <td><button className="btn-ver-actas">Ver Actas</button></td>
                    </tr>
                </tbody>
                </table>
</div>

    </main>
    </div>
);
}

export default ResultadoSem;
