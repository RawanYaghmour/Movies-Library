'use strict';
//1-require framework
const express =require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const { Client } = require('pg')
const url =process.env.PG_URL
const client = new Client(url)

//const bodyParser = require('body-parser')
//app.use(bodyParser.urlencoded({ extended: false }))
const port = process.env.PORT ||3001
const apiKey= process.env.API_KEY
app.use(cors());
app.use(express.json())

const  movieData = require('./Movie Data/data.json')



app.get('/', firstRouteHandler);
app.get('/favorite', secondRouteHandler);
app.get("/trending", handelTrending);
app.get("/search", searchHandler);
app.get("/upcoming", upcomingHandler);
app.get("/movie", movieHandler);
//////

//Route
app.get('/', homeHandler);
app.post('/addMovie', addMovieHandler);
app.get('/getMovies', getMoviesHandler);
app.put('/update/:movieId',updateHandeler);
app.delete('/delete/:id',deleteHandeler);
app.get('/getmovie/:id', getmovieHandeler);


app.use(handleServerError);
app.use(handleNotFoundError);


function firstRouteHandler(req,res){
// res.send("welcome to first rout.");
let reCheapMovie = new MovieData(movieData.title, movieData.poster_path, movieData.overview);
  res.send(reCheapMovie)
}

function MovieData(title, poster_path,overview){
    this.title=title
    this.poster_path=poster_path
    this.overview=overview
}


function secondRouteHandler(req,res){
    res.send("Welcome to Favorite Page ");
}


//Handle errors

// Function to handle "ServerError" error (status 500)
function handleServerError( req, res) {
    res.status(500).json({
        status: 500,
        responseText: 'Sorry, something went wrong'
    });
}

// Function to handle "page not found" error (status 404)
function handleNotFoundError(req, res) {
    res.status(404).json({
        status: 404,
        responseText: 'Page not found'
    });
}


function Movie(id, title, release_data, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_data = release_data;
    this.poster_path = poster_path;
    this.overview = overview;
}

// trending endpoint
function handelTrending(req, res) {
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;
    axios.get(url)
        .then(result => {
            console.log(result.data.results);
            let trending = result.data.results.map(trend => {
                return new Movie(
                    trend.id,
                    trend.title,
                    trend.release_data,
                    trend.poster_path,
                    trend.overview
                );
            });
            res.json(trending);
        })
        .catch(error => {
            console.error( error);
            res.status(500).json('Internal Server Error');
        });
}



//search
function searchHandler(req, res) {
const url= `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=The&page=2`;
axios.get(url)
        .then(result => {
            console.log(result.data.results);
            let searching = result.data.results.map(trend => {
                return new Movie(
                    trend.id,
                    trend.title,
                    trend.release_data,
                    trend.poster_path,
                    trend.overview
                );
            });
            res.json(searching);
        })
        .catch(error => {
            console.error( error);
            res.status(500).json('Internal Server Error');
        });
}




//Movie upcoming

function upcomingHandler(req,res){

const url=`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;

axios.get(url)
        .then(result => {
            console.log(result.data.results);
            let upcoming = result.data.results.map(trend => {
                return new Movie(
                    trend.id,
                    trend.title,
                    trend.release_data,
                    trend.poster_path,
                    trend.overview
                );
            });
            res.json(upcoming);
        })
        .catch(error => {
            console.error( error);
            res.status(500).json('Internal Server Error');
        });
}


//4rd rout
function movieHandler(req, res) {
const url= `https://api.themoviedb.org/3/movie/157336?api_key=${apiKey}&append_to_response=videos`;
axios.get(url)
        .then(result => {
            console.log(result.data.results);
            let movie = result.data.results.map(trend => {
                return Movie(
                    trend.id,
                    trend.title,
                    trend.release_data,
                    trend.poster_path,
                    trend.overview
                );
            });
            res.json(movie);
        })
        .catch(error => {
            console.error( error);
            res.status(500).json('Internal Server Error');
        });
}


//************************************************************* 
//!-------------------------Lap 13------------------------------!


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
       let movieId =req.params.movieId;
       let {title, time, image } = req.body;
       let sql=`UPDATE Movie
         SET title = $1, time = $2, image = $3
             WHERE id = $4;`;
       let values=[title, time, image,movieId ];
     
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



