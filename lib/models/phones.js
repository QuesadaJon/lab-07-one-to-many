const pool = require('../utils/pool');
const Color = require('./color');

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

    static async findById(id) {
      const { rows } = await pool.query(
        `
        SELECT 
          phones.*,
          array_to_json(array_agg(colors.*)) AS colors
        FROM 
        phones 
        JOIN colors
        ON phones.id = colors.phone_id
        WHERE phones.id=$1
        GROUP BY phones.id
        `,
        [id]
      );
      if(!rows[0]) throw new Error(`No phone with id of ${id} exists`);
      return {
        ...new Phone(rows[0]),
        colors: rows[0].colors.map(color => new Color(color))
      };
    }

    static async find() {
      const { rows } = await pool.query(
        'SELECT * FROM phones'
      );
      if(!rows[0]) throw new Error('No phones currently in directory');
      return rows.map(row => new Phone(row));
    }

    static async update(id, { name, brand, model }) {
      const { rows } = await pool.query(
        `UPDATE phones
          SET name=$1,
              brand=$2,
              model=$3
          WHERE id=$4
          RETURNING *`,
        [name, brand, model, id]
      );

      if(!rows[0]) throw new Error(`No phones with id of ${id} exists`);
      return new Phone(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM phones WHERE id=$1 RETURNING *',
        [id]
      );
  
      if(!rows[0]) throw new Error(`Phone with id ${id} exists`);
      return `phone with id of ${id} has been deleted`;
    }
};
