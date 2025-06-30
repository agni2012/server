var banIds=[

];
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

 
var WS = require('ws');
var ws = WS, websocket = WS, webSocket = WS, WebSocket = WS; //aliases
const path = require('path');
//BETA{
const game = require('./game'); 
//}
const fs = require('fs');
var now = new Date();


app.use(express.static(path.join(__dirname, '..')));


// Middleware to parse JSON request bodies
app.use(express.json());


// Define routes for your HTML pages
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, '..', 'index.html')); });

app.get('/life', (req, res) => { res.sendFile(path.join(__dirname, '..', 'lifething.html')); });
app.get('/home', (req, res) => {res.sendFile(path.join(__dirname, '..', 'home.html'));});
app.get('/contact', (req, res) => {res.sendFile(path.join(__dirname, '..', 'contact.html')); });
app.get('/gamespage', (req, res) => {res.sendFile(path.join(__dirname, '..', 'gamespage.html'));});
app.get('/me', (req, res) => {res.sendFile(path.join(__dirname, '..', 'me.html')); });
app.get('/movies', (req, res) => {res.sendFile(path.join(__dirname, '..', 'movies.html')); });
app.get('/secrets', (req, res) => {res.sendFile(path.join(__dirname, '..', 'secrets.html')); });
app.get('/chat', (req, res) => {res.sendFile(path.join(__dirname, '..', 'chat.html')); });

//I have no clue WTI
const { exec } = require('child_process');
//My security is awsome (:<
app.get('/log', (req, res) => {
    res.sendFile(path.join(__dirname, 'password.html'), (err) => {
        if (err) {
            console.error('Error sending log file:', err);
            res.status(err.status).end();
        }
    });
});
app.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, 'news.html'));
});
app.get('/messages', (req, res) => {
    const htmlContent = fs.readFileSync('messages.html', 'utf8');
    res.status(200).send(htmlContent);
    //console.log("Requested Messages: "+htmlContent)
});

//Start the messages Updated function
var messagesUpdated = function(){
	//console.log("m.u.");
};
var profanityFilterOn=true;

var badWords = [
    "f.ck", "..gg.r", "b.lls", "p.n.s","di.k", 
];


function profanityFilter(str) {
    var regex = new RegExp(badWords.join('|'), 'gi');
    return str.replace(regex, function(match) {
        return "<i>[redacted]</i>";
    });
}


app.get('/messageUpdates', (req, res) => {
	
		messagesUpdated = function(){
		
			try{
				const htmlContent = fs.readFileSync('messages.html', 'utf8');
    			res.status(200).send(htmlContent);
		
			}catch(e){
				console.log("Someone is spamming it?")
			}
		}
});



app.post('/passwordcheck', (req, res) => {
    let password = req.body.password;
    var correctPswd = 'console.log("hello world");';
    var commandPswd = 'COM '
	var incorPswd = "123x"
	var specialPasswords = {
		"crash-server": function() {
		    console.log("E-SHUTTING-DOWN");
		    process.exit(1);
		},
		/*"run": function(arg) {
			var out = "";
			try{
		    	out = eval(arg)
		    }catch(e){
		    	out = e.message;
		    }
		    return out;
		},*/
		"ban": function(arg){
			arg=""+arg.trim();
			fs.appendFile('banids.txt', arg, (err) => {});
			return "banned: "+arg;
		},
		"unban": function(arg){
			arg = arg.trim();
			fs.readFile('banids.txt', 'utf8', (err, data) => {
				if (err) return "Error reading ban list";
				
				var banList = data.split("\n").filter(entry => entry && entry !== arg);

				fs.writeFile('banids.txt', banList.join("\n"), (err) => {
				    if (err) return "Error updating ban list";
				});
			});
			return "unbanned: " + arg;
		},
		"getbanlist":function(arg){
				
		    var file = fs.readFileSync('banids.txt', 'utf8').split("\n");
		    return "ban list: "+file.join("<br>");
		},
		"setbanlist":function(arg){
			fs.writeFile('banids.txt', arg, (err) => {
			    if (err) return "Error updating ban list";
			});
			return "set banids.txt to: "+arg.split("\n").join("<br>")
		},
		"toggleswearfilter":function(){
			profanityFilterOn =! profanityFilterOn;
		}
		
	};
	var special = false;
	for (var i in specialPasswords) {
		if (password.startsWith(commandPswd+i + ":") || password === i) {
		    var arg = password.includes(":") ? password.split(":").slice(1).join(":") : null;
		    
		    var output = specialPasswords[i](arg);
		    
		    console.log("input:"+password+", output: "+output)
		    special = true;
		    res.status(200).send(String(output)); // Return error response for bad code
		    
		    break;
		}
	}
	if(!special){
		if (password === correctPswd) {
		    // Serve the secret file if the password is correct
		    res.sendFile(path.join(__dirname, 'log.html'));
		} else if(password != incorPswd){
		    // Send a plain text message if the password is incorrect
		    res.status(401).send('Incorrect password!');
		}else{
			
		    res.sendFile(path.join(__dirname, 'kill.html'));
		}
    }
});
// Handle contact;
app.post('/contact', (req, res) => {
	let out=null;
    const { name, email, message, type} = req.body;  // Destructure name, email, and message from req.body
    console.log(`Received contact form submission: ${name}, ${email}, ${message}`);
    
    // Create a log entry
    const logEntry = `Name: ${name}, Email: ${email}, Message: ${message}, TYPE: -${type}-`;
	now = new Date();
	
    // Append the log entry to the log.html file
    
    
    fs.appendFile('log.html', logEntry+" -@- "+now+"\n<br>", (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).send('Internal Server Error');
        }
        
    });
    if (out) {
        res.send(out);  // Send the custom message if the secret is found
    }
});

