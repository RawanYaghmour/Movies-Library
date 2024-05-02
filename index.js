//1-require express framework
const express =require('express');

//2-invoke express 
const app = express()
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()
const port = process.env.PORT
const apiKey= process.env.API_KEY
app.use(cors())
const  recipesData = require('./Movie Data/data.json')

//3-run server make it listening & ready for any request
app.listen(port, () =>{
    console.log("welcome to movie website "+port);
})




//!-------------------------Lap 11------------------------------!



//routing
//Home Page Endpoint:

app.get('/', firstRouteHandler);
function firstRouteHandler(req,res){
// res.send("welcome to first rout.");
let reCheapeRecipe = new Recipe(recipesData.title, recipesData.poster_path, recipesData.overview);
  res.send(reCheapeRecipe)
}

//constructor
function Recipe(title, poster_path,overview){
    this.title=title
    this.poster_path=poster_path
    this.overview=overview
}

//Favorite Page Endpoint: “/favorite”

app.get('/favorite', secondRouteHandler);
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



//*************************************************************************** 

//!-------------------------Lap 12------------------------------!

//Constructor
function Movie(id, title, release_data, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_data = release_data;
    this.poster_path = poster_path;
    this.overview = overview;
}

// trending endpoint
app.get("/trending", handelTrending);
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
app.get("/search", searchHandler);
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
app.get("/upcoming", upcomingHandler);

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
app.get("/movie", movieHandler);
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



app.use(handleServerError);
app.use(handleNotFoundError);
