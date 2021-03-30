const util = require('util');

(async () =>{
	let e = await exec( "git clone https://github.com/ppy/osu-tools.git tmp\\osu-tools");
	console.log(e)
})();
/*exec( "gite clone https://github.com/ppy/osu-tools.git", ( result ) =>{
		if(result === 'ENOENT') return console.log('allgood')
} );*/

function exec( cmd ){
	return new Promise ( async ( resolve ) => {
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
            return resolve(err);
		} );
        p.on('error', function(err) {
            if(err.toString().includes('ENOENT')) return resolve( 'ENOENT' );
          });
	} catch ( e ) {
		return console.log( e );
	}
	});
}