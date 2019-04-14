const keys = require("./keys");

// Express app setup

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgress client setup

const { Pool } = require("pg");
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on("error", () => console.log("Lost PG connection!"));

pgClient.query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.log(err));


// Redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
    host: keys.redisHosts,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get("/", (req, res) => {
    // res.send("Hi all");
    res.send(req.url);
});

app.get("/values/all", async (_req, res) => {
    const values = await pgClient.query("SELECT * FROM values");
    res.send(values.rows);
});

app.get("/values/current", async (_req, res) => {
    // eslint-disable-next-line handle-callback-err
    redisClient.hgetall("values", (_err, values) => {
        res.send(values);
    });
});

app.post("/values", async (req, res) => {
    const index = req.body.index;
    console.log("Received index ", index);
    if (parseInt(index) > 40) {
        return res.status(422).send("Index too high!");
    }

    redisClient.hset("values", index, "Nothing yet!");
    redisPublisher.publish("insert", index);
    pgClient.query("INSERT INTO values (number) VALUES($1)", [index]);

    res.send({ working: true });
});

app.listen(5000, _err => {
    console.log('Listening');
});