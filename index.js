const express = require('express')
const path = require('path');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());

const indexPage = path.join(__dirname, "public/index.html")

app.use(express.static(path.join(__dirname, "public")))

const { MongoClient } = require("mongodb");
const uri = "mongodb://myUserAdmin:myUserAdmin@localhost:27017";
//"mongodb+srv://myUserAdmin:myUserAdmin@cluster0.23cm6.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

app.post('/heroes/create', async(req, res) => {
    const heroes = req.body;
    await client.connect();
    await client.db('mydb').collection('heroes').insertOne({
        name: heroes.name,
        type: heroes.type,
        atkrange: heroes.atkrange
    });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": heroes.name + " is created",
        "heroes": heroes
    });
})

app.get('/heroes', async(req, res) => {
    await client.connect();
    const heroes = await client.db('mydb').collection('heroes').find({}).toArray();
    await client.close();
    res.status(200).send(heroes);
})
app.get('/heroes/:name', async(req, res) => {
    const name = req.params.name
    await client.connect();
    const hero = await client.db('mydb').collection('heroes').find({ "name": name }).toArray();
    await client.close();
    res.status(200).send({
        "status": "ok",
        "hero": hero
    });
})

app.put('/heroes/update', async(req, res) => {
    const hero = req.body;
    await client.connect();
    await client.db('mydb').collection('heroes').updateOne({ 'name': hero.name }, {
        "$set": {
            name: hero.name,
            type: hero.type,
            atkrange: hero.atkrange
        }
    });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": hero.name + " is updated",
        "hero": hero
    });
})

app.delete('/heroes/delete', async(req, res) => {
    const hero = req.body;
    await client.connect();
    await client.db('mydb').collection('heroes').deleteOne({ "name": hero.name });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": `${hero.name} was deleted`
    });
    console.log(hero.name);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})