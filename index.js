const PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const uuid = require("uuid");

app.set("view engine", "ejs");

// Automatically parses the JSON for us
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

var dogsDB = {
	"12f46f29-4843-4a79-b306-e21601d46306": 
		{name: "Sherman", hairColor: "biscuit"},
	"9c882e5b-2b2e-46e6-9a6c-649c1707cd81":
		{name: "Doug", hairColor: "brindle"}
	}

// Index page, unused for us,
// we're only concerned with the /dogs routes
app.get("/", (req, res) => {
	res.render("index");
});

// Our list of dogs - GET /dogs
app.get('/dogs', (req, res) => {
	res.render("dogs/index", {dogs: dogsDB});
});

// New - GET /dogs/new
// used to show the form to create a dog
app.get("/dogs/new", (req, res) => {
	res.render("dogs/new");
});

// Create a dog - POST /dogs
// this route saves the dog, then redirects back to our index
app.post("/dogs", (req, res) => {
	// "name=Wyatt&hairColor=Yellow"
	// req.body results in: { name: "Wyatt", hairColor: "Yellow" }
	// req.body.name
	// req.body.hairColor

	let newId = uuid();
	dogsDB[newId] = req.body;

	res.redirect('/dogs')
});

// Show a specific dog - GET /dogs/:id
app.get("/dogs/:id", (req, res) => {
	const id = req.params.id;
	const dog = dogsDB[id];

	if (dog) {
		res.render("dogs/show", { dog: dog });
	} else {
		res.status(404);
		res.render("dogs/404");
	}
});

// Edit - GET /dogs/:id/edit
app.get("/dogs/:id/edit", (req, res) => {
	const id = req.params.id;
	const dog = dogsDB[id];

	if (dog) {
		res.render("dogs/edit", { id: id, dog: dog });
	} else {
		res.status(404);
		res.render("dogs/404");
	}
});

// Update - POST /dogs/:id
app.post("/dogs/:id", (req, res) => {
	console.log("the content of the form:", req.body);
	const id = req.params.id;
	const dog = dogsDB[id];

	if (dog) {
		// set this specific dog to equal the contents of the form
		dogsDB[id] = req.body;
		res.redirect("/dogs");
	} else {
	    res.redirect("/dogs");
	}
});

app.post("/dogs/:id/delete", (req, res) => {
	delete dogsDB[req.params.id];
	res.redirect("/dogs");
});



app.listen(PORT, () => {
  console.log(`app is running on http://localhost:${PORT}`)
});