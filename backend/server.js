'use strict';
const express = require('express');
const axios = require('axios');
const app = express();

const API_KEY = "99bbce90b29a11e8a5c8b5534e5da078";
const API_SECRET = "0e9de3d34e14e65020b5961bbce3f2a30089d5a712c2a34ef5a981ca131f77652da0d5f372b05fd9147c48181b634f7cd2d987fa5b37335a81a2e911cb2f8446b0311a0fa35a058cd58811108137ddf9eeb5796f995977f41ae4afebfab156f07ed46e1039b3b81d91dc472a9d286535e7633613e01efee789963bd17d5405ab";
const URL = "http://localhost:3000/limetoken"

app.use('/static', express.static('public'));
app.get('/', async (req, res, next) => {
    try {
        // Get LimePay Token and return it to the UI

        let result = await axios({
            method: "GET",
            url: URL,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                "Authorization": "Basic " + Buffer.from(API_KEY + ":" + API_SECRET).toString('base64')
            }
        });
        let token = result.headers["x-lime-token"];
        res.json(token);
    } catch (err) {
        console.log(err);
    }
});

app.use((err, request, response, next) => {
    console.log(err);
    response.status(500).send("Something went wrong.");
});

var server = app.listen(9090, () => {
    console.log("Marketplace app listening at http://localhost:" + 9090);
});