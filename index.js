const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
  SlashCommandBuilder,
  REST,
  Routes
} = require('discord.js');

require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ⚙ CONFIG
const CATEGORY_ID = '1518764799192727594';

// ✏️ EDITE AQUI SUA META (APARECE PRA TODO MUNDO)
const META_TEXTO = 1. Gatilho 0/2000
2. Corpo de arma 0/2000
3. Carregador de SMG 0/2000
4. Carregador de pistola 0/2000
5. Alça de mira de SMG 0/2000
6. Alça de mira de pistola 0/2000

📊 **Meta de Farm**

📅 Frequência: Semanal  
💰 Tipo: 2k de cada farm acima   

📝 Observação:
Envie VIDEOS/FOTOS como prova de sua entrega do farm 
`;

// 🚀 COMANDO
const commands = [
  new SlashCommandBuilder()
    .setName('farm')
    .setDescription('Envia o painel de farm')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

client.once('ready', async () => {
  console.log(`Logado como ${client.user.tag}`);

  await rest.put(
    Routes.applicationGuildCommands(client.user.id, '1498173549486280846'),
    { body: commands }
  );
});

// 🎯 INTERAÇÕES
client.on('interactionCreate', async (interaction) => {

  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'farm') {

      const embed = new EmbedBuilder()
        .setColor('#00BFFF')
        .setTitle('🌿 Painel de Farm')
        .setDescription('Clique no botão abaixo para abrir sua pasta de farm.')
        .setImage('https://media.discordapp.net/attachments/1498166599495192727/1528121556503498853/file_00000000a3c8820e994ae9f55913f43c.png?ex=6a5e771a&is=6a5d259a&hm=cbc4922eac96b83ae16d2ff28e1f182353bcc549161eadd641e6ccaaefc4e653&=&format=webp&quality=lossless&width=1521&height=856');

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('abrir_pasta')
          .setLabel('📁 Abrir pasta')
          .setStyle(ButtonStyle.Success)
      );

      await interaction.reply({ embeds: [embed], components: [row] });
    }
  }

  // 📂 ABRIR PASTA
  if (interaction.isButton() && interaction.customId === 'abrir_pasta') {

    // 👇 AQUI FOI CORRIGIDO (nome do servidor)
    const nome = interaction.member.displayName
      .toLowerCase()
      .replace(/ /g, '-');

    const canal = await interaction.guild.channels.create({
      name: `farm-${nome}`,
      type: ChannelType.GuildText,
      parent: CATEGORY_ID,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel]
        }
      ]
    });

    const embed = new EmbedBuilder()
      .setColor('#00BFFF')
      .setTitle('📁 Pasta de Farm')
      .setImage('https://media.discordapp.net/attachments/1498166599495192727/1528121556503498853/file_00000000a3c8820e994ae9f55913f43c.png?ex=6a5e771a&is=6a5d259a&hm=cbc4922eac96b83ae16d2ff28e1f182353bcc549161eadd641e6ccaaefc4e653&=&format=webp&quality=lossless&width=1521&height=856')
      .setDescription(`👋 ${interaction.user}, essa é sua pasta de farm!\n\nUse os botões abaixo:`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({ text: 'Boa sorte no farm 🚀' });

    const botoes = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ver_metas')
        .setLabel('📊 Ver Metas')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId('fechar_pasta')
        .setLabel('❌ Fechar Pasta')
        .setStyle(ButtonStyle.Danger)
    );

    await canal.send({ embeds: [embed], components: [botoes] });

    await interaction.reply({
      content: `✅ Sua pasta foi criada: ${canal}`,
      ephemeral: true
    });
  }

  // 📊 VER METAS
  if (interaction.isButton() && interaction.customId === 'ver_metas') {

    const embed = new EmbedBuilder()
      .setColor('#00BFFF')
      .setTitle('📊 Metas de Farm')
      .setDescription(META_TEXTO)
      .setFooter({ text: 'Sistema de Farm' });

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }

  // ❌ FECHAR PASTA
  if (interaction.isButton() && interaction.customId === 'fechar_pasta') {
    await interaction.reply({ content: '🗑️ Fechando pasta...', ephemeral: true });

    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 3000);
  }

});

client.login(process.env.TOKEN);