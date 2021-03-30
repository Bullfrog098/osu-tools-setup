//const url = 'https://github.com/git-for-windows/git/releases/download/v2.31.0.windows.1/Git-2.31.0-64-bit.exe'
var url = "https://download.visualstudio.microsoft.com/download/pr/a45c8c1c-6466-4afc-a266-bd540069a4a6/97293f1080615bba5572ad1ef3be254c/dotnet-sdk-3.1.407-win-x64.exe";

const fs = require('fs');
const request = require('request');

download(url, './test.exe', (e) => {
    console.log(e)
})

function download (url, dest, cb) {
    const file = fs.createWriteStream(dest);
    const sendReq = request.get(url);

    // verify response code
    sendReq.on('response', (response) => {
        if (response.statusCode !== 200) {
            return cb('Response status was ' + response.statusCode);
        }

        sendReq.pipe(file);
    });

    // close() is async, call cb after close completes
    file.on('finish', () => file.close(cb));

    // check for request errors
    sendReq.on('error', (err) => {
        fs.unlink(dest);
        return cb(err.message);
    });

    file.on('error', (err) => { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        return cb(err.message);
    });
};