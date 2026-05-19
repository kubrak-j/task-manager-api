import express from "express";

const app = express();
const port = 8000;

app.listen(8000, () => {
    console.log(`The server is running`);
    console.log(`listening on port ${port}`);
});

app.get(`/`, (req, res) => {
    res.send(`hello world!`);
});
