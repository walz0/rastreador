const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const WebSocket = require('ws');
const axios = require('axios');
const parser = require('node-html-parser');
const he = require("he");

const port = 3000;

const empresas = [
    "Tresguerras",
    "Paquetexpress",
    "Potosinos",
    "Estafeta",
    "Otro",
];

app.use(express.static(path.join(__dirname, '/')));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

const wss = new WebSocket.Server({ port: 8080 });
let clients = new Set();
setInterval(() => {
    if (wss) {
        // broadcast to all clients
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                // broadcast chat message
                client.send(JSON.stringify({
                    "type": "ping"
                }));
            }
        });
    }
}, 15000);


wss.on('connection', (ws, req) => {
    // add client to set
    clients.add(ws);

    ws.on('message', (message) => {
        // client.send(...)
    });

    ws.on('close', () => {
        // Remove the client from the set when they disconnect
        clients.delete(ws);
    });
});

// Send html on '/'path
app.get('/', (req, res) => {
    res.sendStatus(200);
});

// "Tresguerras",
// "Paquetexpress",
// "Potosinos",
// "Estafeta",
// "Otro",

app.get('/tresguerras', (req, res) => {});

app.get('/paquetexpress', (req, res) => {});

app.get('/estafeta', (req, res) => {
    axios.get("https://cs.estafeta.com/es/Tracking/searchByGet?wayBill=3545762659&wayBillType=0&isShipmentDetail=False")
        .then((response) => {
            const history = parser.parse(response.data).querySelectorAll(".stateStatusDiv_4Items");
            history.forEach((item) => {
                const title = item.childNodes[1].getAttribute('title');
                console.log(title);
            });
            //res.send(he.decode(nodes.querySelector('.stateStatusDiv_4Items').innerHTML));
            res.send(response.data);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.post('/potosinos', (req, res) => {
    const guia = req.body.guia;
    console.log(guia);
    axios({
        method: 'POST',
        url: 'https://cotizador.potosinos.com.mx/php/ws.php?ws=wsRastreo',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
            "guia": guia
        }
    }).then((response) => {
        res.send(response.data);
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });
});

// Create the server and listen on port
http.createServer(app).listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
