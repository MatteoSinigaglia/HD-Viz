const express = require('express');
const router = express.Router();
const client = require("./db");

// get tables names
router.get("/list", async(req, res) => {
    try {
        const data = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
        res.json(data.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error: access to data denied');
    }
});

// get table columns names
router.get("/:table/columnsnames", async(req, res) => {
    try {
        const { table } = req.params;
        const data = await client.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table}';`);
        res.json(data.rows);
    } catch (err) {
        console.error(err.message);
        res.status(404).send('Server error: selected table doesn\'t exist');
    }
});

// get table content
router.get("/:table", async(req, res) => {
    try {
        const { table } = req.params;
        const data = await client.query(`SELECT * FROM ${table}`);
        res.json(data.rows);
    } catch (err) {
        console.error(err.message);
        res.status(404).send('Server error: selected table doesn\'t exist');
    }
});


// get selected columns
router.post("/:table/selectedcolumns", async (req, res) => {
    try{
        const {selectedField} = req.body;
        console.log(selectedField);
        const table = "iris";
        const Query = columns => columns.map(c => c).join();

        if(!table){
            res.status(400).send({msg:'select table name'});
        }
        else if(selectedField.length === 0){
            res.status(400).send({msg:'select some columns'});
        }
        else{
            const data = await client.query(`SELECT ${Query(selectedField)} FROM ${table}`);
            res.json(data.rows);
        }
    }catch(err){
        console.error(err.message);
        res.status(404).send('Server error: selected table doesn\'t exist');
    }
});


// delete table
router.delete("/:table", async (req, res) => {
    try {
        const { table } = req.params;
        await client.query( `DROP TABLE ${table};` );
        res.json(`The table ${table} was deleted`);
    } catch (err) {
        console.error(err.message);
        res.status(404).send('Server error: selected table doesnt exist');
    }
});

module.exports = router;