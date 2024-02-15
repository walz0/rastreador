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

const port = 3001;

const paqueterias = {
    "Tresguerras": "https://www.tresguerras.com.mx/3G/tracking.php#",
    "Paquetexpress": "https://www.paquetexpress.com.mx/rastreo/",
    "Potosinos": "https://paqueteriapotosinos.com.mx/potosinos-rastreo/",
    "Estafeta": `https://cs.estafeta.com/es/Tracking/searchByGet?wayBill=${''}&wayBillType=1&isShipmentDetail=False`,
    "Otro": undefined
};

// Cookie for getting tracking history from estafeta, should probably get
// renewed if its more than 5 min old
var estafetaCookie = {
    "cookie": "",
    "timestamp": 0
};

/*
{
    "guia": "",
    "embarcada": "",
    "entregada": "",
    "id": "",
    "historia": {
        {
            "estado": "",
            "sucursal": "",
            "fecha": "",
        },
        ...
    }
}


*/

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

function getMonth(month) {
    const months = {
        'enero': 0,
        'febrero': 1,
        'marzo': 2,
        'abril': 3,
        'mayo': 4,
        'junio': 5,
        'julio': 6,
        'agosto': 7,
        'septiembre': 8,
        'octubre': 9,
        'noviembre': 10,
        'diciembre': 11
    };

    console.log(month);

    return months[month.toLowerCase()];
}

function saveOrden(orden) {
    // Check if the file exists
    if (!fs.existsSync("./data/ordenes.json")) {
        // If the file doesn't exist, create it and write content
        console.log("creatinf file.");
        let data = {};
        data[orden] = {};
        fs.writeFileSync("./data/ordenes.json", JSON.stringify(data));
    } else {
        let data = JSON.parse(fs.readFileSync("./data/ordenes.json"));
        data[orden] = {};
        fs.writeFileSync("./data/ordenes.json", JSON.stringify(data));
    }
}

function removeOrden() {
    
}

// "Tresguerras",
// "Paquetexpress",
// "Potosinos",
// "Estafeta",
// "Otro",

app.post('/tresguerras', async (req, res) => {
    /*
    TRESGUERRAS
    POST https://www.tresguerras.com.mx/3G/assets/Ajax/tracking_Ajax.php
    url-encoded form
        idTalon: CAN00150388
        action: Talones
        esKiosko: false


    */

    const guia = req.body.guia;
    const orden = req.body.orden;
    const fecha = req.body.fecha;

    await axios({
        method: 'POST',
        url: 'https://www.tresguerras.com.mx/3G/assets/Ajax/tracking_Ajax.php',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
            "idTalon": guia,
            "action": 'Talones',
            "esKiosko": false,
        }
    }).then((response) => {
        const doc = parser.parse(response.data);

        let estado;
        let history = doc.querySelectorAll("tr").slice(1);
        const guia = doc.querySelector("h2").innerText.split(": ")[1];

        history = history.map(row => {
            const cols = row.childNodes.filter(col => {
                if (col.innerText.trim() !== '') {
                    return col;
                }
            });

            const fecha = cols[2].innerText.trim().replace(/ +/g, ' ');
            // Parse parts of date
            const year = parseInt(fecha.split(' ')[5]);
            const month = getMonth(fecha.split(' ')[3]);
            const day = parseInt(fecha.split(' ')[1]) - 1;
            const hours = parseInt(fecha.split(' ')[6].split(':')[0]);
            const min = parseInt(fecha.split(' ')[6].split(':')[1]);
            // Get timestamp
            const fechahora = new Date(year, month, day, min, 0, 0).getTime();

            // Get lastest status
            estado = cols[0].innerText.trim();

            return {
                "estado": cols[0].innerText.trim(),
                "sucursal": cols[1].innerText.trim(),
                "fechahora": fechahora
            }
        });
        const delivered = true;

        res.send({
            "paqueteria": "TRESGUERRAS",
            "orden": orden,
            "fecha": fecha,
            "guia": guia,
            "estado": estado,
            "embarcada": history[0]["fechahora"],
            "entregada": delivered ? history[history.length - 1]["fechahora"] : undefined,
            "historia": history 
        });
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });

    //res.sendStatus(200);
});

