var phantom = require("phantom");
var cheerio = require("cheerio");

var pageHolder, scrapedPage, _outObj;

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
    var data = [];

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
