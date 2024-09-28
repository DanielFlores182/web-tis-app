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
};

export default GroupController;
