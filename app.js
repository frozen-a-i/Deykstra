const express = require('express');
const cors = require('cors');
const app = express();
const { router } = require('./src/api.js')

const PORT = 3000;
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/api", router);
// app.use()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});