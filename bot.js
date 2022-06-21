const { Client, Intents, MessageEmbed } = require('discord.js');
// const { joinVoiceChannel } = require('@discordjs/voice');
const replies = require('./replies.json');
require('dotenv').config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

function randomElement(array) {
	return array[Math.floor(Math.random() * array.length)]
}

// #formatting, #helpCommands, #nameReply, #messageError
function errorMessage(theMessage, formatting) {
	return (
	randomElement(replies.errorLogText).replace('#messageError',theMessage) +
	'\n\n' + 
	randomElement(replies.formatText).replace('#formatting',formatting)
	)
}

//^help
function helpMessage(user, errorType) {
	const helpEmbed = new MessageEmbed();
	helpEmbed.color = '#0000ff';
	helpEmbed.title = randomElement(replies.errorNameText).replace('#nameReply',user.username);
	helpEmbed.description = randomElement(errorType).replace('#helpCommands','`^time`, `^roll`, `^help`.');
	return ({embeds: [helpEmbed]});
}

//^time
function unixTimer(theMessage) {
	theMessage = theMessage.replace('^time ','').toLowerCase();
	theMessage = theMessage.replace('nzst','+12');
	theMessage = theMessage.replace('nzt','+12');
	const timeEmbed = new MessageEmbed()
		.addFields(
			{name: 'Date', value: 'Time', inline: true},
		);
	var theDate = new Date(theMessage);
	unixTime = (theDate.getTime() / 1000).toFixed(0);
	if(unixTime === 'NaN') {
		formatting = 'may 01 2021 10:30 pm gmt';
		timeEmbed.color = '#ff0000';
		timeEmbed.title = randomElement(replies.errorStartText);
		//timeEmbed.description = 'Valid Format: ^time may 01 2021 10:30 pm est';
		timeEmbed.description = errorMessage(theMessage, formatting)
		timeEmbed.fields = [];
	}
	else {
		timeEmbed.color = '#00ff00';
		timeEmbed.fields[0].name = '<t:' + unixTime + ':D>';
		timeEmbed.fields[0].value = '<t:' + unixTime + ':t>';
	}
	return ({embeds: [timeEmbed]});
}

//^roll
function rollDice(theMessage) {
	theMessage = theMessage.replace('^roll ','');
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
	if(total == 0 || isNaN(total)) {
		formatting = '^roll 2d6+1';
		rollEmbed.color = '#ff0000';
		rollEmbed.title = randomElement(replies.errorStartText);
		rollEmbed.description = errorMessage(theMessage, formatting);
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
	user = message.author;
	if(theMessage.startsWith('^time')) {
		message.reply(unixTimer(theMessage));
	}
	else if(theMessage.startsWith('^roll')) {
		message.reply(rollDice(theMessage));
	}
	else if(theMessage.startsWith('^help')) {
		message.reply(helpMessage(user,replies.helpText));
	}
	/*else if(theMessage.startsWith('^join')) {
	}
	else if(theMessage.startsWith('^leave')) {
	}*/
	else if(theMessage.startsWith('^')) {
		message.reply(helpMessage(user,replies.errorHelpText))
	}
	theMessage = '';
});

client.login(process.env.TOKEN);