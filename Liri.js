
const twitter = require("twitter")
const http = require('http');
const request = require("request");
const fs = require('fs');
const url = require('url');
const keys = require("./keys.js");
const spotify = require("spotify");
//const ejs = require('ejs');
//const pug = require ('pug') ;
const express = require('express');
var app = express(); 
let output = [] ; 
//const socketIo = require('socket.io');
//const server = http.creatServer(app );


var twitterClient = new twitter ({

  consumer_key: keys.twitterKeys.consumer_key,

  consumer_secret: keys.twitterKeys.consumer_secret,

  access_token_key: keys.twitterKeys.access_token_key,

  access_token_secret: keys.twitterKeys.access_token_secret

});


let diretion = process.argv[2];
let order = process.argv[3]; 
let division = 0; 
//let parameters = process.argv[3];
let testForDefault = false;





let doit = function()
{
    if(division == 0){

         twitterClient.get("statuses/user_timeline", function(error, tweets, response) {
                      //console.log("hi");
                      if (error) {
                            //console.log("hi");
                            throw error;
                      }
                      
                      let a  = "------------------------------------------------";
                      output.push(a);
                      let b = "List of 20 tweets:";
                      output.push(b);

                      for (i = 0; i < tweets.length; i++) {
                       // console.log(tweets[i].text);
                        output.push(tweets[i].text);

                      }
                      output.push(a);

                      app.use(function (request, response){
              
                      response.send(output);     
                      //output = []; 
                      });


                      app.listen(52273, function(){

                      console.log('Server Running at http://127.0.0.1:52273'); 

                      });



         });

    }


    if(division == 1){


          if(testForDefault){
                 order = "The Sign"
                 spotify.search({type: "track", query: order.trim()}, function(error, response) {
                     app.use(function (request, response){ 
                     let a  = "------------------------------------------------";
                          
                         output.push(a);
                         output.push("Title: The Sign(defualt)")
                         output.push("Album: The Sign (1993)");
                         output.push("Artist(s): Ace of Base");
                         output.push("Preview: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=null");
                         output.push(a);
                         response.send(output); 
                     output = [];
                     }); 
                     app.listen(52273, function(){

                     console.log('Server Running at http://127.0.0.1:52273'); 

                     });


                 });   





          }else{

                  spotify.search({type: "track", query: order.trim()}, function(error, response) {

                  if (error) {

                    throw error;

                  }
                   
                  var track = response.tracks.items[0];
                  let a  = "------------------------------------------------";

                  output.push(a);

                  app.use(function (request, response){
                      let artists = [] ;  
                      output.push("Title: " + track.name);  
                      output.push("Album: " + track.album.name); 
                        for(var i = 0 ; i <track.artists.length ; i++ ){
                           artists.push(" " + track.artists[i].name);
                        }
                      output.push(artists);
                      output.push("Preview: " + track.preview_url);
                      output.push(a);
                      

                
                      response.send(output); 
                      output = [];


                  });

                  app.listen(52273, function(){

                  console.log('Server Running at http://127.0.0.1:52273'); 

                  });

                


                });

        }
    }  


    if(division == 2){

          if(testForDefault){
          order =  'Mr. Nobody.';
          }

          var omdbURL = "http://www.omdbapi.com/?t=" + order.trim();

          request(omdbURL, function(error, response, body) {

              if (error) {

                throw error;

              }
          var movieinfo = JSON.parse(body);
             app.use(function (request, response){
                let a  = "------------------------------------------------";
                output.push(a);
                output.push("Title: " + movieinfo.Title);
                output.push("Year: " + movieinfo.Year);
                output.push("IMDB Rating: " + movieinfo.imdbRating);
                output.push("Language: " + movieinfo.Language);
                output.push("Country: " + movieinfo.Country);
                output.push("Actors: " + movieinfo.Actors);
                output.push("Plot: " + movieinfo.Plot);
                output.push("Rotten Tomatoes Rating: " + movieinfo.Ratings[1].Value); 
                output.push(a);
                response.send(output); 
                output = [];
             });   

              app.listen(52273, function(){
                console.log('Server Running at http://127.0.0.1:52273'); 
              });


        });

       

    }    
}







if(diretion == "do-what-it-says"){
    fs.readFile("random.txt", "utf8", function(error, data) {
        var dataArray = data.split(",");
        direction = dataArray[0];
        
        console.log(direction);
        order = dataArray[1];
        
         if( direction == "spotify-this-song"){division = 1;} 
         else if(  direction == "movie-this"){division = 2;}
         else {division = 0;}
         console.log(division);
         console.log(order);
         
         if(division != 0){
         if(order === undefined){
           testForDefault = true;
           }   
         }

        doit();

  });


}else{
    if( diretion == "spotify-this-song"){division = 1;} 
    else if( diretion == "movie-this"){division = 2;}
    else {division = 0;}


    if(division != 0){
       if(order === undefined){
        testForDefault = true;
        }   
    }
    doit();

}

//fs.readFile("random.txt", "utf8", function(error, data)







    //console.log(twitterClient);









    //console.log(ejs);
    //console.log(pug);

    /*
    let app = express();
    app.use((request, response) =>{
    	fs.readFile('./test.html', null , function(error, data){
            if(error){
            response.writeHead(404);
            }else
    		response.writeHead(200 , {'Content-Type' : 'text/html'});
    	response.end(data);
    });

  

});



app.listen(52200, () =>{
 console.log('Server Running at http://127.0.0.1:52200');
});


http.createServer((request, response) =>{
   
    response.writeHead(200 , {'Content-Type' : 'text/html'});

 //var pathname = url.parse(request.url).pathname;
 fs.readFile('./test.html', null , function(error, data){
    
     if(error){
     	  response.writeHead(200 , {'Content-Type' : 'text/html'});
          response.writeHead(404);
          response.write('There is no file');
     }else{
     	response.write(data);

     }

     response.end();

     });




 
}).listen(52200, () =>{
 console.log('Server Running at http://127.0.0.1:52200');
});

*/