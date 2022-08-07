const app = require('express')();
const PORT = 8080;

const axios = require('axios')
const cheerio = require('cheerio')

const bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

const cors = require('cors')
app.use(cors())

const URLL = 'https://github.com/kubowania/nodejs-webscraper/blob/main/src/app.js'

app.get('/', function(req, res) {
    res.sendFile(__dirname+"/index.html")
})

app.post('/link-preview', (req, res) => {
    console.log(req.body.name)
    axios(req.body.name)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            // console.log(html)
 
            const data = []

            const title = $('meta[property="og:title"]').attr('content') || $('title').text() || $('meta[name="title"]').attr('content')
            const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content')

            let domain = (new URL(req.body.name));
            domain = domain.hostname

            // const site_name = $('meta[property="og:site_name"]').attr('content')
            const image = $('meta[property="og:image"]').attr('content') || $('meta[property="og:image:url"]').attr('content')

            data.push({
                title,
                description,
                domain,
                image,
                URLL
            })
            
            console.log(data)
            // res.json(data)
            res.send(`<a href="`+URLL+`"><span class="link"></span></a>
            <img class="urlImg" src="`+image+`" alt=""></img>
            <p class="urlTitle">`+title+`</p>
            <p class="urlDesc">`+description+`</p>
            <p class="urlDomain">www.`+domain+`</p>`)

        }).catch((err) => {
            return res.json({
              error: err+" & An error has occured, you may have inputted an incorrect url.",
              
            });
        });
        
})
// app.post('/preview', (req, res) => {
//     axios(URLL)
//         .then(response => {
//             const html = response.data
//             const $ = cheerio.load(html)
//             // console.log(html)
 
//             const data = []

//             const title = $('meta[property="og:title"]').attr('content') || $('title').text() || $('meta[name="title"]').attr('content')
//             const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content')

//             let domain = (new URL(URLL));
//             domain = domain.hostname

//             // const site_name = $('meta[property="og:site_name"]').attr('content')
//             const image = $('meta[property="og:image"]').attr('content') || $('meta[property="og:image:url"]').attr('content')

//             data.push({
//                 title,
//                 description,
//                 domain,
//                 image,
//                 URLL
//             })
            
//             console.log(data)
//             res.json(data)

//         }).catch((err) => {
//             return res.json({
//               error: "An error has occured, you may have inputted an incorrect url.",
//               usage: `https://${req.hostname}/?url=https://google.com`
//             });
//         });
        
// })

app.listen(
    PORT,
    ()=> console.log(`Server running on ${PORT}`)
);
