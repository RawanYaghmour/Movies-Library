'use strict';
//1-require framework
const express =require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT ||3001
const apiKey= process.env.API_KEY
app.use(cors());
//const  recipesData = require('./Movie Data/data.json')


//************************************************************* 
//!-------------------------Lap 13------------------------------!

const { Client } = require('pg')
const url ='postgres://rawan:0000@localhost:5432/moviedatabase'
const client = new Client(url)

//Route
app.get('/', homeHandler);
app.post('/addMovie', addMovieHandler);
app.get('/getMovies', getMoviesHandler);

//handelers
function homeHandler(req, res){
    res.send("welcome to home");
}
function addMovieHandler(req, res){
    console.log(req.body)
    //to collect the data:
    //const title= req.body.title;
    //const time= req.body.time;
    //const image= req.body.image;

    const {title, time, image }= req.body //destructuring ES6
    const sql=`INSERT INTO Movies (title, time, image)
    VALUES ($1, $2, $3) RETURNING *;`
    const values= [title, time, image]
    client.query(sql, values).then((result)=>{
        console.log(result.rows);
        res.status(201).json(result.rows)
    }).catch()


   // res.send("data recived");
}
function getMoviesHandler(req, res){
    const sql= `SELECT * FROM Movies;`

    client.query(sql).then((result)=>{
        const data = result.rows
        res.json(data)
    })
    .catch()
    }


//listener
client.connect().then(()=>{
    app.listen(port, () =>{
        console.log("listening to port "+port);
    })
}

).catch()