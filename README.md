# osu-tools-setup

Easily install and update osu-tools

*NOTE: This is for Windows only*

Requires: dotnet sdk 5.something and git cli, both can be installed using the code upon running `firsttimesetup()`

~~*if anyone can figure out a way to download a git repo with the .git folder still in it without using nodegit lemme know since some people have to download like 600mb+ worth of stuff for nodegit*~~

Ima just force you guys to install git cli if you didn't already have it :)

My Discord: Bullfrog098#2579

## Documentation
```js
const osutools = require('osu-tools-setup');
```


#### firsttimesetup()
Starts setup for dotnet 3.1 framework and osu-tools.

 `true` = passed
 
 `false` = failed

```js
const osutools = require('osu-tools-setup');

(async () => {
    const e = await osutools.firsttimesetup();
    console.log(e)
    //passed = true, failed = false
})();
```

#### updateosutools()
Updates your version of osu-tools

`true`= updated successfully

`false` = failed with update
```js
const osutools = require('osu-tools-setup');

(async () => {
    const e = await osutools.updateosutools();
    console.log(e)
    //updated = true, failed = false
})();
```

#### lastestversion()
Checks if your version of osu-tools is up to date

`true` = your version is up to date

`false` = your version needs to be updated
```js
const osutools = require('osu-tools-setup');

(async () => {
    const e = await osutools.lastestversion();
    console.log(e)
    //up to date = true, not up to date = false
})();
```
