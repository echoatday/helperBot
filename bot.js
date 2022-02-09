const { Client, Intents, MessageEmbed } = require('discord.js');
const config = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//!time
function unixTimer(theMessage) {
	theMessage = theMessage.replace('!time ','').toLowerCase();
	theMessage = theMessage.replace('nzst','+12');
	theMessage = theMessage.replace('nzt','+12');
	const timeEmbed = new MessageEmbed()
		.addFields(
			{name: 'Date', value: 'Time', inline: true},
		);
	var theDate = new Date(theMessage);
	unixTime = (theDate.getTime() / 1000).toFixed(0);
	if(unixTime === 'NaN') {
		timeEmbed.color = '#ff0000';
		timeEmbed.title = 'Incorrect Input'
		timeEmbed.description = 'Valid Format: !time may 01 2021 10:30 pm est';
		rollEmbed.fields = [];
	}
	else {
		timeEmbed.color = '#00ff00';
		timeEmbed.fields[0].name = '<t:' + unixTime + ':D>';
		timeEmbed.fields[0].value = '<t:' + unixTime + ':t>';
	}
	return ({embeds: [timeEmbed]});
}

//!roll
function rollDice(theMessage) {
	theMessage = theMessage.replace('!roll ','');
	const rollEmbed = new MessageEmbed()
		.addFields(
			{name: '│ Rolls', value: 'invalid', inline: true},
			{name: '│ Mods', value: 'invalid', inline: true},
			{name: '│ Total', value: 'invalid', inline: true},
		);
	var mathroll;
	var numbers;
	var rolls = '│ ';
	var total = 0;
	var modifier = '│ ';
	var finalTotal = '│ ';

	//split values into an array of numbers
	if (theMessage.includes('+')) {
		mathroll = theMessage.split('+');
		numbers = mathroll[0].split('d');
	}
	else if (theMessage.includes('-')) {
		mathroll = theMessage.split('-');
		numbers = mathroll[0].split('d');
	}
	else {
		mathroll = theMessage;
		numbers = mathroll.split('d');
	}

	//construct output for 'rolls' and 'total'
	for (let i = 0; i < parseInt(numbers[0]); i++) {
		currentNumber = Math.floor( Math.random() * parseInt(numbers[1]) ) + 1;
		rolls = rolls + currentNumber;
		if(i !== parseInt(numbers[0]) - 1) { rolls = rolls + ' | ' }
		total += parseInt(currentNumber);
	}

	//update total based on modifier value
	if (theMessage.includes('+')) {
		total = total + parseInt(mathroll[1]);
		modifier = modifier + '+' + parseInt(mathroll[1]);
	}
	else if (theMessage.includes('-')) {
		total = total - parseInt(mathroll[1]);
		modifier = modifier + '-' + parseInt(mathroll[1]);
	}
	finalTotal = finalTotal + total;

	//final output
	if(total == 0) {
		rollEmbed.color = '#ff0000';
		rollEmbed.title = 'Incorrect Input'
		rollEmbed.description = 'Valid Format: !roll 2d6+1';
		rollEmbed.fields = [];
	}
	else {
		rollEmbed.color = '#00ff00';
		rollEmbed.fields[0].value = rolls;
		rollEmbed.fields[1].value = modifier;
		rollEmbed.fields[2].value = finalTotal;
	}
	return ({embeds: [rollEmbed]});
}

// command listener
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
	theMessage = '';
});

client.login(config.token);