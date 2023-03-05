import { ChannelType, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ComponentType, ActionRowBuilder } from 'discord.js';
import { createWelcomeMsgEmbed }  from './embeds.js';
import config from '../config.json' assert { type: "json" };

/**
 *  Handles close ticket button events
 * 
 * @param {interaction} interaction
 * @param {*} ticketTracker
 */
async function closeTicket(interaction, ticketTracker) {

    //Set up buttons for confirmation prompt
    const ticketMessageCloseOptions = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('dnd_close_ticket_confirm')
            .setLabel('Ja')
            .setStyle(ButtonStyle.Success),
    )        
    .addComponents(
        new ButtonBuilder()
            .setCustomId('dnd_close_ticket_deny')
            .setLabel('Nein')
            .setStyle(ButtonStyle.Danger),
    )

    // Send confirmation promt to user
    const confirmationPromt = await interaction.editReply({content: 'Bist du dir sicher, dass du diese Anfrage schließen willst?', components: [ticketMessageCloseOptions], ephemeral: true });
    
    // Initialize collector for Button interactions
    const buttonCollector = await confirmationPromt.createMessageComponentCollector({componentType: ComponentType.Button, max: 1});
    buttonCollector.on('collect', async j => {
        j.deferUpdate();

        if (j.customId === 'dnd_close_ticket_confirm') {

            // Edit confirmation prompt message 
            await interaction.editReply({content: 'Anfrage wird geschlossen.', components: [], ephemeral: true });

            // Remove user from the ticketTracker array
            ticketTracker.dungeon = ticketTracker.dungeon.filter(elem => elem.ticketChannel != interaction.channel.id)
            ticketTracker.level = ticketTracker.level.filter(elem => elem != interaction.channel.id) 
            ticketTracker.raid = ticketTracker.raid.filter(elem => elem != interaction.channel.id) 

            // Delete ticket channel
            interaction.channel.delete();
    
        }
        if (j.customId === 'dnd_close_ticket_deny') {
            
            // Send abort promt to user
            await interaction.editReply({content: 'Aktion abgebrochen', components: [], ephemeral: true });
    
        }
    });

}

/** 
 *  Handles create ticket button events
 * 
 * @param {interaction} interaction 
 * @param {*} ticketTracker
 */
async function createTicket(interaction, ticketTracker) {
    var categoryId = '';
    var limiterArray = undefined;

    switch (interaction.customId) {
        case 'dnd_dungeon_client_request':
            limiterArray = ticketTracker.dungeon;
            categoryId = config.mplusCategoryId;
            break;
        case 'dnd_level_client_request':
            limiterArray = ticketTracker.level;
            categoryId = config.levelCategoryId;
            break;
        case 'dnd_raid_client_request':
            limiterArray = ticketTracker.raid;
            categoryId = config.raidCategoryId;
            break;
        default:
            break;
    }

    // Check if user has already created a ticket of this category type
    if(limiterArray.find(elem => elem.userId == interaction.user.id) != undefined) {
        await interaction.editReply({content: 'Du hast in dieser Kategorie bereits eine Anfrage gestartet!', ephemeral: true });
        return;
    }

    // Set up text channel name, type, permissions and add channel close button.
    const ticketChannel = await interaction.guild.channels.create({
        name: interaction.member.displayName,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
              id: interaction.user.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
           },
           {
            id: '1080850372819697665',
            allow: [PermissionFlagsBits.ViewChannel]
           },
           {
            id: '970856650321833984',
            allow: [PermissionFlagsBits.ViewChannel],
         },
           {
            id: '872866700104728596',
            deny: [PermissionFlagsBits.ViewChannel]
           }
         ],
        parent: categoryId,
    });
    const ticketMessageButtonRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('dnd_close_ticket')
            .setLabel('Anfrage Schließen')
            .setStyle(ButtonStyle.Secondary),
    )

    // Send welcome message to user
    await ticketChannel.send({content:`<@${interaction.user.id}> <@&970856650321833984>!`, embeds:[createWelcomeMsgEmbed(interaction.member.displayName)], components: [ticketMessageButtonRow]});
    // Send success message
    await interaction.editReply({content: 'Deine Anfrage wurde erstellt!', ephemeral: true });
    // Add {userId,channel} reference to the ticketTracker array
    limiterArray.push({userId: interaction.user.id, ticketChannel: ticketChannel.id });
}

export { createTicket, closeTicket }