// Require the necessary discord.js classes
import { Client, Events, GatewayIntentBits } from 'discord.js';
import  config from './config.json' assert { type: "json" };
import { closeTicket, createTicket } from './modules/buttons.js';
//import sendPublicTicketMsg from './modules/sendPublicTicketMsg';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// The following arrays will contain {userId,ticketChannel} references that track open tickets within the corresponding categories
const ticketTracker = {
	dungeon:[],
	level: [],
	raid: []
};

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, async c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	// Uncomment to send ticket channel message embed
	// sendPublicTicketMsg(client); 
});

// This code will run each time a user triggers an event
client.on(Events.InteractionCreate, async interaction => {

    // Handle create ticket event
	if (interaction.isButton() && (
        interaction.customId === 'dnd_dungeon_client_request' ||
        interaction.customId === 'dnd_level_client_request' ||
        interaction.customId === 'dnd_raid_client_request'

        )) {
        await interaction.deferReply({ ephemeral: true });

        createTicket(interaction, ticketTracker);
	
    }

    // Handle close ticket event
	if (interaction.isButton() && interaction.customId === 'dnd_close_ticket') {
        await interaction.deferReply({ ephemeral: true });

        closeTicket(interaction, ticketTracker);

    }
});

// Log in to Discord with your client's token
client.login(config.token);
