/* app.js */
var PORT = 3000;
const app = require('express')()

const posts = [
    {
        id: 1,
        author: 'Edi',
        title: 'Templates',
        body: 'Blog post number 1'
    },
    {
        id: 2,
        author: 'Carol',
        title: 'Another set of templates',
        body: 'Blog number 2'
    }
];

const locations = [
    {
        city: 'SaoPaulo',
        stores: 2
    },
    {
        city: 'Campinas',
        stores: 1
    }
];

// set the view engine to ejs
app.set('view engine', 'ejs');

// home page
app.get('/', (req,res) => {
     res.render('home', {posts: posts})
})

// blog post

app.get('/post/:id', (req,res) => {
    const post = posts.filter((post) => {
        return post.id == req.params.id
    })[0]

// render post.ejs
    res.render('post', {
                           author: post.author,
                           title: post.title,
                           body: post.body
                           })
})

// blog locations
app.get('/store', (req,res) => {
    res.render('store', {locations: locations})
})

app.get('/locations/:city', (req,res) => {
    const locations = locations.filter((locations) => {
        return locations.city == req.params.city
    })[0]

// render blog locations
    res.render('locations', {
        city: locations.city,
        stores: locations.stores
    })
    
})
app.listen(PORT);
console.log("Listening on PORT 3000");