import React from 'react';

function InformeOrdenes({ ordenes }) {
  return (
    <div className="informe-ordenes">
      <h1>Órdenes del Día</h1>
      <table>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Descripción</th>
            <th>Odontólogo</th>
            <th>Fecha de Entrega</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden) => (
            <tr key={orden.id}>
              <td>{orden.paciente}</td>
              <td>{orden.descripcion}</td>
              <td>{orden.odontologo}</td>
              <td>{orden.fecha_entrega}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InformeOrdenes;