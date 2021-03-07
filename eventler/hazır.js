module.exports = client  => {
    client.user.setStatus("online"); // botu çevrimiçi yapıyoruz
    client.user.setActivity('QwertyR Ticket Bot Altyapısı!', {type: "PLAYING"}); //ve burası oynuyor kısmı
}