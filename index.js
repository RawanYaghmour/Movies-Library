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
const url =process.env.PG_URL
const client = new Client(url)

//Route
app.get('/', homeHandler);
app.post('/addMovie', addMovieHandler);
app.get('/getMovies', getMoviesHandler);
app.put('/update/:movieId',updateHandeler);
app.delete('/delete/:id',deleteHandeler);
app.get('/getmovie/:id', getmovieHandeler);

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
    const sql=`INSERT INTO Movie (title, time, image)
    VALUES ($1, $2, $3) RETURNING *;`
    const values= [title, time, image]
    client.query(sql, values).then((result)=>{
        console.log(result.rows);
        res.status(201).json(result.rows)
    }).catch()


   // res.send("data recived");
}
function getMoviesHandler(req, res){
    const sql= `SELECT * FROM Movie;`

    client.query(sql).then((result)=>{
        const data = result.rows
        res.json(data)
    })
    .catch()
    }
function updateHandeler(req,res) {
       // console.log(req.params)
       let recipe =req.params.movieId;
       let {title, time, image } = req.body;
       let sql=`UPDATE Movie
         SET title = $1, time = $2, image = $3
             WHERE id = $4;`;
       let values=[title, time, image,recipe ];
     
        client.query(sql, values)
            .then(result => {
                console.log('Movie updated:');
                res.status(200).send("successfully ubdate")
            })
            .catch(error => {
                console.error('Error updating a movie:', error);
                res.status(500).send('Error updating movie');
            });
    }
function deleteHandeler(req, res){
    const { id } = req.params;
    const sql = 'DELETE FROM Movie WHERE id = $1;';
    const valuse = [id];

    client.query(sql, valuse)
        .then(result => {
                console.log('Movie deleted:');
                res.status(204).send("successfully Deleted");
            
        })
        .catch(error => {
            console.error('Error deleting a movie:', error);
            res.status(500).send('Error deleting movie');
        });
        }
function getmovieHandeler(req, res) {
            const { id } = req.params;
            const sql = `SELECT * FROM Movie WHERE id = $1`;
        
            client.query(sql, [id]).then(result => {
                console.log(result.rows);
                res.status(200).json(result.rows);
            }).catch(err => {
                console.error('Getting movie failed:', err);
                res.status(500).send('Getting movie failed');
            });
        }

//listener
client.connect().then(()=>{
    app.listen(port, () =>{
        console.log("listening to port "+port);
    })
}

).catch()