const Discord = require('discord.js'); //discord.js yi tanımlıyoruz!
const db = require('wio.db');
let ticketLogid = "814409171835158569"

module.exports = {
    //yeni bir boşluk açıyoruz
    isim: "ticket", //ismini veriyoruz
    aciklama: "ticket açar", //aciklamasını !help için yazıyoruz
    kestirme: ["bilet"],
    sahipOzel: true,
    async calistir(client, message, args){
        await db.set('ticketLog', ticketLogid);
        const logKanal = client.channels.cache.get(await db.fetch('ticketLog'));
        const yetkinyok = new Discord.MessageEmbed()
            .setTitle("HATA!")
            .setDescription("YETKİN YOK!")
            .setColor("ff0000")
            .setFooter(new Date().toLocaleString());
        if(!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(yetkinyok);
        if(!args[0])return message.channel.send("Hata: `!ticket **kapat/sistem**`")
        if(args[0] === 'sistem'){
        let channel = client.channels.cache.get('814256431183822878')

        const embed = new Discord.MessageEmbed()
            .setTitle("Ticket Sistemi")
            .setDescription("🎫 Emojisine Tıklarsanız Ticket Açarsınız")
            .setFooter("Ticket sistemi")
            .setColor("GREEN")

        channel.send(embed).then(async msg => {
            msg.react('🎫');
        });

        message.channel.send("Oldu Bil!");
        }
        if(args[0] === 'kapat'){
            if(!args[1])return message.channel.send("Hata: Bir İd Belirt!");
            if(isNaN(args[1]))return message.channel.send("Hata: id Bir Sayı Olmalı!");
            if(!message.guild.channels.cache.find(r => r.name === "ticket-" + args[1])) return message.channel.send("Hata: Böyle Bir Ticket Yok!");
            if(message.guild.channels.cache.find(r => r.name === "ticket-" + args[1])){
            const tkanal = message.guild.channels.cache.find(r => r.name === "ticket-" + args[1]);
                tkanal.delete();
                message.author.send('Ticket Kapatıldı!');
            const logEmbed = new Discord.MessageEmbed()
                .setTitle("Ticket | Ticket Kapatıldı")
                .setThumbnail(message.author.avatarURL())
                .setDescription(`Ticket Kapatan: **<@${message.author.id}>**\nTicket İd: **${args[1]}**`)
                .setColor('RED')
                .setFooter(new Date().toLocaleString());
            logKanal.send(logEmbed);
            }
        }
    }
};