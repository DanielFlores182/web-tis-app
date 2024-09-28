// src/models/Group.js
class Grupo {
    constructor(id, name, lider, estudiantes = []) {
        this.id = id;
        this.name = name;
        this.lider = lider;
        this.estudiantes = estudiantes;
    }
    addStudent(student) {
        this.estudiantes.push(student);
    }

    removeStudent(studentId) {
        this.estudiantes = this.estudiantes.filter(student => student.id !== studentId);
    }

    getStudents() {
        return this.estudiantes;
    }
}

export default Grupo;