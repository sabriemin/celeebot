const Discord = require('discord.js'); //discord.js yi tanımlıyoruz!
const client = new  Discord.Client(); //clientımızı tanımlıyoruz!
const qwertyl = require('qwerty-lib'); // ve Qwerty.L yi tanımlıyoruz!
const db = require('wio.db');
require('dotenv').config();

let  QwertylAyar = {
    sahipId: ["307553207067082752"], //sahiplerin idsi
    prefix:  "q!", //botun prefixi
    etiketlePrefixVer: true, //Biri Botu Etiketleyince Bot Prefixini Atar
    etiketlePrefixKullan: true, //etiketi prefix yerine kullanırsınız
    komutKlasör:  "./komutlar", //komut klasörümüz
    eventKlasör:  "./eventler", //event klasörümüz
    botlarKullanabilsin: false, //botların komut kullanabilmesi
    DMKabul: false, //dmden komut alma
    KomutLog: true, //bir komut kullanıldığında konsola log gelir
    komutBulamayıncaHata: true //Eğer Kullanıcı Olamayn Bir Komudu Kullanmaya Çalışırsa Discordan Bir Embed Mesajı İle Komut Bulunamadı Yazıcak
};

client.on('messageReactionAdd', async (reaction, user) => {
    const logKanal = client.channels.cache.get(await db.fetch('ticketLog'));
    if(user.partial) await user.fetch();
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();

    if(user.bot) return;
    if(reaction.emoji.name == '🎫') {
        if(await db.fetch(`ticketId`) == null || undefined){
            await db.add(`ticketId`, 1)
        }
        let biletid = db.fetch(`ticketId`);
        await reaction.users.remove(user);

        reaction.message.guild.channels.create(`ticket-${biletid}`, {
            permissionOverwrites: [
                {
                    id: reaction.message.guild.roles.everyone,
                    deny: ["VIEW_CHANNEL"]
                },
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                }
            ],
            type: 'text'
        }).then(async channel => {
            const hgEmbed = new Discord.MessageEmbed()
            .setTitle('Biletine Hoşgeldin!')
            .setDescription(`**Bileti Açan:** <@${user.id}>\n**Bilet İd:**${biletid}\n**Ticketı Kapatmak İçin ❌ Ya Tıklayın**`)
            .setThumbnail(user.avatarURL())
            .setColor('BLUE')
            .setFooter('Qwerty.R | Lütfen Sabırlı Olun...', user.avatarURL());
            channel.send(hgEmbed).then(async r =>{
                r.react('❌');
            });
            var idt = channel.name
            const logEmbed = new Discord.MessageEmbed()
                .setTitle("Ticket | Ticket Açıldı!")
                .setThumbnail(user.avatarURL())
                .setDescription(`Ticket Açan: **<@${user.id}>**\nTicket id: **${idt.replace("ticket-", "")}**`)
                .setColor('GREEN')
                .setFooter(new Date().toLocaleString());
            logKanal.send(logEmbed);
            await db.add(`ticketId`, 1);
        })
    }
    if(reaction.emoji.name == '❌') {
        const fetchedChannel = reaction.message.guild.channels.cache.find(r => r.id === reaction.message.channel.id);
        fetchedChannel.delete();
        await user.send("Ticket Başarıyla Silindi!");
        var idt = reaction.message.channel.name
        const logEmbed = new Discord.MessageEmbed()
                .setTitle("Ticket | Ticket Kapatıldı")
                .setThumbnail(user.avatarURL())
                .setDescription(`Ticket Kapatan: **<@${user.id}>**\nTicket İd: **${idt.replace("ticket-", "")}**`)
                .setColor('RED')
                .setFooter(new Date().toLocaleString());
            logKanal.send(logEmbed);
    }
})

const qApp = new  qwertyl(client, QwertylAyar); // Qwerty.Lnin Çalışması İçin Gerekli Olan Client Ve Ayarlarımızı Tanımlıyoruz (tam olarak öyle değil..)

client.on('message', async  message  => {
qApp.mesaj(client, message, QwertylAyar); //bir mesaj geldiğinde Qwerty.L'ye söylüyoruz (tam olarak öyle değil.. x2)
});
client.login(process.env.TOKEN); // tokenle Giriş Yapıyoruz