import { EmbedBuilder } from 'discord.js';

// This embed is the public entry point for a user to initiate a new support ticket
function createPublicTicketEmbed() {
    const boostClientEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Boostanfrage')
	.setDescription('Wähle nachfolgend eine Kategorie aus um eine Boostanfrage zu starten!')
	.setFooter({ text: 'Mit freundlichen Grüßen\nDolly' });
    return boostClientEmbed;
}


// This is embed contains the welcome message that a user receives inside his private ticket text channel
function createWelcomeMsgEmbed(name){
    const boostClientEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setDescription(`Ein Organisator wird gleich für dich da sein. Nutze die Gelegenheit und lass uns schon mal ein paar Details zu deiner Anfrage zukommen.`)
    return boostClientEmbed;
}

export { createPublicTicketEmbed, createWelcomeMsgEmbed };
