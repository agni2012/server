function Player(x, y){
	this.x = x;
	this.y = y;
}
var players = [
];
function send(data, ws){
	if(!ws){	
		throw new Error("Send("+data+") expected a ws arg")
	}
	var str = JSON.stringify(data);
	ws.send(str);
	return str;
}
module.exports = {
	onConnection: function(ws){
		console.log("Client Connected")
	},
	onMessage: function(message, ws){
		//console.log(message.action)
		switch (message.action){
			case "getPlayers":
				send({
					action: "getPlayers",
					reply: players
				}, ws);
			break;
			case "newPlayer":
				players.push(new Player(100,100));
				send({
					action: "newPlayer",
					reply: players.length-1, //This is the index of player
				}, ws);
				break;
			case "updatePlayerPos":
				var {x, y, index} = message.reply; //updatePlayerPos
				players[index].x=x;
				players[index].y=y;
			break;
				
		}
		
	},
	onClose: function(){
		console.log("Bye")
	}
}
