const fs        = require( "fs-extra" );
//var Git       = require( "nodegit" );
const git       = require( "git-rev-sync" );
const request   = require( "request" );
const https     = require( "https" );
const open      = require( "open" );
const directory = process.cwd();
const local     = __dirname;
var path        = `${local}/dotnet-sdk-6.0.301-win-x64.exe`;
var gitpath     = `${local}/Git-2.31.0-64-bit.exe`;
const dotneturl = "https://download.visualstudio.microsoft.com/download/pr/15ab772d-ce5c-46e5-a90e-57df11adabfb/4b1b1330b6279a50c398f94cf716c71e/dotnet-sdk-6.0.301-win-x64.exe"
const giturl    = "https://github.com/git-for-windows/git/releases/download/v2.31.0.windows.1/Git-2.31.0-64-bit.exe";

if ( fs.existsSync( `${local}/tmp` ) ) fs.emptyDirSync( `${local}/tmp` );


module.exports = {

	lastestversion: () =>{
		return new Promise ( async ( resolve ) => {
			let a = await exec( `git clone https://github.com/ppy/osu-tools.git ${local}/tmp/osu-tools`);
			if ( a[0] === "ENOENT" ){
				await installgit();
				await exec( `git clone https://github.com/ppy/osu-tools.git ${local}/tmp/osu-tools` );
			}
			var onlinehash = await git.long( `${local}/tmp/osu-tools` );
			if ( fs.existsSync( `${directory}/osu-tools` ) ){
				var localhash = await git.long( `${directory}/osu-tools` );
				if ( localhash === onlinehash ) resolve( true );
			} else resolve( false );
			await fs.rmSync( `${local}/tmp`, { recursive: true } );
			return resolve( false );
		} );
	},

	updateosutools: async () => {
		var e = await ppmaker( false, true );
		return e;
	}, 

	firsttimesetup: async () => {
		var e = await start( true ); 
		return e;
	}
};

function start( first ){
	return new Promise ( async ( resolve ) => {
		let a = await exec( "git --version" );
		if ( a[0] === "ENOENT" ) await installgit();
		let c = await exec( "dotnet --list-sdks", true );
		if ( c[0] === "ENOENT" || !c[1].includes( "6." ) ){
		if ( fs.existsSync( path ) ){
			let e = await ppmaker( first );
			return resolve( e );
		}
		console.log('Downloading Dotnet')
		https.get( dotneturl,( res ) => {
			const filePath = fs.createWriteStream( path );
			res.pipe( filePath );
			filePath.on( "finish", async () => {
				filePath.close();
				console.log( "Download Completed" ); 
				let e = await ppmaker( first );
				return resolve( e );
			} );
		} );
	} else {
		let e = await ppmaker();
			return resolve( e );
	}
	} );
}

async function ppmaker( first, update ){
	return new Promise ( async ( resolve ) => {
		if ( first === true ) await open( path, { wait: true } );
		var e = await downloadosutools(update);

		if ( e === false ){ 
			if ( fs.existsSync( path ) ) fs.unlinkSync( path );
			return resolve( true );
		} 
		console.log('setting up please wait...')
		let result = await exec( "dotnet run --project osu-tools\\PerformanceCalculator" );
		var done = true;
		if( result.toString().includes( "command \"dotnet run --project osu-tools\\PerformanceCalculator\" exited with wrong status code" ) ) done = false;
		if ( done === true && first === true ) fs.unlinkSync( path );
		return resolve( done );
	} );
}

function downloadosutools(update){
	return new Promise ( async ( resolve ) => {
		//var a = await Git.Clone( "https://github.com/ppy/osu-tools", `${local}/tmp/osu-tools` );
		//var b = await a.getHeadCommit( );
		//var onlinehash = await b.sha();
		if (!fs.existsSync(`${directory}/osu-tools/PerformanceCalculator/bin`)) return resolve();
		await exec( `git clone https://github.com/ppy/osu-tools.git ${local}/tmp/osu-tools` );
		var onlinehash = await git.long( `${local}/tmp/osu-tools` );
		if ( fs.existsSync( `${directory}/osu-tools` ) ){
			//var c = await Git.Repository.open( `${directory}/osu-tools` );
			//var d = await c.getHeadCommit();
			//var localhash = await d.sha();
			var localhash = await git.long( `${directory}/osu-tools` );
			if ( localhash === onlinehash ) return resolve( false );
		}
		if ( update === true ) await fs.rmSync( `${directory}/osu-tools`, { recursive: true } );
		await fs.copySync( `${local}/tmp/osu-tools`, `${directory}/osu-tools` );
		await fs.rmSync( `${local}/tmp`, { recursive: true } );
		return resolve();
	} );
}

function installgit(){
	return new Promise ( ( resolve ) => {
		console.log('Downloading git')
		download( giturl, gitpath, async ( ) => {
			await open( gitpath, { wait: true } );
			return resolve();
		} );
	} );
}

function exec( cmd, dotnetcheck ){
	return new Promise ( async ( resolve ) => {
		try{
			var child_process = require( "child_process" );
			var parts = cmd.split( /\s+/g );
			if (dotnetcheck === true){
				child_process.execFile( parts[0], parts.slice( 1 ), ( err, stdout ) => {
					if ( stdout.length === 0 ) return resolve( ["ENOENT", stdout] );
					else return resolve( ["allgood", stdout] );
				} );
			} else {
			var p = child_process.spawn( parts[0], parts.slice( 1 ), { stdio: "pipe" } );//{ stdio: "inherit" } );
			p.on( "exit", function( code ){
				var err = "allgood";
				if ( code ) {
					err = new Error( "command \""+ cmd +"\" exited with wrong status code \""+ code +"\"" );
					err.code = code;
					err.cmd = cmd;
				}
				return resolve( err );
			} );
			p.on( "error", function( err ) {
				console.log(err)
				if( err.toString().includes( "ENOENT" ) ) return resolve( ["ENOENT", stdout] );
			} );
			}
		} catch ( e ) {
			return console.log( e );
		}
	} );
}

//thanks stack
function download ( url, dest, cb ) {
	const file = fs.createWriteStream( dest );
	const sendReq = request.get( url );

	// verify response code
	sendReq.on( "response", ( response ) => {
		if ( response.statusCode !== 200 ) {
			return cb( "Response status was " + response.statusCode );
		}

		sendReq.pipe( file );
	} );

	// close() is async, call cb after close completes
	file.on( "finish", () => file.close( cb ) );

	// check for request errors
	sendReq.on( "error", ( err ) => {
		fs.unlink( dest );
		return cb( err.message );
	} );

	file.on( "error", ( err ) => { // Handle errors
		fs.unlink( dest ); // Delete the file async. (But we don't check the result)
		return cb( err.message );
	} );
}