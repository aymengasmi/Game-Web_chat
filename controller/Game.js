// Factorisation du code concernant la gestiond des pages room
var Game = require('game');

exports.showAll = function (req,res)
{
	var tabroom = [];
	
	for(var i=0;i<GLOBAL.dico_room.length;i++)
	{
		if(!GLOBAL.dico_room[i].end)
			tabroom.push(GLOBAL.dico_room[i].resume());
	}
	
	res.render('room.ejs',{rooms:JSON.stringify(tabroom)});
}

exports.create=function(req,res,io){
	var id = GLOBAL.dico_room.length;
	var name = req.param('name');
	var mplayers = req.param('maxplayers');

	if(name == '')name='HardTime';
	if(mplayers < 1 || mplayers > 5)mplayers=2;
	var game=new Game(id,name,mplayers);
	GLOBAL.dico_room.push(game);
		
	io.of('/room').emit('gamenew',{id:id,title:name,maxPlayers:mplayers});
	console.log('New game :('+id+';'+name+';'+mplayers+') - info diffusée sur le channel room.');

	res.redirect('/room');
}


exports.joinGame= function(req,res,io){
	var tabid = findGameTabID(req.param('id'));
		
	if(tabid == -1)
	{
		res.redirect('/room');
	}
	else
	{
		var game=GLOBAL.dico_room[tabid];
		var spectateur=!game.canAddPlayer() || game.hasStart;

		if(game.end)res.redirect('/room');
		else
		{
			res.render('game.ejs',{id:tabid,spectateur:spectateur,game:JSON.stringify(game.resume())});
		}
	}
}

function findGameTabID(id)
{
	var roomsupposed = GLOBAL.dico_room[id];

	if(roomsupposed != undefined && roomsupposed.id==id)
		return id;

	for(var i = 0;i<GLOBAL.dico_room.length;i++)
	{
		if(GLOBAL.dico_room[i].id == id)
			return i;
	}	

	return -1;
}
