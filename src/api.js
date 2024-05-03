const express = require("express");
const router = express.Router()
const { getPointId, getAllPoints, createPoint, getPoint, createConnection, setObstacle, getAllConnections } = require("../db/db_functions")

//////////////////////
/// create point /////
/////////////////////


router.post("/points", async (req, res) => {
    try {
        const { pointname } = req.body;



        // validate request body
        if (!pointname) {
            res.status(400).send({ message: "Pointname not provided" });
        }

        // check if exist
        const point = await getPoint(pointname);

        if (point) {
            res.status(400).send({ message: "Pointname is already exist" });
        } else {

            const result = await createPoint(pointname);
            // console.log(result)
            res.status(201).json(result);
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
});

/////////////////////////////
///// getting points ////////
////////////////////////////

router.get("/points", async (req, res) => {
    try {

        const result = await getAllPoints();
        res.json(result);

    } catch (error) {
        return res.status(500).send(error);
    }

})


/////////////////////////////
///// CREATE CONNECTIONS ////
////////////////////////////

router.post("/connections", async (req, res) => {
    try {
        const { fromPoint } = req.body;
        const neighbours = req.body.neighbours;
        const weight = req.body.weight;

        const point = await getPoint(fromPoint);
        console.log(point)

        if (!point) { await createPoint(fromPoint) }
        const toId = (await getPointId(neighbours)).id;
        const fromId = (await getPointId(fromPoint)).id;


        console.log(fromId, toId, weight);
        const result = await createConnection(fromId, toId, weight)
        res.status(201).json(result);

    } catch (error) {
        console.log(error)
        return res.status(500).send('postda ishlamadi');
    }
})

///////////////////////////
///// get connection //////
//////////////////////////



router.get("/connections", async (req, res) => {
    try {

        const result = await getAllConnections();
        res.json(result);

    } catch (error) {
        return res.status(500).send(error);
    }

})


router.post("/obstacle", async (req, res) => {
    try {
        const { from, to } = req.body();
        const result = await setObstacle(from, to);
        res.status(201).json(result);
    } catch (error) {
        return res.status(500).send('error');
    }
})
module.exports = { router };