var express = require('express');
var path = require('path');
var phantom = require('phantom');
var cheerio = require('cheerio');
var app = express();

app.use(require('express-promise')());

app.use('/fonts', express.static('fonts'));
app.use('/images', express.static('images'));
app.use('/styles', express.static('styles'));
app.use('/scripts', express.static('scripts'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/data', (req, res) => {

    var data = {};
    var henlybeachStatus = calcHenlyBeach() || true;

    data['henlybeach'] = { 'status': henlybeachStatus };
    data['westlakes'] = { 'status': false };

    coinsole.log('Sending results');
    res.send(JSON.stringify(data));

});


function calcHenlyBeach() {
    return new Promise((resolve, reject) => {
        var dailyUrl = 'https://www.waterconnect.sa.gov.au/Systems/SiteInfo/Pages/Default.aspx?site=A5041014&period=DAILY#Real-Time,Real-Time%20Data';
        var hourlyUrl = 'https://www.waterconnect.sa.gov.au/Systems/SiteInfo/Pages/Default.aspx?site=A5041014&period=HRLY#Real-Time,Real-Time%20Data';
        var pageHolder, scrapedPage, _outObj;

        // Get the average value from the daily data set
        var dailyData = [];
        var hourlyData = [];

        phantom.create().then(ph => {
            pageHolder = ph;
            return pageHolder.createPage();
        }).then(page => {
            scrapedPage = page;
            return scrapedPage.open(dailyUrl);
        }).then(status => {
            console.log(status);
            return scrapedPage.property('content')
        }).then(content => {
            $ = cheerio.load(content);
            // Extrat all data into an array
            $('.ui-jqgrid-bdiv').eq(1).find('table').find('tr').each((i, elm) => {
                // Read time stamp
                var timestamp = $(elm).attr('id');
                //console.log($(elm).attr('id'));
                // Get the value
                var value = $(elm).children('td').eq(1).attr('title');
                //console.log($(elm).children('td').eq(1).attr('title'));
                if (timestamp && value) {
                    dailyData.push({ "timestamp": timestamp, "value": value });
                }
            })

            // tidy up and stop phantomjs
            scrapedPage.close();
            pageHolder.exit();
        }).catch(error => console.log(error));

        phantom.create().then(ph => {
            pageHolder = ph;
            return pageHolder.createPage();
        }).then(page => {
            scrapedPage = page;
            return scrapedPage.open(dailyUrl);
        }).then(status => {
            console.log(status);
            return scrapedPage.property('content')
        }).then(content => {
            $ = cheerio.load(content);
            // Extrat all data into an array
            $('.ui-jqgrid-bdiv').eq(1).find('table').find('tr').each((i, elm) => {
                // Read time stamp
                var timestamp = $(elm).attr('id');
                //console.log($(elm).attr('id'));
                // Get the value
                var value = $(elm).children('td').eq(1).attr('title');
                //console.log($(elm).children('td').eq(1).attr('title'));
                if (timestamp && value) {
                    hourlyData.push({ "timestamp": timestamp, "value": value });
                }
            })

            // tidy up and stop phantomjs
            scrapedPage.close();
            pageHolder.exit();
        }).catch(error => console.log(error));

        console.log('Hourly Dat: ' + JSON.stringify(hourlyData));


        // Compare the latest value from the hourly data set

        var sum = 0;
        for (var i = 0; i < dailyData.length; i++) {
            sum += dailyData[i].value;
        };

        var average = sum / dailyData.length;
        var latest = dailyData[0];

        // Is current <= average in range of 10%
        var margin = average / 10;

        console.log('latest: ' + latest);
        console.log('average: ' + average);
        console.log('margin: ' + margin);
        if (latest > average - margin || latest >= average + margin) {
            resolve(false);
        }

        resolve(true);
    });
}

var server = app.listen(3000, () => {
    var host = server.address().address;
    host = (host === '::' ? 'localhost' : host);
    var port = server.address().port;

    console.log('listening at http://%s:%s', host, port);
});