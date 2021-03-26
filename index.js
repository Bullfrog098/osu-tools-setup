const fs = require( "fs-extra" );
var Git = require( "nodegit" );
const https = require( "https" );
const open = require( "open" );
const directory = process.cwd();
const local = __dirname
var path = `${local}/dotnet-sdk-3.1.407-win-x64.exe`;
var url = "https://download.visualstudio.microsoft.com/download/pr/a45c8c1c-6466-4afc-a266-bd540069a4a6/97293f1080615bba5572ad1ef3be254c/dotnet-sdk-3.1.407-win-x64.exe";
if ( fs.existsSync( `${local}/tmp` ) ) fs.emptyDirSync( `${local}/tmp` );




module.exports = {

	lastestversion: () =>{
		return new Promise ( async ( resolve ) => {
			var a = await Git.Clone( "https://github.com/ppy/osu-tools", `${local}/tmp/osu-tools` );
			var b = await a.getHeadCommit( );
			var onlinehash = await b.sha();
			if ( fs.existsSync( `${directory}/osu-tools` ) ){
				var c = await Git.Repository.open( `${directory}/osu-tools` );
				var d = await c.getHeadCommit();
				var localhash = await d.sha();
				if ( localhash === onlinehash ) resolve( true );
			} else resolve( false );
			await fs.rmdirSync( `${local}/tmp`, { recursive: true } );
			return resolve( false );
		} );
	},

	updateosutools: async () => {
		var e = await ppmaker( false );
		return e;
	}, 

	firsttimesetup: async () => {
		var e = await start( true ); 
		return e;
	}
};

function start( first ){
	return new Promise ( async ( resolve ) => {
		if ( fs.existsSync( path ) ){
			let e = await ppmaker( first );
			return resolve( e );
		}
		https.get( url,( res ) => {
			const filePath = fs.createWriteStream( path );
			res.pipe( filePath );
			filePath.on( "finish", async () => {
				filePath.close();
				console.log( "Download Completed" ); 
				let e = await ppmaker( first );
				return resolve( e );
			} );
		} );
	} );
}

async function ppmaker( first ){
	return new Promise ( async ( resolve ) => {
		if ( first === true ) await open( path, { wait: true } );
		var e = await downloadosutools();

		if ( e === false ){ 
			if ( fs.existsSync( path ) ) fs.unlinkSync( path );
			return resolve( true );
		} 
		
		exec( "dotnet run --project osu-tools\\PerformanceCalculator", ( result ) =>{
			var done = true;
			if( result.toString().includes( "command \"dotnet run --project osu-tools\\PerformanceCalculator\" exited with wrong status code" ) ) done = false;
			if ( done === true && first === true ) fs.unlinkSync( path );
			return resolve( done );
			
		} );
	} );
}

function downloadosutools(){
	return new Promise ( async ( resolve ) => {
		var a = await Git.Clone( "https://github.com/ppy/osu-tools", `${local}/tmp/osu-tools` );
		var b = await a.getHeadCommit( );
		var onlinehash = await b.sha();
		if ( fs.existsSync( `${directory}/osu-tools` ) ){
			var c = await Git.Repository.open( `${directory}/osu-tools` );
			var d = await c.getHeadCommit();
			var localhash = await d.sha();
			if ( localhash === onlinehash ) return resolve( false );
		}
		await fs.rmdirSync( `${directory}/osu-tools`, { recursive: true } );
		await fs.copySync( `${local}/tmp/osu-tools`, `${directory}/osu-tools` );
		await fs.rmdirSync( `${local}/tmp`, { recursive: true } );
		return resolve();
	} );
}

function exec( cmd, cb ){
	try{
		var child_process = require( "child_process" );
		var parts = cmd.split( /\s+/g );
		var p = child_process.spawn( parts[0], parts.slice( 1 ), { stdio: "inherit" } );
		p.on( "exit", function( code ){
			var err = "allgood";
			if ( code ) {
				err = new Error( "command \""+ cmd +"\" exited with wrong status code \""+ code +"\"" );
				err.code = code;
				err.cmd = cmd;
			}
			if ( cb ) cb( err );
		} );
	} catch ( e ) {
		return console.log( e );
	}
}


