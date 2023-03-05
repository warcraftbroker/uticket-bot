import  config from '../config.json' assert { type: "json" };
import  createWelcomeMsgEmbed from './embeds.js';

/**
 * Sets up and sends the public Message from which users can initiate 
 * a support ticket request. The request is sent to the channel 
 * specified under 'requestChannelId' within the config.json file
 * 
 * @param {
 * } client 
 */
export default async function sendPublicTicketMsg(client) {
    client.channels.fetch(config.requestChannelId)
    .then(async channel => {

        // Set up buttons for each boost category (dungeon, level, raid)
        const ticketChannelRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('dnd_dungeon_client_request')
                .setLabel('Dungeon Boost')
                .setStyle(ButtonStyle.Primary),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('dnd_level_client_request')
                .setLabel('Level Boost')
                .setStyle(ButtonStyle.Primary),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('dnd_raid_client_request')
                .setLabel('Raid Boost')
                .setStyle(ButtonStyle.Primary),
        );
        
        // Assemble and send message
        const boostClientEmbed = await createWelcomeMsgEmbed();
        channel.send({embeds:[boostClientEmbed], components: [ticketChannelRow]});
    });
}