const express = require('express')
const path = require('path')
const app = express();
const request = require('request')
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => {

      var options = {
        'method': 'GET',
        'url': 'https://api.quarantine.country/api/v1/summary/region?region=philippines',
        'headers': {
        }
      };
      request(options, function (error, response) { 
        if (error){ throw new Error(error)}
        else {

          let data = JSON.parse(response.body)
          let time = Object.keys(data.data.spots)[0]
          res.render('pages/index', {
            result: data.data,
            date: time
          });
        };
        
       
      });
   

})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

