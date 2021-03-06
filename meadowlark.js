function getWeatherData() {
	return {
		locations: [
			{
				name: "Portland",
				forecastUrl: "http://www.wunderground.com/US/OR/Portland.html",
				iconUrl: "http://icons-ak.wxug.com/i/c/k/cloudy.gif",
				weather: "Overcast",
				temp: "54.1 F (12.3 C)"
			},
			{
				name: "Bend",
				forecastUrl: "http://www.wunderground.com/US/OR/Bend.html",
				iconUrl: "http://icons-ak.wxug.com/i/c/k/partlycloudy.gif",
				weather: "Partly Cloudy",
				temp: "55.0 F (12.8 C)"
			},
			{
				name: "Manzanita",
				forecastUrl: "http://www.wunderground.com/US/OR/Manzanita.html",
				iconUrl: "http://icons-ak.wxug.com/i/c/k/rain.gif",
				weather: "Light Rain",
				temp: "55.0 F (12.8 C)"
			}
		]
	};
}

var express = require("express");
var app = express();
var fortune = require("./lib/fortune.js");

// handlebars
var handlebars = require("express-handlebars")
		.create({defaultLayout: "main"});
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

// port
app.set("port", process.env.PORT || 3000);

// public
app.use(express.static(__dirname + "/public"));

// special url for tests
app.use(function(req, res, next) {
	res.locals.showTests = app.get("env") !== "production" &&
			req.query.test === "1";
	next();
});

// weather partial via res.locals
app.use(function(req, res, next) {
	if (!res.locals.partials) res.locals.partials = {};
	res.locals.partials.weather = getWeatherData();
	next();
});

// routes
app.get("/", function(req, res) {
	res.render("home");
});
app.get("/about", function(req, res) {
	res.render("about", {
		fortune: fortune.getFortune(),
		pageTestScript: "/qa/tests-about.js"
	});
});

// custom 404 page
app.use(function(req, res) {
	res.status(404);
	res.render("404");
});

// custom 500 page
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render("500");
});

app.listen(app.get("port"), function() {
	console.log("Express started on http://localhost:" +
			app.get("port") + "; press Ctrl-C to terminate.");
});
