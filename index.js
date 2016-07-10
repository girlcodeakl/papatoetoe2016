//set up
var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var database = null;

//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));

//this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//make an empty list of ideas
var posts = [];
var idea = {};
idea.text = "This is an example of a GREAT idea!";
idea.time = new Date();
idea.id = 1001;
idea.author = "Anonymous";
idea.image = ("https://i.ytimg.com/vi/OBSx0laWFZk/maxresdefault.jpg" )
posts.push(idea);


//let a client GET the list of ideas
var sendIdeasList = function (request, response) {
  response.send(posts);
}
app.get('/ideas', sendIdeasList);
app.get('/idea', function (req, res) {
   var searchId = req.query.id;
   console.log("Searching for post " + searchId);
   var results = posts.filter(function (post) { return post.id == searchId; });
 if (results.length > 0) {
   res.send(results[0]);
 } else {
 res.send(null);
 }
});
//let a client POST new ideas
var saveNewIdea = function (request, response) {
  console.log(request.body.idea); //write it on the command prompt so we can see
  console.log(request.body.authorInput);

  //delete this: -> posts.push(req.body.idea); //save it in our list
  //add this:
  var idea = {};
    idea.id = Math.round(Math.random() * 10000);
    idea.text = request.body.idea;
    idea.time = new Date();
    if ( request.body.image === "") {
      idea.image = ("http://28.media.tumblr.com/tumblr_lbtwh922VX1qejf28o1_500.jpg" )
    } else {
    idea.image = request.body.image;
  }
    idea.author = request.body.author;
    posts.push(idea);
    response.send("Thanks for your idea. Press back to add another");
    var dbPosts = database.collection('posts');
    dbPosts.insert(idea);
}
app.post('/ideas', saveNewIdea);



//listen for connections on port 3000
app.listen(process.env.PORT || 3000);
console.log("I am listening...");

var mongodb = require('mongodb');
var uri = 'mongodb://girlcode:hats123@ds023624.mlab.com:23624/never_lose_posts';
mongodb.MongoClient.connect(uri, function(err, newdb) {
  if(err) throw err;
  console.log("yay we connected to the database");
  database = newdb;
  var dbPosts = database.collection('posts');
  dbPosts.find(function (err, cursor) {
    cursor.each(function (err, item) {
      if (item != null) {
        posts.push(item);
      }
    });
  });
});
