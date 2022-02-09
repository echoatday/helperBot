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

	var output = '│ ';
	var total = 0;
	modifier = '│ ';
	var finalTotal = '│ ';
	for (let i = 0; i < parseInt(numbers[0]); i++) {
		currentNumber = Math.floor( Math.random() * parseInt(numbers[1]) ) + 1;
		output = output + currentNumber;
		if(i !== parseInt(numbers[0]) - 1) { output = output + ' | ' }
		total += parseInt(currentNumber);
	}

	if (theMessage.includes('+')) {
		total = total + parseInt(mathroll[1]);
		// output = output + " +" + parseInt(mathroll[1]) + ", TOTAL: " + finalTotal;
		modifier = modifier + '+' + parseInt(mathroll[1]);

	}
	else if (theMessage.includes('-')) {
		total = total - parseInt(mathroll[1]);
		// output = output + " -" + parseInt(mathroll[1]) + ", TOTAL: " + finalTotal;
		modifier = modifier + '-' + parseInt(mathroll[1]);
	}
	else {
		// output = output + "TOTAL: " + total;

	}

	finalTotal = finalTotal + total;

	if(isNaN(total)) {
		theMessage = 'Valid format: !roll 2d6+1';
		return theMessage;
	}
	else {
		// theMessage = output;
		rollEmbed.fields[0].value = output;
		rollEmbed.fields[1].value = modifier;
		rollEmbed.fields[2].value = finalTotal;
		return ({embeds: [rollEmbed]});
	}
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