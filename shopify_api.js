
const Shopify = require('shopify-api-node');

try {

	const shopify = new Shopify({
		shopName: 'honestogo.myshopify.com',
		apiKey: 'shopify',
		password: 'shopify'
	});
	
catch (err) {
	log("[error]" + err);
}


	function log(string){
		var fs = require('fs');
		var Date1 = new Date();
		var filename = './log_' +Date1.getUTCFullYear()+(+Date1.getUTCMonth() + 1)+Date1.getDate()+'.log';
		
		fs.stat(filename, function(err, stat) {
			//console.log(err);
			if(err == null) {
				fs.readFile( filename , function (err, data) {
					if (err) throw err;
					var newLine = data + "\r" + string;
					
					fs.writeFile(filename, newLine + "\r\n", function(err, result) {
						if(err) console.log('error', err);
				 	});					
				});
			} else if(err.code == 'ENOENT') {
					fs.writeFile(filename, string + "\r\n", function(err, result) {
						if(err) console.log('error', err);
				 	});					
			} else {
				console.log("[error]" + err.code + err.message );
			}
		});
	} // end of function
