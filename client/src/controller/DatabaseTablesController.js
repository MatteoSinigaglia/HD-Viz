const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTk0NDQzMjB9.OhXJ3Rhs2I7SW1KzmHEtz9I-Zxpy5KZhDtrOaURpZRQ";

export default class DatabaseTablesController {

    constructor() {
        this.port = 5000;
    }

    async getTablesNames() {
        try {
            const response = await fetch(`http://localhost:${this.port}/tables/list`, {
                headers: { "authorization": `Bearer ${token}` }
            });
            const jsonData = await response.json();
            let tables = [];
            jsonData.forEach(e => tables.push(Object.values(e)));
            tables = tables.flat();
            console.log(tables)
            return tables;
        } catch (err) {
            return err.message;
        }
    }

    async getTableColumnsNames(table) {
        try {
            const response = await fetch(`http://localhost:${this.port}/tables/${table}/columnsnames`, {
                headers: { "authorization": `Bearer ${token}` }
            });
            const jsonData = await response.json();
            let columns = [];
            columns.push(Object.keys(jsonData[0]));
            columns = columns.flat();
            return columns ? columns : [];
        } catch (err) {
            return err.message;
        }
    }
}