app.post('/news', (req, res) => {
	let out=null;
    const {message} = req.body;  // Destructure name, email, and message from req.body
    console.log(`Message: `+message);
    
    // Create a log entry
    const logEntry = `Message: ${message}`;
	now = new Date();
	//Its a ban question
	//if(messa)
    if(message.indexOf("BANNED") !== -1){
    	const data = fs.readFileSync('banids.txt', 'utf8');
  		if(data.indexOf(message.split(":")[1]) != -1){
  			return res.status(401).send('true')
  		}
  		return res.status(401).send('false')
    }
    if(message.indexOf("BAN ME") !== -1){
    	var id=message.split("ID:")[1];
    	fs.appendFile('news.html',id, (err) => {
		    if (err) {
		        console.error('Error writing to file:', err);
		        return res.status(500).send('Internal Server Error');
		    }
		    
		});
    }
    fs.appendFile('news.html', logEntry+" -@- "+now+"\n<br>", (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).send('Internal Server Error');
        }
        
    });
    if (out) {
        res.send(out);  // Send the custom message if the secret is found
    }
});


app.post('/chat', (req, res) => {
	try{
		var {message, name, shouldClear, id} = req.body; 
		if(message.indexOf(">") !== -1 || message.indexOf("<") !== -1){
			message = "Sorry. I dont allow '<' and '>' for safety reasons";		
		}
		message = profanityFilter(message);
		
		//message = s(message);
		const htmlCode = `<div class="${name}">${message}</div>\n`
		
		console.log(message)
		if(!shouldClear){
		
    		const banids = fs.readFileSync('banids.txt', 'utf8').split("\n");
    		console.log("banids: "+banids);
    		for(var i=0;i<banids.length;i++){
    			if(id==parseInt(banids[i])){
						return res.status(403).send('your banned');
    			}
    		}
			//console.log(message.split(":")[1].trim() == "/message");
			{
				fs.appendFile('messages.html', htmlCode, (err) => {
					if (err) {
						console.error('Error writing to file:', err);
						return res.status(500).send('Internal Server Error');
					}else{
						//Tell everyone that messages were updated
						console.log("mu")
						messagesUpdated();
					}
					
				});
			}
		}else{
			console.log("Clearing")
			fs.writeFile("messages.html","", (err) => {
				if (err) {
				    console.error('Error writing to file:', err);
				    return res.status(500).send('Internal Server Error');
				}
				else{
					//Tell everyone that messages were updated
					messagesUpdated();
				}
			});
		}
	}catch(e){
		res.status(500).send("Error 500. Internal Server Error:\n"+e+"\nPlease screenshot this or show me!");
		console.log("Error 500. Internal Server Error:\n"+e+"\nPlease screenshot this or show me!");
	}
    
    
});

app.get('/game', (req, res) => { res.sendFile(path.join(__dirname, '..', 'game.html')); });
// Start the server
var server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
	game.onConnection(ws);

    // Listen for messages from the client
    ws.on('message', (message) => {
    	message = JSON.parse(message.toString());
        //console.log('Received:', message);
        // Send a message to the client
        game.onMessage(message, ws);
    });
    // Notify when the WebSocket connection is closed
    ws.on('close', () => {
    	game.onClose(ws);
        console.log('WebSocket client disconnected');
    });
});
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

