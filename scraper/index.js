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
    var data = {};

    $ = cheerio.load(content);
    var trimmedContent = $('.ui-jqgrid-bdiv').eq(1).find('table').html();
    console.log(trimmedContent);

    // tidy up and stop phantomjs
    scrapedPage.close();
    pageHolder.exit();
}).catch(error => console.log(error));
