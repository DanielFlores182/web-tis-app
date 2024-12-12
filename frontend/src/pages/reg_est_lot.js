import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './reg_est_lot.css'; // Asegúrate de tener este archivo para los estilos
import { FaFileExcel } from 'react-icons/fa'; // Icono de Excel usando react-icons (asegúrate de instalarlo)
import logo from '../images/logo.png';

const RegEstLot = () => {
    const [showRegisterOptions, setShowRegisterOptions] = useState(false);
    const [showCriteriosOptions, setShowCriteriosOptions] = useState(false);
    const toggleRegisterOptions = () => {
      setShowRegisterOptions(!showRegisterOptions); // Cambiar entre mostrar y ocultar
    }
    const toggleCriteriosOptions = () => {
      setShowCriteriosOptions(!showCriteriosOptions);
    };
    const [file, setFile] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert('Por favor, selecciona un archivo.');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                const studentData = {
                    nombres: row[0],
                    apellidos: row[1],
                    codsis: row[2],
                    carrera: row[3]
                };

                await fetch('https://web-tis-app-production.up.railway.app/reg_est_ind.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(studentData),
                })
                .then(response => response.json())
                .then(result => {
                    if (result.error) {
                        console.error('Error:', result.error);
                    } else {
                        console.log('Estudiante registrado:', result.message);
                    }
                })
                .catch(error => console.error('Error al registrar estudiante:', error));
            }
            setIsSubmitted(true);
            setFile(null); // Limpia el archivo seleccionado
            const redirect = window.confirm('Estudiante registrado exitosamente! ¿Quieres ir a la lista de estudiantes?');
            if (redirect) {
              window.location.href = '/lista_estudiantes';
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="menu-container">
        <aside className="sidebar">
          <img src={logo} alt="Logo de la Empresa" className="header-logo"></img>
          <h1 className="header-title">Docente</h1>
          <nav>
     <ul>
      <li>
        <a href="#!" onClick={toggleRegisterOptions}>Registrar Estudiante</a>
        {showRegisterOptions && (
          <ul className="submenu">
            <li><a href="/registro_est_ind">Registro Individual</a></li>
            <li><a href="/registro_est_lot">Registrar Por Lote</a></li>
          </ul>
        )}
      </li>
      <li>
        <a href="#!" onClick={toggleCriteriosOptions}>Criterios de Evaluación</a>
        {showCriteriosOptions && (
          <ul className="submenu">
            <li><a href="/Ver_criterios">Ver Criterios de Evaluación</a></li>
            <li><a href="/Reg_criterios">Registrar Criterios de Evaluación</a></li>
            <li><a href="/Val_criterios_eval">Validar Criterios de Evaluación de pares</a></li>
            <li><a href="/Val_criterios_auto">Validar Criterios de Autoevaluacion</a></li>
          </ul>
        )}
      </li>
      <li><a href="/perfil">Ver evaluaciones</a></li>
      <li><a href="/registro_eva">Programar evaluaciones</a></li>
      <li><a href="/">Cerrar Sesión</a></li>
    </ul>
  </nav>
            </aside>
            <main className="content card px-5">
                <div className="text-danger text-center">
                    <h2>Registro de Estudiantes por Lote</h2>
                </div>
                <div className="pb-5 text-center">
                    Suba un archivo Excel para registrar estudiantes por lote.
                </div>
                <div className="card-body background px-5 rounded">
                    <div className="mb-3">
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            disabled={isSubmitted}
                            className="form-control"
                        />
                    </div>
                    {file && (
                        <div className="file-info mt-3 d-flex align-items-center">
                            <FaFileExcel size={24} className="text-success me-2" />
                            <span>{file.name}</span>
                        </div>
                    )}
                    <button className="btn btn-primary mt-3" onClick={handleFileUpload} disabled={isSubmitted}>
                        {isSubmitted ? 'Archivo Subido' : 'Subir Archivo y Registrar'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default RegEstLot;
