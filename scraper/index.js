
var phantom = require("phantom");
var cheerio = require("cheerio");
var _ph, _page, _outObj;

phantom.create().then(ph => {
    _ph = ph;
    return _ph.createPage();
}).then(page => {
    _page = page;
    return _page.open('https://www.waterconnect.sa.gov.au/Systems/SiteInfo/Pages/Default.aspx?site=A5041014&period=HRLY#Real-Time,Real-Time%20Data');
}).then(status => {
    console.log(status);
    return _page.property('content')
}).then(content => {
    //console.log(content);
    var data = {};

    $ = cheerio.load(content);
    var x = $('.ui-jqgrid-bdiv').eq(1).find('table').html();
    console.log("CHEERIO", x);
    _page.close();
    _ph.exit();
}).catch(e => console.log(e));
