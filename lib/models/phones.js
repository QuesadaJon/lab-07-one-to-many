const pool = require('../utils/pool');

module.exports = class Phone {
    id;
    name;
    brand;
    model;

    constructor(row) {
        this.id = row.id;
        this.name = row.name;
        this.brand = row.brand;
        this.model = row.model;
    }

    static async insert({ name, brand, model }) {
        const { rows } = await pool.query(
            'INSERT INTO phones (name, brand, model) VALUES($1, $2, $3) RETURNING *',
            [name, brand, model]
        );

        return new Phone(rows[0]);
    }
};
