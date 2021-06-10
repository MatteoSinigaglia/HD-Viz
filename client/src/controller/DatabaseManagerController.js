/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable consistent-return */

export default class DatabaseManagerController {

    constructor() {
        this.port = 5000;
    }

    async upload(table, file) {
        if (file.size > 0 && file.size < 50000) {
            try {
                const token = localStorage.getItem('token');
                const formData = new FormData();
                formData.append("file", file);
        
                const response = await fetch(`http://localhost:${this.port}/api/upload/${table}`, {
                    body: formData,
                    headers: { "authorization": `Bearer ${token}` },
                    method: "POST"
                });
                const jsonData = await response.json();
                if (response.ok) return Promise.resolve(`Aggiunto dataset ${table}`);
                return Promise.reject(jsonData);
            } catch (err) {
                console.error(err.message);
                err.message = `Si è verificato un errore: ${err.message}`;
                return Promise.reject(err);
            }
        }
        else {
            return Promise.reject(new Error("Il file è troppo grande"));
        }
    }

    async deleteTable(table) {
        try {
            const token = localStorage.getItem('token');
            const delTable = await fetch(`http://localhost:${this.port}/api/delete/${table}`, { 
                headers: { "authorization": `Bearer ${token}` },
                method: "DELETE"
            });
            const jsonData = await delTable.json();
            if (delTable.ok) return Promise.resolve(`Dataset ${table} eliminato`);
            Promise.reject(jsonData);
        } catch (err) {
            console.error(err.message);
            err.message = `Si è verificato un errore: ${err.message}`;
            return Promise.reject(err);
        }
    }
}