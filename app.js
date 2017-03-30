/* app.js */
const app = require('express')();

var cloudant = require('cloudant')('https://16a38da7-1ac7-4202-b583-e9689da37bfb-bluemix:f1841b46949345eab60c77cd65ca9ee161fefffc27f1356da00f995b197b6a6d@16a38da7-1ac7-4202-b583-e9689da37bfb-bluemix.cloudant.com');

cloudant = cloudant.db.use('posts');


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
// set the view engine to ejs
app.set('view engine', 'ejs');

var posts;

// home page
app.get('/', (req,res) => {
    cloudant.find({
	 	"selector":{
	 		"_id":{"$gt":null}
	 	},
	 	"fields":[
	 	"id","author","title","body"
	 	]
	 },function(err,data){
	 	if(!err){
            posts = data.docs;
	 		res.render('home',{posts:posts});
	 		return;
	 	}		
	 	console.log(err);
	 });
     
});

app.get('/create',(req,res) => {    
    res.render('create-post');
    
});


app.post('/create',(req,res) => {
    console.log(req.body);  
    res.render('create-post');
    cloudant.insert(req.body,function(err,body){
       if(!err) console.log(body); 
    });
});


app.get('/post/:title', (req,res) => {
    var title = req.params.title;
     cloudant.find({
	 	"selector":{
	 		"title":{"$eq":title}
	 	},
	 	"fields":[
	 	"id","author","title","body"
	 	]
	 },function(err,data){
	 	if(!err){
            var post = data.docs[0];
            // render post.ejs
            res.render('post', {
                           author: post.author,
                           title: post.title,
                           body: post.body
                           })
	 		return;
	 	}		
	 	console.log(err);
	 });
});

app.post('/delete', (req,res) => {
    
    var title = req.body.title;
    
    cloudant.find({
	 	"selector":{
	 		"title":{"$eq":title}
	 	},
	 	"fields":[
	 	"_id","_rev"
	 	]
	 },function(err,data){
	 	if(!err){
            var doc_id = data.docs[0]._id;
            var doc_rev = data.docs[0]._rev;
            
            cloudant.destroy(doc_id,doc_rev,function(err){
                if(!err) console.log("document deleted");
                
            });
            
	 		return;
	 	}		
	 	console.log(err);
	 });
    
});


app.listen(3000);
console.log("Listening on PORT 3000");

