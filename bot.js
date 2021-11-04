const { Client, Intents } = require('discord.js');
const config = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


//functions
function unixTimer(theMessage) {
	theMessage = theMessage.replace('!time ','').toLowerCase();
	theMessage = theMessage.replace('nzst','+12');
	theMessage = theMessage.replace('nzt','+12');
	var theDate = new Date(theMessage);
	unixTime = (theDate.getTime() / 1000).toFixed(0);
	if(unixTime === 'NaN') {
		theMessage = 'Valid format: !time may 01 2021 10:30 pm est'
	}
	else {
		theMessage = '<t:' + unixTime + '>';
	}
	return theMessage;
}

function rollDice(theMessage) {
	theMessage = theMessage.replace('!roll ','');
	const numbers = theMessage.split('d');
	var output = '';
	var total = 0;
	for (let i = 0; i < parseInt(numbers[0]); i++) {
		currentNumber = Math.floor( Math.random() * parseInt(numbers[1]) ) + 1;
		output = output + currentNumber + ", ";
		total += parseInt(currentNumber);
	}
	output = output + "TOTAL: " + total;

	if(output === 'TOTAL: 0') {
		theMessage = 'Valid format: !roll 2d6';
	}
	else {
		theMessage = output;
	}
	return theMessage;
}


// command checker
client.on('messageCreate', message => {
	theMessage = message.content;
	if(theMessage.startsWith('!time')) {
		message.channel.send(unixTimer(theMessage));
	}
	else if(theMessage.startsWith('!roll')) {
		message.channel.send(rollDice(theMessage));
	}
	else if(theMessage.startsWith('!help')) {
		message.channel.send('Valid commands: !time, !roll');
	}
	else if (message.content === '!hello') {
    	message.channel.send('Fuck every little annoying creature on this planet and fuck you.');
  	}
	theMessage = '';
});

client.login(config.token);