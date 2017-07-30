var express = require('express');
var app = express();

app.get('/', function(req, res) {


    res.sendFile('public/index.html');

    res.end();
});

app.get('/data', function(req, res) {
    var dailyUrl = 'https://www.waterconnect.sa.gov.au/Systems/SiteInfo/Pages/Default.aspx?site=A5041014&period=DAILY#Real-Time,Real-Time%20Data';
    var hourlyUrl = 'https://www.waterconnect.sa.gov.au/Systems/SiteInfo/Pages/Default.aspx?site=A5041014&period=HRLY#Real-Time,Real-Time%20Data';

    var result = [];
    result['WestBeach'] =  {'flow': 0.0, 'status':false};
    result['HenlyBreachSouth'] = {'flow': 0.0, 'status':false};
    result['Glenelg'] = {'flow': 0.0, 'status':false};
    result['WestLakes'] = {'flow': 0.0, 'status':false};
    

    var dailyData = [];
    var hourlyData = [1.0];

    var prevWeekAvg = 0.0;

    if(hourlyData[0] >= prevWeekAvg) {
        result['WestBeach'].flow = 10;
    }

    res.send(JSON.stringify(result));

});

var server = app.listen(3000, function() {
    var host = server.address().address;
    host = (host === '::' ? 'localhost' : host);
    var port = server.address().port;
 
    console.log('listening at http://%s:%s', host, port);
});
/*
var phantom = require("phantom");
var cheerio = require("cheerio");
var scrape = require('./scrape.js');

var pageHolder, scrapedPage, _outObj;
var data = [];
var url = 'https://www.waterconnect.sa.gov.au/Systems/SiteInfo/Pages/Default.aspx?site=A5041014&period=HRLY#Real-Time,Real-Time%20Data';
data = new Scrape().extract(url);

console.log(data);

phantom.create().then(ph => {
    pageHolder = ph;
    return pageHolder.createPage();
}).then(page => {
    scrapedPage = page;
    return scrapedPage.open('https://www.waterconnect.sa.gov.au/Systems/SiteInfo/Pages/Default.aspx?site=A5041014&period=HRLY#Real-Time,Real-Time%20Data');
}).then(status => {
    console.log(status);
    return scrapedPage.property('content')
}).then(content => {
    //console.log(content);

    $ = cheerio.load(content);
    // Extrat all data into an array
    $('.ui-jqgrid-bdiv').eq(1).find('table').find('tr').each((i, elm) => {
        // Read time stamp
        var timestamp = $(elm).attr('id');
        //console.log($(elm).attr('id'));
        // Get the value
        var value = $(elm).children('td').eq(1).attr('title');
        //console.log($(elm).children('td').eq(1).attr('title'));
        if(timestamp && value) {
            data.push({"timestamp": timestamp, "value": value});
        }
    })
    console.log(data);

    // tidy up and stop phantomjs
    scrapedPage.close();
    pageHolder.exit();
}).catch(error => console.log(error));
*/
