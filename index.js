//1-require express framework
const express =require('express');

//2-invoke express 
const app = express()
const port = 3001
const  recipesData = require('./data.json')

//3-run server make it listening & ready for any request
app.listen(port, () =>{
    console.log("welcome to movie website "+port);
})


//routing test
//app.get('/firstRout', firstRouteHandler);
//function firstRouteHandler(req,res){
   // res.send("welcome to first rout.");
//   res.send(recipesData)
//}






//routing
//!-------------------------Home Page Endpoint: / ------------------------------!

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





//!-------------------------Favorite Page Endpoint: “/favorite”------------------------------!

app.get('/favorite', secondRouteHandler);
function secondRouteHandler(req,res){
    res.send("Welcome to Favorite Page ");
}






//!-------------------------Handle errors------------------------------!

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

app.use(handleServerError);
app.use(handleNotFoundError);