app.post('/paquetexpress', async (req, res) => {
/*
PAQUETEXPRESS API

https://cc.paquetexpress.com.mx/ptxws/rest/api/v1/guia/historico/ultimoevento/CJS01AA0287071/@1@2@3@4@5?source=WEBPAGE

https://cc.paquetexpress.com.mx/ptxws/rest/api/v1/guia/historico/CJS01AA0287071/@1@2@3@4@5?source=WEBPAGE

https://cc.paquetexpress.com.mx/ptxws/rest/api/v1/entrega/firma/CJS01AA0287071/@1@2@3@4@5?source=WEBPAGE

https://cc.paquetexpress.com.mx/ptxws/rest/api/v1/entrega/acuse/CJS01AA0287071/@1@2@3@4@5?source=WEBPAGE

https://cc.paquetexpress.com.mx/ptxws/rest/api/v1/sucursal/CJS01/@1@2@3@4@5?source=WEBPAGE

https://cc.paquetexpress.com.mx/ptxws/rest/api/v1/sucursal/MEX03/@1@2@3@4@5?source=WEBPAGE
*/
    // CJS01AA0287455
    const guia = req.body.guia;
    const orden = req.body.orden;
    const fecha = req.body.fecha;

    await axios.get(`https://cc.paquetexpress.com.mx/ptxws/rest/api/v1/guia/historico/${guia}/@1@2@3@4@5?source=WEBPAGE`)
        .then((response) => {
            let history = JSON.parse(response.data.split("Resultado(")[1].substring(0, response.data.split("Resultado(")[1].length - 1));
            const guia = history[0]['guia'];
            const delivered = history[history.length - 1]["eventoId"] == "BDL";
            const estado = history[history.length - 1]["status"];

            history = history.map(row => {
                return {
                    "estado": row["status"].toUpperCase(),
                    "sucursal": row["sucursal"],
                    "fechahora": row["fechahora"] 
                }
            });

            console.log(response.data);
            // si eventoId es "BDL" el paquete esta entregado
            res.send({
                "paqueteria": "Paquetexpress",
                "orden": orden,
                "fecha": fecha,
                "estado": estado.toUpperCase(),
                "guia": guia,
                "embarcada": history[0]["fechahora"],
                "entregada": delivered ? history[history.length - 1]["fechahora"] : undefined,
                "historia": history
            });
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });

});

// Renew cookie for estafeta
async function renewCookie(guia) {
    // If estafeta cookie is over five minutes old
    let wayBill;
    await axios.get(`https://cs.estafeta.com/es/Tracking/searchByGet?wayBill=${guia}&wayBillType=0&isShipmentDetail=False`)
        .then((response) => {
            const cookie = response.headers['set-cookie'].join('; ');

            if (Date.now() - estafetaCookie.timestamp > (60 * 1000) * 5) {
                // Set cookie globally
                estafetaCookie = {
                    "cookie": cookie,
                    "timestamp": Date.now()
                };
            }

            // Parse page for waybill
            const shipment = parser.parse(response.data).querySelector(".shipmentInfoDiv");
            wayBill = shipment.childNodes[1].querySelector(".shipmentInfoSeparator").textContent.split("\n")[2].trim();
            
        })
        .catch((err) => {
            console.log(err);
        });

    return wayBill;
}

app.post('/estafeta', async (req, res) => {
    const guia = req.body.guia;
    // Check for cookie refresh and get waybill
    const wayBill = await renewCookie(guia);

    await axios({
        method: 'POST',
        url: 'https://cs.estafeta.com/es/Tracking/GetTrackingItemHistory',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'cookie': estafetaCookie.cookie
        },
        data: {
            "waybill": wayBill
        }
    }).then((response) => {
        res.send(response.data);
    }).catch((err) => {
        res.sendStatus(500);
    });
});

// ex: 3026756050
app.post('/potosinos', (req, res) => {
    const guia = req.body.guia;
    const orden = req.body.orden;
    const fecha = req.body.fecha;

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
        const resp = response.data["wsRastreoResponse"]["WS_RastreoResponse"];
        const delivered = resp["WS_Guia_Simple"]["Estado_de_la_Guia"] == "TRANSMITIDA" ? true : false;

        let history = resp["WS_Historia"]["WS_Historia_Guia"];
        let embarcada;
        let entregada;
        let estado;

        history = history.map(evento => {
            const fecha = evento["F_Historia"].trim().replace(/ +/g, ' ');
            const year = fecha.split(' ')[2];
            const month = fecha.split(' ')[0];
            const day = parseInt(fecha.split(' ')[1]);
            const hours = parseInt(fecha.split(' ')[3].split(':')[0]);
            const minutes = parseInt(fecha.split(' ')[3].split(':')[1].replace('PM', ''));

            const fechahora = new Date(`${month} ${day}, ${year} ${hours}:${minutes}`).getTime();

            // Get latest estado
            estado = evento["D_Estado_Guia"];

            return {
                "estado": evento["D_Estado_Guia"],
                "sucursal": evento["D_Oficina"],
                "fechahora": fechahora
            }
        });

        history.forEach(evento => {
            if (evento["estado"] == "EMBARCADA") {
                embarcada = evento["fechahora"];
            }
            if (evento["estado"] == "TRANSMITIDA") {
                entregada = evento["fechahora"];
            }
        });

        if (resp["result"] !== "Success") {
            res.sendStatus(500);
        }
        else {
            // res.send(resp);
            res.send({
                "paqueteria": "Potosinos",
                "guia": guia,
                "orden": orden,
                "fecha": fecha,
                "estado": estado,
                "entregada": entregada,
                "embarcada": embarcada,
                "historia": history
            });
        }
    }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    });
});

// Create the server and listen on port
http.createServer(app).listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    saveOrden("test");
});
