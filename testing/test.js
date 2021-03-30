/*const egg = require('./index');
(async ()=>{
    const e = await egg.firsttimesetup();
    console.log(e)
})();
const download = require('download-git-repo')
download('ppy/osu-tools', './osu-tools', function (err) {
    console.log(err ? 'Error' : 'Success')
  })*/
const git = require('git-rev-sync');
  console.log(git.long(`./osu-tools`));