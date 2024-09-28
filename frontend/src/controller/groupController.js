// src/controller/groupController.js
const GroupController = {

    // Otras funciones de tu controlador
    async updateGroup(grupo) {
        try {
            const response = await fetch('URL_DEL_TU_API', {
                method: 'POST', // o 'PUT' si es una actualización
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(grupo),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al enviar el grupo:', error);
            throw error;
        }
    },

    async getGroupByLeader(leaderName) {
        // Datos simulados
        const groups = [
            {
                id: 1,
                name: 'Rene Angosta',
                lider: 'Rene Angosta',
                estudiantes: [
                    { id: 1, name: 'Juan Pérez', email: 'juan.perez@example.com' },
                    { id: 2, name: 'Ana García', email: 'ana.garcia@example.com' },
                ],
            },
            {
                id: 2,
                name: 'Carlos Perez',
                lider: 'Carlos Perez',
                estudiantes: [
                    { id: 3, name: 'Carlos López', email: 'carlos.lopez@example.com' },
                    { id: 4, name: 'Lucía Fernández', email: 'lucia.fernandez@example.com' },
                ],
            },
            {
                id: 3,
                name: 'Ana Saenz',
                lider: 'Ana Saenz',
                estudiantes: [
                    { id: 5, name: 'Carlos López', email: 'carlos.lopez@example.com' },
                    { id: 6, name: 'Lucía Fernández', email: 'lucia.fernandez@example.com' },
                    { id: 7, name: 'Carlos López', email: 'carlos.lopez@example.com' },
                    { id: 8, name: 'Lucía Fernández', email: 'lucia.fernandez@example.com' },
                ],
            },
        ];

        // Filtramos el grupo que corresponde al líder seleccionado
        const grupo = groups.find(g => g.lider === leaderName);

        // Simulamos un retraso de red
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (grupo) {
                    resolve(grupo);
                } else {
                    reject('Grupo no encontrado');
                }
            }, 500);
        });
    },

    /*
    async getGroupByLeader(leaderName) {
        try {
            const response = await fetch(`URL_DEL_TU_API/grupo?leader=${leaderName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener el grupo:', error);
            throw error;
        }
    },*/
};

export default GroupController;
