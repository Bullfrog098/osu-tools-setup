# osu-tools-setup

Easily install and update osu-tools

*NOTE: This is for Windows only*

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