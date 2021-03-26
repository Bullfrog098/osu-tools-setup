const egg = require('./downloader');
(async ()=>{
    const e = await egg.firsttimesetup();
    console.log(e)
})();