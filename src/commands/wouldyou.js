const {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require('discord.js');
const guildLang = require('../util/Models/guildModel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wouldyou')
    .setDescription('Would you')
    .addSubcommand((subcommand) => subcommand.setName('useless').setDescription('Useless Power')
      .addBooleanOption((option) => option
        .setName('voting')
        .setDescription('Do you want the users to be able to vote?')))
    .addSubcommand((subcommand) => subcommand.setName('nsfw').setDescription('Borderline NSFW Questions')
      .addBooleanOption((option) => option
        .setName('voting')
        .setDescription('Do you want the users to be able to vote?')))
    .addSubcommand((subcommand) => subcommand.setName('useful').setDescription('Useful Power')
      .addBooleanOption((option) => option
        .setName('voting')
        .setDescription('Do you want the users to be able to vote?'))),

  /**
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    var power;
    let wouldyouembed;
    guildLang
      .findOne({ guildID: interaction.guild.id })
      .then(async (result) => {
        const { WouldYou, NSFW, Rather } = await require(`../languages/${result.language}.json`);
        const { Useless_Powers, Useful_Powers, Nsfw } = await require(`../data/power-${result.language}.json`);
        const button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel('Invite')
            .setStyle(5)
            .setEmoji('🤖')
            .setURL('https://discord.com/oauth2/authorize?client_id=981649513427111957&permissions=274878294080&scope=bot%20applications.commands'),
        );
        let voting;
        if (interaction.options.getBoolean('voting') == false) voting = false;
        else voting = true;
        const newbutton = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel('Replay')
            .setStyle(1)
            .setEmoji('🔄')
            .setCustomId(voting ? `wouldyou_${interaction.options.getSubcommand()}_voting` : `wouldyou_${interaction.options.getSubcommand()}`),
        );
        let rbutton;
        if (Math.round(Math.random() * 15) < 3) {
          rbutton = [button, newbutton];
        } else {
          rbutton = [newbutton];
        }
        switch (interaction.options.getSubcommand()) {
          case 'useful': {
            if (result.customTypes === "regular") {
              power = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];
            } else if (result.customTypes === "mixed") {
              let array = [];
              if (result.customMessages.filter(c => c.type === "useful") != 0) {
                array.push(result.customMessages.filter(c => c.type === "useful")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "useful").length)].msg || Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)]);
              } else {
                power = Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)];
              }
              array.push(Useful_Powers[Math.floor(Math.random() * Useful_Powers.length)]);
              power = array[Math.floor(Math.random() * array.length)]
              array = [];
            } else if (result.customTypes === "custom") {
              if (result.customMessages.filter(c => c.type === "useful") == 0) return await interaction.reply({ ephemeral: true, content: `${Rather.button.nocustom}` })
              power = result.customMessages.filter(c => c.type === "useful")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "useful").length)].msg;
            }

            wouldyouembed = new EmbedBuilder()
              .setColor('#0598F6')
              .setFooter({
                text: `${WouldYou.embed.footer}`,
                iconURL: client.user.avatarURL(),
              })
              .setTimestamp()
              .addFields({
                name: WouldYou.embed.Usefulname,
                value: `> ${power}`,
                inline: false,
              });
            break;
          }
          case 'useless': {
            if (result.customTypes === "regular") {
              power = Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];
            } else if (result.customTypes === "mixed") {
              let array = [];
              if (result.customMessages.filter(c => c.type === "useless") != 0) {
                array.push(result.customMessages.filter(c => c.type === "useless")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "useless").length)].msg || Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)]);
              } else {
                power = Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)];
              }
              array.push(Useless_Powers[Math.floor(Math.random() * Useless_Powers.length)]);
              power = array[Math.floor(Math.random() * array.length)]
              array = [];
            } else if (result.customTypes === "custom") {
              if (result.customMessages.filter(c => c.type === "useless") == 0) return await interaction.reply({ ephemeral: true, content: `${Rather.button.nocustom}` })
              power = result.customMessages.filter(c => c.type === "useless")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "useless").length)].msg;
            }

            wouldyouembed = new EmbedBuilder()
              .setColor('#F00505')
              .setFooter({
                text: `${WouldYou.embed.footer}`,
                iconURL: client.user.avatarURL(),
              })
              .setTimestamp()
              .addFields({
                name: WouldYou.embed.Uselessname,
                value: `> ${power}`,
                inline: false,
              });
            break;
          }
          case 'nsfw': {
            if (interaction.channel.nsfw == false) return await interaction.reply({ ephemeral: true, content: `${NSFW.embed.nochannel}` })
            // if statement only work when user votes 
            if (!result.nsfw == true) return await interaction.reply({ ephemeral: true, content: `${NSFW.embed.nonsfw}` })

          if (result.customTypes === "regular") {
            power = Nsfw[Math.floor(Math.random() * Nsfw.length)];
          } else if (result.customTypes === "mixed") {
            let array = [];
            if (result.customMessages.filter(c => c.type === "nsfw") != 0) {
              array.push(result.customMessages.filter(c => c.type === "nsfw")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "nsfw").length)].msg || Nsfw[Math.floor(Math.random() * Nsfw.length)])
            } else {
              power = Nsfw[Math.floor(Math.random() * Nsfw.length)];
            }
            array.push(Nsfw[Math.floor(Math.random() * Nsfw.length)]);
            power = array[Math.floor(Math.random() * array.length)]
            array = [];
          } else if (result.customTypes === "custom") {
            if (result.customMessages.filter(c => c.type === "nsfw") == 0) return await interaction.reply({ ephemeral: true, content: `${Rather.button.nocustom}` })
            power = result.customMessages.filter(c => c.type === "nsfw")[Math.floor(Math.random() * result.customMessages.filter(c => c.type === "nsfw").length)].msg;
          }

          wouldyouembed = new EmbedBuilder()
            .setColor('#F00505')
            .setFooter({
              text: `${WouldYou.embed.footer}`,
              iconURL: client.user.avatarURL(),
            })
            .setTimestamp()
            .addFields({
              name: WouldYou.embed.Nsfwname,
              value: `> ${power}`,
              inline: false,
            });
        }
        break; 
      }
        const message = await interaction.reply({
          embeds: [wouldyouembed],
          fetchReply: true,
          components: rbutton || [],
        }).catch((err) => { return; });
        if (interaction.options.getBoolean('voting') == false) {
        } else {
          try {
            await message.react('✅');
            await message.react('❌');
            const filter = (reaction) => reaction.emoji.name == '✅' || reaction.emoji.name == '❌';

            const collector = message.createReactionCollector({
              filter,
              time: 20000,
            });
            collector.on('collect', async () => {});

            collector.on('end', async () => {
              const totalreactions = message.reactions.cache.get('✅').count
                - 1
                + message.reactions.cache.get('❌').count
                - 1;
              let percentage = Math.round(
                ((message.reactions.cache.get('✅').count - 1)
                  / totalreactions)
                  * 100,
              );
              let emoji = null;
              let color = null;
              const userstotal = totalreactions < 2
                ? `${WouldYou.stats.user}`
                : `${WouldYou.stats.users}`;

              if (
                message.reactions.cache.get('✅').count
                  - 1
                  + message.reactions.cache.get('❌').count
                  - 1
                == 0
              ) {
                percentage = 0;
                emoji = '🤷';
                color = '#F0F0F0';
              }

              if (percentage > 50) {
                color = '#0598F6';
                emoji = '✅';
              } else if (percentage < 50) {
                color = '#F00505';
                emoji = '❌';
              } else {
                color = '#F0F0F0';
                emoji = '🤷';
              }

              wouldyouembed = new EmbedBuilder()
                .setColor(color)
                .setFooter({ text: `${WouldYou.embed.footer}`, iconURL: client.user.avatarURL() })
                .setTimestamp()
                .addFields(
                  {
                    name: WouldYou.embed.Uselessname,
                    value: `> ${power}`,
                    inline: false,
                  },
                  {
                    name: 'Stats',
                    value: `> **${percentage}%** ${WouldYou.stats.of} **${totalreactions} ${userstotal}** ${WouldYou.stats.taking} ${emoji}`,
                  },
                );

              try {
                await message.reactions.removeAll();
              } catch (error) {}
              await interaction.editReply({
                embeds: [wouldyouembed],
                components: rbutton || [],
              }).catch((err) => { return; });

              collector.stop();
            });
          } catch (error) {}
        }
      });
  },
};
