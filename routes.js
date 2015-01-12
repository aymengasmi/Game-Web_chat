//Différentes routes de l'application


//Récupération des controllers
var game = require('./controller/Game');

module.exports = function(app,io)
{
	// Page d'accueil
	app.get('/', function(req, res)
	{
		res.render('index');
	});

	
	// Pages des refles du jeu
	app.get('/rules', function(req,res){

		res.render('rules');
	});

	//Page d'affichage de toutes les parties dispo
	app.route('/room').get(game.showAll);

	//Creation d'une nouvelle partie
	app.route('/create').get(function(req,res){game.create(req,res,io);});

	//Rejoindre une partie
	app.route('/game/:id').get(function(req,res){game.joinGame(req,res,io);});

}
