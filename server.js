
// ------------------ * * REQUIRE / IMPORT * * ------------------

// ---- * CADRICIEL & REQUÊTES * ----
const express = require('express');
const app = express();
const request = require('request');

// ---- * CONFIG VALUES * ----
const config = require('./config');
const port = config.PORT;
const api_key = config.API_KEY;

// ---- * EXTRA NODE MODULES NEEDED * ----
const path = require('path');
const fs = require('fs');


const bodyParser = require('body-parser');
app.use(bodyParser.json());



// ------------------ * * ROUTES STATIQUES SPCA * * ------------------

// ---- * Redirection vers views dans public/static * ----

app.use('/static', express.static(path.resolve(__dirname, 'public', 'static')));



// ------------------------------------ * *  OBTENIR DONNÉS * * ------------------------------------

// ---- * Route + filtre pour obtenir liste de parks avec toutes les params * ---- 

const max_results = 500;
const state_code = "ca";

app.get('/getNationalParks', async (req, res) => {

    try {
       
        const api_url = `https://developer.nps.gov/api/v1/parks?stateCode=${state_code}&api_key=${api_key}&limit=${max_results}`;

        // ---- * Fait la req. asynchrone... * ----
        const response = await fetch(api_url);
        
        // ---- * ...et la reponse est convertie à json * ----
        const dataJson = await response.json();
    
        const newData = JSON.stringify(dataJson);

        // ---- * fichier json crée * ----
        fs.writeFile(`./public/static/data/${state_code}Parks.json`, newData, (err) => {
            
            if (err) {
                console.log('File write error', err);
                // res.status(500).send('Internal Server Error');
                res.status(500).json({ success: false, error: 'Internal Server Error' });

            } else {
                console.log('File write success');
                // res.sendStatus(200);
                res.status(200).json({ success: true, message: 'File write success' });
            }
          })

        // res.setHeader('Content-Type', 'application/json');
        // res.status(200).json(dataJson);        

        } catch (error) {
            console.error('Error fetching data', error);
            // res.status(500).send('Error fetching data');
            res.status(500).json({ success: false, error: 'Error fetching data' });
        }
});



// ---- * MAIN + ROUTES PAS "STATIC" : redir vers public/index.html * ----
// ---- * IMPORTANT !! cette route doit être À LA FIN pcq'elle est une catch-all et va faire un redir vers index.html pour toute route non-specifiée regardless of the slug * ----

app.get('/*', (req, res) => {

    res.sendFile(path.resolve(__dirname,'public', 'index.html'));
});


// ------------------ * * DÉROULEMENT SERVEUR * * ------------------

app.listen(port || 5000, () => {

    console.log('TP_1 Server running properly on port : ', port);
});