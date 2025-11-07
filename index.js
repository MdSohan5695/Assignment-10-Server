

const express = require('express');
const cors = require('cors');
const app = express()
const port = 4000
// process.env.PORT || 3000;

app.use(cors());
app.use(express.json())

app.get("/",(req,res) => {
    res.send("Assignment 10 server")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
