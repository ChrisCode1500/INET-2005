
class Movie {
    constructor(title, plot, genres, rated, poster) {
        this.title = title;
        this.plot = plot;
        this.genres = genres;
        this.rated = rated;
        this.poster = poster;
    }
}

//required libraries - first time remember to "npm install express mongodb dotenv"
const Express = require("express");
const { MongoClient } = require("mongodb");

//use dotenv config file to keep connection strings etc. private
require('dotenv').config();

//these are all defined in the .env file (for security reasons, the .env file never goes in a repo!)
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const DATABASE_URI = process.env.DATABASE_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

//create the app (new instance of ExpressJs, a minimalist framework) https://expressjs.com/
var app = Express();

//neccessary in order to access request.body.xxxx properties
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

// view engine setup
app.set('views', './views');
app.set("view engine", "ejs");

//create the server for the app, then call listen()
const http = require('http').createServer(app);

//variables for mongodb
let client, database, collection;

//wait and listen...
http.listen(PORT, () => {

    //use the values retrieved from the .env file and setup our client etc.
    client = new MongoClient(DATABASE_URI);
    database = client.db(DATABASE_NAME);
    collection = database.collection(COLLECTION_NAME);

    console.log("listening on " + HOST + ":" + PORT + ", connected to " + DATABASE_NAME);
});

//this app.get method is looking for a GET request to an empty path (e.g. http://localhost)
app.get("/", async (request, response) => {

        //query distinct list of results
        const genrelist = await collection.distinct("genres");

        response.render('index', { genrelist: genrelist });
    }
);

//this app.post method is looking for a Form POST to the URL http://localhost/search
app.post("/search", async (request, response) => {
        
        var first_name = (request.body.first_name ? request.body.first_name : '');
        var last_name = (request.body.last_name ? request.body.last_name : '');

        const query = { };
        if (first_name != '') query.first_name = new RegExp(first_name, "gi");
        if (last_name != '') query.last_name = new RegExp(last_name, "gi");

        console.log("query",query);

        //query returns array of results
        const people_list = await collection.find(query).toArray();

        // //data transfer objects (decouple our db result from our user interface)
        // let person_dtos = [];
        // for (var i = 0; i < movielist.length; i++) {
        //     let mov = new Movie(movielist[i].title, movielist[i].plot, movielist[i].genres, movielist[i].rated, movielist[i].poster);
        //     movielist_dtos.push(mov);
        // }

        response.render('results', { people: people_list });
    }
)

//just an example of 401 Forbidden
app.get("/jamie",
    (request, response) => {
        response.statusCode = 401;
        response.write("<p>You're not allowed in here.");
        response.end();
    }
)

//a test page, to test if the app is up and running
app.get("/test", (request, response) => {
    response.send('App is up and running ' + new Date());
});