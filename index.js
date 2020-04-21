const express = require('express')
const path = require('path')
const app = express();
const request = require('request')
const PORT = process.env.PORT || 5000
const moment = require('moment');

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
          
          var options = {
            'method': 'GET',
            'url': 'https://api.covid19api.com/dayone/country/philippines',
            'headers': {
            }
          };
          request(options, function (error, response) { 
            if (error){ throw new Error(error)}
            else {

                let historyData = {}
                let dataSet = []
                let deathDataSet = {};
                let recoveredDataSet = {};
                let totalDataSet = {};
                let history = JSON.parse(response.body)
                let labels = history.map(x => moment(x["Date"]).format('MM-DD'));


                const death = history.map(x => x["Deaths"]);
                const recovered = history.map(x => x["Recovered"]);
                const total = history.map(x => x["Confirmed"]);

                deathDataSet.data = death
                deathDataSet.label = 'DEATHS'
                deathDataSet.type = 'line'
                deathDataSet.backgroundColor = '#d9534f'
                deathDataSet.borderColor = '#d9534f'
                deathDataSet.fill = false
                recoveredDataSet.data = recovered
                recoveredDataSet.label = 'RECOVERED'
                recoveredDataSet.type = 'line'
                recoveredDataSet.backgroundColor = '#5cb85c'
                recoveredDataSet.borderColor = '#5cb85c'
                recoveredDataSet.fill = false
                totalDataSet.data = total
                totalDataSet.label = 'TOTAL CASE'
                totalDataSet.type = 'line'
                totalDataSet.backgroundColor = '#5bc0de'
                totalDataSet.borderColor = '#5bc0de'
                totalDataSet.fill = false
                totalDataSet.hidden = true
            

                dataSet.push(totalDataSet);
                dataSet.push(recoveredDataSet);
                dataSet.push(deathDataSet);

                historyData.datasets = dataSet
                historyData.labels = labels

                res.render('pages/index', {
                  data: JSON.stringify(historyData),
                  result: data.data,
                  date: moment(time).format('LLL')
                });
            };
          });
        };
        
       
      });
   

})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

