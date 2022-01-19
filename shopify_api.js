process.title = "GET PRODUCTS";

var https = require('https');

//	https://{username}:{password}@{shop}.myshopify.com/admin/api/2022-01/products.json
//  https://" . $shop . ".myshopify.com/admin/oauth/authorize?client_id=" . $api_key . "&scope=" . $scopes . "&redirect_uri=" . urlencode($redirect_uri);

let shopifyUName = 'honestogo@yahoo.com';
let shopifyUPass = '122778Junior';
let shopifyShops1 = 'honestogo-399.myshopify.com';
let shopifyShops2 = 'honestogo.myshopify.com';
let shopifyAPIkey = 'shopify';
let shopifyAPIpass = 'shopify';

let scopes = "read_orders,write_products";
let redirect_uri = "https://honestogo.myshopify.com/generate_token.php";

try {
	var baseUname = Buffer.from(shopifyUName).toString('base64');
	var baseUpass = Buffer.from(shopifyUPass).toString('base64');

	var baseAPIkey = Buffer.from(shopifyAPIkey).toString('base64');
//	var baseUpass = Buffer.from(shopifyAPIpass).toString('base64');
	
//	const options = new URL('https://' + shopifyUName + ':' + shopifyUPass + '@' + shopifyShops1 + '/admin/api/2022-01/products.json');
	var options = {
		protocol: 'https:',
		headers: {
			'Authorization': 'Basic ' + baseAPIkey,
			'Content-Type': 'application/json'
		},
		host: shopifyShops2,
		path: '/admin/auth/login?' + 'client_id=' + baseAPIkey + 'scope=' + encodeURIComponent(scopes) + '&redirect_uri=' + encodeURIComponent(redirect_uri),
//		host: baseUname + ':' + baseUpass + '@' + shopifyShops2,
//		path: '/admin/api/2022-01/products.json',
		port: 443,
		method: 'GET'
	};

	console.info(options);
	var req = https.request(options, (res) => {
		var finalbody = [];
		
		res.on('error', (e) => {
			savelog(e);			
		}).on('data', (d) => {
			process.stdout.write(d);
			finalbody.push(d);
		}).on('end', function() {
			console.log('statusCode:' + res.statusCode);
			console.log('headers:' + JSON.stringify(res.headers));

			finalbody = Buffer.concat(finalbody).toString();
			savelog('Status Code:' + res.statusCode + '\n Headers:' + JSON.stringify(res.headers) + '\n' + finalbody );
						
			get_data();
		});
	});

	req.on('error', (e) => {
		savelog(e);
		console.error(e);
	});
	
	//req.write();
	req.end();
}	
	
catch (err) {
	savelog("[error]" + err);
}

	function get_data(){
		var optGet = {
			protocol: 'https:',
			headers: {
//				'Authorization': 'Basic ' + baseAPIkey,
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
			},
			host: shopifyShops2,
			port: 443,
			path: '/admin/api/2022-01/products.json',
			method: 'GET'
		};

		console.info(optGet);
		var reqGet = https.request(optGet, (resGet) => {
			var prodData = [];
		
			resGet.on('error', (e) => {
				savelog(e);			
			}).on('data', (data) => {
				prodData.push(data);
			}).on('end', function() {
				console.log('statusCode:' + resGet.statusCode);
				console.log('headers:' + JSON.stringify(resGet.headers));

				prodData = Buffer.concat(prodData).toString();
				savelog('Status Code:' + resGet.statusCode + '\n Headers:' + JSON.stringify(resGet.headers) + '\n' + prodData );

				sync_data(prodData);
			});
		});

		reqGet.on('error', (e) => {
			savelog(e);
			console.error(e);
		});
	
		reqGet.end();	
	}

	function sync_data(pdata){
		var optPost = {
			protocol: 'https:',
			headers: {
//				'Authorization': 'Basic ' + baseAPIkey,
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(pdata)
			},
			host: shopifyShops1,
			port: 443,
			path: '/admin/api/2022-10/products.json',
			method: 'POST'
		};

		console.info(optPost);
		var reqPost = https.request(optPost, (resPost) => {
			var body = [];
		
			resPost.on('error', (e) => {
				savelog(e);			
			}).on('data', (data) => {
//				body += data;
				body.push(data);
			}).on('end', function() {
				console.log('statusCode:' + resPost.statusCode);
				console.log('headers:' + JSON.stringify(resPost.headers));

				body = Buffer.concat(body).toString();
				savelog('Status Code:' + resPost.statusCode + '\n Headers:' + JSON.stringify(resPost.headers) + '\n' + body );
			});
		});

		reqPost.on('error', (e) => {
			savelog(e);
			console.error(e);
		});
	
		reqPost.write(pdata);
		reqPost.end();	
	}

	function savelog(string){
		var fs = require('fs');
		var Date1 = new Date();
		var filename = './log_' + Date1.getUTCFullYear() + (+Date1.getUTCMonth() + 1) + Date1.getDate() + '.log';
		
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


