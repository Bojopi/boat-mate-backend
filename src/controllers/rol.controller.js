const pool = require('../db')

const getAllRoles = async (req, res) => {
    const response = await pool.query('SELECT * FROM role');
    res.send(response.rows)
    console.log(response.rows)
}

const getRole = async (req, res) => {
    res.send('retireving a role')
}

module.exports = {
    getAllRoles,
    getRole
}

