const puppeteer = require('puppeteer');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/myflightdb";
var endflag = false;


exports.mydata_extract = function(pagequery){
	endflag = false;
	var ticcount;

	// MongoDB connect and formatting part
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dbo = db.db("myflightdb");

		var myquery = { name: "FlyTickets" };
		dbo.collection("tickets").find(myquery).toArray(function(err, result) {
			if (err) throw err;
			ticcount = result.length;
		});

		if(ticcount != 0){
			dbo.collection("tickets").deleteMany(myquery, function(err, obj){
				if (err) throw err;
			});
		}
		
		var searchflag = false;
		searchflag = dataSearchAndSave();

		if(searchflag == true){
			endflag = true;
			db.close();
		}
	});

	//data search part using Puppeteer module
	function dataSearchAndSave(){
		(async() => {
			// headless chrome browser open 
			const browser = await puppeteer.launch({headless: true});
			const page = await browser.newPage();

            await page.goto(pagequery);
			await page.waitFor(20000);
			
			// subcompare windows close 
            const exitSelector = '.ResultsDialog__close__fc';
			await page.click(exitSelector);

			// price part selecting and reading data
			const resultsPrice = '.FlightResultsList__price__fc';
			await page.waitForSelector(resultsPrice);

			const linksPrice = await page.evaluate(resultsPrice => {
				const anchors = Array.from(document.querySelectorAll(resultsPrice));
				return anchors.map(anchor => {
					const title = anchor.textContent;
					return title;
				});
			}, resultsPrice);
	
			// Carrier company name selecting and reading 
			const resultsCarriername = '.FlightResultsList__carrierName__fc';
			await page.waitForSelector(resultsCarriername);

			const linksCarriername = await page.evaluate(resultsCarriername => {
				const anchors = Array.from(document.querySelectorAll(resultsCarriername));
				return anchors.map(anchor => {
					const title = anchor.textContent;
					return title;
				});
			}, resultsCarriername);

			// leaving and arriving time selecting and reading
			const resultsTime = '.FlightResultsList__time__fc';
			await page.waitForSelector(resultsTime);

			const linksTime = await page.evaluate(resultsTime => {
				const anchors = Array.from(document.querySelectorAll(resultsTime));
				return anchors.map(anchor => {
					const title = anchor.textContent;
					return title;
				});
			}, resultsTime);

			// depart and destination code selecting and reading
			const resultsCode = '.FlightResultsList__code__fc';
			await page.waitForSelector(resultsCode);

			const linksCode = await page.evaluate(resultsCode => {
				const anchors = Array.from(document.querySelectorAll(resultsCode));
				return anchors.map(anchor => {
					const title = anchor.textContent;
					return title;
				});
			}, resultsCode);

			// search result saving part in MongoDB
			//MongoDB connecting
			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
				var dbo = db.db("myflightdb");

				for(var i = 2; i < linksPrice.length; i+=2){
					var myobj = { name: "FlyTickets", carriername: linksCarriername[i], departtime: linksTime[i*2], departcode: linksCode[i*2], desttime: linksTime[i*2+1], destcode: linksCode[i*2+1], price: linksPrice[i]};
					var myobj1 = { name: "FlyTickets", carriername: linksCarriername[i+1], departtime: linksTime[i*2+2], departcode: linksCode[i*2+2], desttime: linksTime[i*2+3], destcode: linksCode[i*2+3], price: linksPrice[i+1]};
					// result input
					dbo.collection("tickets").insertOne(myobj, function(err, res) {
						if (err) throw err;
					});
					dbo.collection("tickets").insertOne(myobj1, function(err, res) {
						if (err) throw err;
					});
				}

				db.close();

			});
			await browser.close();
		})();

		return true;
	}
	if(endflag == true)return true;
}


