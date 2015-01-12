//Middleware permettant de créer une seule instance io par client et de partager la socket
var Game = require('game');
var Player = require('player');

module.exports = function(io)
{
	// Gestion des sockets client (page room) <> server
	var ioroom = io.of('/room');
	ioroom.on('connection', function(socket)
	{
		socket.on('disconnect', function() {
		});

	});

	// Gestion des sockets client (page game) <> server
	var iogame = io.of('/game');
	iogame.on('connection', function(socket)
	{
		socket.on('join', function(msg){
			socket.room="g"+msg.id;
			socket.idgame=msg.id;
			socket.join(socket.room);
			console.log("Connection du canal : game [room="+socket.room+"]");
		});

		socket.on('addplayer', function(msg){
			var name;
			var game=GLOBAL.dico_room[socket.idgame];	

			if(msg.name == undefined || msg.name == null || msg.name == "")name="DarkVador";else name=msg.name;		
			var idplayer = game.addPlayer(name,msg.color);

			if(idplayer == 0)game.setting(msg.width,msg.height);

			socket.idplayer=idplayer;
			
			if(idplayer > -1)
			{
				console.log("Adding player in game n°"+socket.idgame+" :("+idplayer+";"+name+";"+msg.color+")");
				socket.broadcast.emit("colorUnAvailable",{color:msg.color});
				ioroom.emit('gameupdate',{id:msg.id,player:name,nbPlayers:game.players.length});
				console.log('Update game n°'+game.id+' - info diffusée sur le channel room.');
				socket.emit("player",{name:name,color:msg.color,id:idplayer});
				socket.broadcast.to(socket.room).emit("jplayer",{name:name,color:msg.color,id:idplayer});

				socket.broadcast.to(socket.room).emit("log","Player "+name+" joined the party.");
				socket.emit("log","You have joined the party.");
				
				if(game.players.length == game.maxPlayers)
				{
					socket.broadcast.to(socket.room).emit("log","The game can begin.");
					iogame.in(socket.room).emit("canStart");
				}

			}else{socket.emit("log","Too many players or the color choosen is not available anymore.");}


		});

		socket.on('start',function()
		{
			var game=GLOBAL.dico_room[socket.idgame];			
			if(game.players.length = game.maxPlayers)
			{
				if(socket.idplayer > -1)
				{
					var game=GLOBAL.dico_room[socket.idgame];			

					if(!game.hasStart)
					{
						game.hasStart=true;
						iogame.in(socket.room).emit("start");
						socket.broadcast.to(socket.room).emit("log","The party begin");
						socket.emit("log","You have started the party.");
						console.log("Start game n°"+socket.idgame+" on channel /game [room="+socket.room+"] by player "+socket.idplayer);
						game.start(iogame,ioroom,socket.room);
					}
				}
			}
			
		});

		socket.on('upVx',function(){
			if(socket.idplayer > -1)
				GLOBAL.dico_room[socket.idgame].players[socket.idplayer].upVx();
		});

		socket.on('downVx',function(){
			if(socket.idplayer > -1)
				GLOBAL.dico_room[socket.idgame].players[socket.idplayer].downVx();
		});

		socket.on('upVy',function(){
			if(socket.idplayer > -1)
				GLOBAL.dico_room[socket.idgame].players[socket.idplayer].upVy();
		});

		socket.on('downVy',function(){
			if(socket.idplayer > -1)
				GLOBAL.dico_room[socket.idgame].players[socket.idplayer].downVy();
		});
	
		socket.on('becameSmaller',function(){
			if(socket.idplayer > -1)
				GLOBAL.dico_room[socket.idgame].players[socket.idplayer].becameSmaller();
		});

		socket.on('restLength',function(){
			if(socket.idplayer > -1)
				GLOBAL.dico_room[socket.idgame].players[socket.idplayer].restLength();
		});
		
		socket.on('stop',function(){
			if(socket.idplayer > -1)
				GLOBAL.dico_room[socket.idgame].players[socket.idplayer].stop();
		});

		socket.on('becameCircl',function(){
			if(socket.idplayer > -1)
				GLOBAL.dico_room[socket.idgame].players[socket.idplayer].becameCircl();
		});

		socket.on('becameRect',function(){
			if(socket.idplayer > -1)
				GLOBAL.dico_room[socket.idgame].players[socket.idplayer].becameRect();
		});


		socket.on('disconnect', function() {
			// leave the room
			if(socket.idplayer > -1)
			{
				GLOBAL.dico_room[socket.idgame].players[socket.idplayer].life=0;
			}
			socket.leave(socket.room);
			console.log("Deconnection du canal : game [room="+socket.room+"]");
		})


	});
}
