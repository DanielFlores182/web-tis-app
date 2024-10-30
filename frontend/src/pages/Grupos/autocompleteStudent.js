import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentAutocomplete = () => {
    const [studentName, setStudentName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [studentsList, setStudentsList] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://web-tis-app-production.up.railway.app/obtener_estudiantes.php');
                const data = await response.json();
                setStudentsList(data.map(student => student.username)); // Extraer solo los nombres
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        setStudentName(value);

        if (value.length > 0) {
            const filteredSuggestions = studentsList.filter(student =>
                student.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setStudentName(suggestion);
        setSuggestions([]);
    };

    return (
        <div>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={studentName}
                    onChange={handleChange}
                    placeholder="Nombre del estudiante"
                />
            </div>
            {suggestions.length > 0 && (
                <ul className="list-group">
                    {suggestions.map((suggestion, index) => (
                        <li 
                            key={index} 
                            className="list-group-item list-group-item-action" 
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StudentAutocomplete;
