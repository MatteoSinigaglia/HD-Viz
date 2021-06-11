/* eslint-disable prefer-promise-reject-errors */
import Papa from 'papaparse';


export default class DatabaseLoaderController {

    constructor(store) {
        this.store = store;
        this.port = 5000;
    }

    async loadTable(table) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:${this.port}/api/getcontent/${table}`, {
                headers: { "authorization": `Bearer ${token}` }
            });
            const jsonData = await response.json();
            let dataString = Papa.unparse(jsonData);
            let result = Papa.parse(dataString, {
                delimiter: ',',
                dynamicTyping: true,
                error(error) {
                    console.error(error.message);
                }
            })
            if (result.data.length === 0) Promise.reject('La tabella selezionata non contiene dati');
            if (result.data.length > 2000) Promise.reject('La tabella selezionata è troppo grande');
            else { 
                this.store.loadData(result.data);
                Promise.resolve('Il caricamento è terminato con successo');
            }
        } catch (err) {
            console.error(err.message);
            Promise.reject(`Si è verificato un errore nella connessione al server`);
        }
    }

    async loadTableCols(table, selectedFeatures) {
        // array es: ['species','island','sex']
        if (!Array.isArray(selectedFeatures) || typeof table !== "string") {
            console.error({ error: "select table name and features" });
        } 
        const features = selectedFeatures.toString();
        const body = { features };
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:${this.port}/api/getselectedcol/${table}`, {
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                method: "POST"
            });
            const jsonData = await response.json();
            let dataString = Papa.unparse(jsonData);
            let result = Papa.parse(dataString, {
                delimiter: ',',
                dynamicTyping: true,
                error(error) {
                    console.error(error.message);
                }
            })
            if (result.data.length === 0) Promise.reject('La tabella selezionata non contiene dati');
            if (result.data.length > 2000) Promise.reject('La tabella selezionata è troppo grande');
            else { 
                this.store.loadData(result.data);
                Promise.resolve('Il caricamento è terminato con successo');
            }
        } 
        catch (err) {
            console.error(err.message);
            Promise.reject(`Si è verificato un errore nella connessione al server`);
        }
    }

}
