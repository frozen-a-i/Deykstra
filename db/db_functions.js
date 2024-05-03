const { knex } = require("./knex");

async function createPoint(pointname) {

    return knex("pointss").insert({
        point_name: pointname
    });
}

async function createConnection(from, topoint, weight) {

    const data = [];
    // for (let i = 0; i < topoint.length; i++) {
    const obj = { from_point_id: from, to_point_id: topoint, weight: weight, status: 1 }
    data.push(obj)
    console.log(data)
    // }

    return await knex("connectionGraph")
        .insert(data)
        .then(() => console.log('Multiple rows inserted successfully'))
        .catch((error) => { console.error('Error inserting rows', error); })
}

async function getAllPoints() {
    return await knex('pointss').select('point_name');
}
async function getPoint(point_name) {
    return await knex('pointss').select('*').where({ point_name: point_name }).first();
}

async function getPointId(point_name) {
    return await knex('pointss').select('id').where({ point_name: point_name }).first();
}

async function getAllConnections() {
    return await knex('connectionGraph').select('*')
}
async function setObstacle(from, to) {
    return await knex('connectionGraph')
        .select('id', 'status')
        .where({ from_point_id: from } && { to_point_id: to })
        .update({ status: 0 })
        .then(() => console.log('Obstacle set successfully'))
        .catch((error) => { console.error('Error setting obstacle', error); })

}
module.exports = { createPoint, getAllPoints, getPoint, createConnection, setObstacle, getAllConnections, getPointId }