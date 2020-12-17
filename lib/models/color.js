const pool = require('../utils/pool');

module.exports = class Color {
  id;
  color;
  phoneId;

  constructor(row) {
    this.id = String(row.id);
    this.color = row.color;
    this.phoneId = String(row.phone_id);
  }

  static async insert({ color, phoneId }) {
    const { rows } = await pool.query(
      'INSERT INTO colors (color, phone_id) VALUES ($1, $2) RETURNING *',
      [color, phoneId]
    );

    return new Color(rows[0]);
  }
};
