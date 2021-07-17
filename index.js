require('dotenv').config()
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.TOKEN)


//database
const db = require('./config/connection')
const collection = require('./config/collection')
const saver = require('./database/filesaver')


//DATABASE CONNECTION
db.connect((err) => {
    if (err) { console.log('error connection db' + err); }
    else { console.log('db connected'); }
})

//ID Channel/Group
const channelId = -1001363936843;

//Function
function first_name2(ctx){
    return `${ctx.from.first_name ? ctx.from.first_name : ""}`;
}
function last_name2(ctx){
    return `${ctx.from.last_name ? ctx.from.last_name : ""}`;
}
function username2(ctx){
    return `${ctx.from.username ? ctx.from.username : ""}`;
}
function captionbuild(ctx){
    return `<b>wajib join channel ke 2 @gingercandy22 selamat menikmati.</b>`;
}
function welcomejoin(ctx){
    return `Anda belum masuk, silakan masuk dulu!`;
}
function messagewelcome(ctx){
    return `Saya akan menyimpan file untuk Anda dan memberikan tautan yang dapat dibagikan, saya juga dapat membuat file tersedia untuk semua pengguna. Bot mendukung pencarian dan <a href="t.me/mdtohtmlbot">HTML</a>.`;
}
function messagebanned(ctx){
    return `⚠ANDA DILARANG KARENA MENYALAHGUNAKAN BOT, HUBUNGI ADMIN UNTUK BANDING.`;
}
function messagebotnoaddgroup(ctx){
    return `BOT belum masuk channel/grup pemiliknya.`;
}
function messagelink(ctx){
    return `Kirim BOT video, photo, dokumen dan suara.`;
}

// inline keyboard
const inKey = [
  [{text:'Pencarian',switch_inline_query:''},{text:'Tautan',callback_data:'POP'}],
  [{text:'Gabung Channel', url: 'https://t.me/gingerbackup33'}]
];

const inKey2 = [
  [{text:'Gabung Channel', url: 'https://t.me/gingerbackup33'}]
];

//BOT START
bot.start(async(ctx)=>{

    msg = ctx.message.text
    let msgArray = msg.split(' ')
    console.log(msgArray.length);
    let length = msgArray.length
    msgArray.shift()
    let query = msgArray.join(' ')

     user ={
        first_name:ctx.from.first_name,
        userId:ctx.from.id
    }

    var first_name3 = first_name2(ctx);
    var last_name3 = last_name2(ctx);
    var captionbuild2 = captionbuild(ctx);
    var welcomejoin2 = welcomejoin(ctx);
    var messagewelcome2 = messagewelcome(ctx);
    var messagebotnoaddgroup2 = messagebotnoaddgroup(ctx);

    if(ctx.chat.type == 'private') {
        if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
            //welcoming message on /start and if there is a query available we can send files
            if(length == 1){
                var profile = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
                if (!profile || profile.total_count == 0)
                    return ctx.reply(`${first_name3} ${last_name3} \n\n${messagewelcome2}`,{
                    parse_mode:'HTML',
                    reply_markup:{
                    inline_keyboard:inKey
                    }
                })
                    ctx.replyWithPhoto(profile.photos[0][0].file_id,{caption: `${first_name3} ${last_name3} \n\n${messagewelcome2}`,
                    parse_mode:'HTML',
                    reply_markup:{
                        inline_keyboard:inKey
                    }
                })
            }else{
                file = await saver.getFile(query).then((res)=>{
                console.log(res);
                if(res.type=='video'){
                    if (!res.caption)
                        return ctx.replyWithVideo(res.file_id,{caption: `\n\n${captionbuild2}`,
                            parse_mode:'HTML'
                        })
                        ctx.replyWithVideo(res.file_id,{caption: `${res.caption} \n\n${captionbuild2}`,
                            parse_mode:'HTML'
                        })
                    }else if(res.type=='photo'){
                        if (!res.caption)
                            return ctx.replyWithPhoto(res.file_id,{caption: `\n\n${captionbuild2}`,
                            parse_mode:'HTML'
                        })
                            ctx.replyWithPhoto(res.file_id,{caption: `${res.caption} \n\n${captionbuild2}`,
                            parse_mode:'HTML'
                        })
                    }else if(res.type=='document'){
                        if (!res.caption)
                            return ctx.replyWithDocument(res.file_id,{caption: `\n\n${captionbuild2}`,
                            parse_mode:'HTML'
                        })
                            ctx.replyWithDocument(res.file_id,{caption: `${res.caption} \n\n${captionbuild2}`,
                            parse_mode:'HTML'
                        })
                    }            
                })
            }
            //saving user details to the database
            saver.saveUser(user)
        }else{
            try {
                var botStatus = await ctx.telegram.getChatMember(channelId, ctx.botInfo.id)
                var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
                console.log(member);
                if (!member || member.status == 'left'){
                var profile2 = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
                if (!profile2 || profile2.total_count == 0)
                    return ctx.reply(`${first_name3} ${last_name3} \n\n${welcomejoin2}`,{
                        parse_mode:'HTML',
                        reply_markup:{
                            inline_keyboard:inKey2
                        }
                    })
                    ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `${first_name3} ${last_name3} \n\n${welcomejoin2}`,
                        parse_mode:'HTML',
                        reply_markup:{
                            inline_keyboard:inKey2
                        }
                    })
                }else{
                    //welcoming message on /start and if there is a query available we can send files
                    if(length == 1){
                        var profile3 = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
                        if (!profile3 || profile3.total_count == 0)
                            return ctx.reply(`${first_name3} ${last_name3} \n\n${messagewelcome2}`,{
                                parse_mode:'HTML',
                                reply_markup:{
                                    inline_keyboard:inKey
                                }
                            })
                            ctx.replyWithPhoto(profile3.photos[0][0].file_id,{caption: `${first_name3} ${last_name3} \n\n${messagewelcome2}`,
                                parse_mode:'HTML',
                                reply_markup:{
                                    inline_keyboard:inKey
                                }
                            })
                        }else{
                            file = await saver.getFile(query).then((res)=>{
                                console.log(res);
                                if(res.type=='video'){
                                    if (!res.caption)
                                        return ctx.replyWithVideo(res.file_id,{caption: `\n\n${captionbuild2}`,
                                        parse_mode:'HTML'
                                    })
                                        ctx.replyWithVideo(res.file_id,{caption: `${res.caption} \n\n${captionbuild2}`,
                                        parse_mode:'HTML'
                                    })
                                }else if(res.type=='photo'){
                                    if (!res.caption)
                                        return ctx.replyWithPhoto(res.file_id,{caption: `\n\n${captionbuild2}`,
                                        parse_mode:'HTML'
                                    })
                                        ctx.replyWithPhoto(res.file_id,{caption: `${res.caption} \n\n${captionbuild2}`,
                                        parse_mode:'HTML'
                                    })
                                }else if(res.type=='document'){
                                    if (!res.caption)
                                        return ctx.replyWithDocument(res.file_id,{caption: `\n\n${captionbuild2}`,
                                        parse_mode:'HTML'
                                    })
                                        ctx.replyWithDocument(res.file_id,{caption: `${res.caption} \n\n${captionbuild2}`,
                                        parse_mode:'HTML'
                                    })
                                }            
                            })
                        }

                        //saving user details to the database
                        saver.saveUser(user)
                    }
                }
            catch(error){
                ctx.reply(`${messagebotnoaddgroup2}`)
            }
        }
    }
})

//DEFINING POP CALLBACK
bot.action('POP',(ctx)=>{
    var messagelink2 = messagelink(ctx);
    ctx.deleteMessage()
    ctx.reply(`${messagelink2}`)
})

//check account
bot.command('getid',async(ctx)=>{
    var profile4 = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
    var first_name3 = first_name2(ctx);
    var last_name3 = last_name2(ctx);
    var username3 = username2(ctx);
    
    if(ctx.chat.type == 'private') {
        if (!profile4 || profile4.total_count == 0){
            ctx.reply(`<b>Name:</b> ${first_name3} ${last_name3}\n<b>Username:</b> @${username3 }\n<b>ID:</b> ${ctx.from.id}`,{
                parse_mode:'HTML'  
            })
        }else{
            ctx.replyWithPhoto(profile4.photos[0][0].file_id,{caption: `<b>Name:</b> ${first_name3} ${last_name3} \n<b>Username:</b> @${username3}\n<b>ID:</b> ${ctx.from.id}`,
                parse_mode:'HTML'
            })
        }
    }
})

//remove files with file_id
bot.command('rem', (ctx) => {
    msg = ctx.message.text
    let msgArray = msg.split(' ')
    msgArray.shift()
    let text = msgArray.join(' ')
    console.log(text);

    if(ctx.chat.type == 'private') {
        if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
            saver.removeFile(text)
            ctx.reply('✅ Dihapus')
        }
    }
})

//remove whole collection(remove all files)
bot.command('clear',(ctx)=>{

    if(ctx.chat.type == 'private') {
        if(ctx.from.id ==process.env.ADMIN){
            saver.deleteCollection()
            ctx.reply('✅ Dihapus')
        }
    }
})

//removing all files sent by a user
bot.command('remall', (ctx) => {
    msg = ctx.message.text
    let msgArray = msg.split(' ')
    msgArray.shift()
    let text = msgArray.join(' ')
    console.log(text);
    let id = parseInt(text)

    if(ctx.chat.type == 'private') {
        if(ctx.from.id ==process.env.ADMIN){
            saver.removeUserFile(id)
            ctx.reply('✅ Dihapus')
        }
    }
})

//broadcasting message to bot users(from last joined to first)
bot.command('send',async(ctx)=>{
    msg = ctx.message.text
    let msgArray = msg.split(' ')
    msgArray.shift()
    let text = msgArray.join(' ')

    if(ctx.chat.type == 'private') {
        userDetails = await saver.getUser().then((res)=>{
            n = res.length
            userId = []
            for (i = n-1; i >=0; i--) {
                userId.push(res[i].userId)
            }

            //broadcasting
            totalBroadCast = 0
            totalFail = []

            //creating function for broadcasting and to know bot user status
            async function broadcast(text) {
                for (const users of userId) {
                    try {
                        await bot.telegram.sendMessage(users, String(text),{
                            parse_mode:'HTML'
                          }
                        )
                    } catch (err) {
                        saver.updateUser(users)
                        totalFail.push(users)

                    }
                }
                ctx.reply(`✅ <b>Jumlah pengguna aktif:</b> ${userId.length - totalFail.length}\n❌ <b>Total siaran yang gagal:</b> ${totalFail.length}`,{
                    parse_mode:'HTML'
                })

            }
            if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
                broadcast(text)
                ctx.reply('Penyiaran dimulai (Pesan disiarkan dari terakhir bergabung hingga pertama).')

            }else{
                ctx.reply(`Perintah hanya bisa digunakan oleh Admin`) 
            }

        })
    }
})

//ban user with user id
bot.command('ban', (ctx) => {
    msg = ctx.message.text
    let msgArray = msg.split(' ')
    msgArray.shift()
    let text = msgArray.join(' ')
    console.log(text)
    userId = {
        id: text
    }

    if(ctx.chat.type == 'private') {
        if(ctx.from.id ==process.env.ADMIN|| ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
            saver.banUser(userId).then((res) => {
                ctx.reply('Dilarang')
            })
        }
    }
    
})

//unban user with user id
bot.command('unban', (ctx) => {
    msg = ctx.message.text
    let msgArray = msg.split(' ')
    msgArray.shift()
    let text = msgArray.join(' ')
    console.log(text)
    userId = {
        id: text
    }

    if(ctx.chat.type == 'private') {
        if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
            saver.unBan(userId).then((res) => {
                ctx.reply('✅ Selesai')
            })
        }
    }
})

//saving documents to db and generating link
bot.on('document', async (ctx) => {
    document = ctx.message.document
    console.log(ctx);
    fileDetails = {
        file_name: document.file_name,
        userId:ctx.from.id,
        file_id: document.file_id,
        caption: ctx.message.caption,
        file_size: document.file_size,
        uniqueId: document.file_unique_id,
        type: 'document'
    }
    console.log(fileDetails.caption);
    var first_name3 = first_name2(ctx);
    var last_name3 = last_name2(ctx);
    var welcomejoin2 = welcomejoin(ctx);
    var messagebanned2 = messagebanned(ctx);
    // var messagebotnoaddgroup2 = messagebotnoaddgroup(ctx);

    if(ctx.from.id ==process.env.ADMIN){
        saver.saveFile(fileDetails)
        if(ctx.chat.type == 'private') {
            ctx.reply(`<b>Nama file:</b> ${document.file_name}\n<b>Size:</b> ${document.file_size} KB\n<b>ID file:</b> ${document.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,{
                parse_mode:'HTML'
            })
        }
        if (!ctx.message.caption)
        return ctx.replyWithDocument(document.file_id, {
            chat_id: process.env.LOG_CHANNEL,
            caption: `<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> ${first_name3} ${last_name3}\n\n<b>Nama file:</b> ${document.file_name}\n<b>Size:</b> ${document.file_size} KB\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
            parse_mode:'HTML'
        })
        ctx.replyWithDocument(document.file_id, {
            chat_id: process.env.LOG_CHANNEL,
            caption: `${ctx.message.caption}\n\n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> ${first_name3} ${last_name3}\n\n<b>Nama file:</b> ${document.file_name}\n<b>Size:</b> ${document.file_size} KB\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
            parse_mode:'HTML'
        })
    }else{
        try{
            var botStatus2 = await ctx.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member2 = await bot.telegram.getChatMember(channelId, ctx.from.id)
            console.log(member2);
            if (!member2 || member2.status == 'left'){
                var profile5 = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
                if (!profile5 || profile5.total_count == 0)
                return ctx.reply(`${first_name3} ${last_name3} \n\n${welcomejoin2}`,{
                    parse_mode:'HTML',
                    reply_markup:{
                        inline_keyboard:inKey2
                    }
                })
                ctx.replyWithPhoto(profile5.photos[0][0].file_id,{caption: `${first_name3} ${last_name3} \n\n${welcomejoin2}`,
                    parse_mode:'HTML',
                    reply_markup:{
                        inline_keyboard:inKey2
                    }
                })
            }else{
                await saver.checkBan(`${ctx.from.id}`).then((res) => {
                    console.log(res);
                    if (res == true) {
                        if(ctx.chat.type == 'private') {
                            ctx.reply(`${messagebanned2}`)
                        }
                    } else {
                        saver.saveFile(fileDetails)
                        if(ctx.chat.type == 'private') {
                            ctx.reply(`<b>Nama file:</b> ${document.file_name}\n<b>Size:</b> ${document.file_size} KB\n<b>ID file:</b> ${document.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,{
                                parse_mode:'HTML'
                            })
                        }
                        if (!ctx.message.caption)
                        return ctx.replyWithDocument(document.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> ${first_name3} ${last_name3}\n\n<b>Nama file:</b> ${document.file_name}\n<b>Size:</b> ${document.file_size} KB\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                            parse_mode:'HTML'
                        })
                        ctx.replyWithDocument(document.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `${ctx.message.caption}\n\n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> ${first_name3} ${last_name3}\n\n<b>Nama file:</b> ${document.file_name}\n<b>Size:</b> ${document.file_size}KB\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                            parse_mode:'HTML'
                        })
                    }
                })
            }
        }
        catch(error){
            ctx.reply(`${messagebotnoaddgroup2}`)
        }
    }

})

//video files
bot.on('video', async(ctx) => {
    video = ctx.message.video
    console.log(ctx);
    fileDetails = {
        file_name: video.file_name,
        userId:ctx.from.id,
        file_id: video.file_id,
        caption: ctx.message.caption,
        file_size: video.file_size,
        uniqueId: video.file_unique_id,
        type: 'video'
    }
    console.log(fileDetails.caption);
    var first_name3 = first_name2(ctx);
    var last_name3 = last_name2(ctx);
    var welcomejoin2 = welcomejoin(ctx);
    var messagebanned2 = messagebanned(ctx);
    // var messagebotnoaddgroup2 = messagebotnoaddgroup(ctx);

    if(ctx.from.id ==process.env.ADMIN){
        saver.saveFile(fileDetails)
        if(ctx.chat.type == 'private') {
            ctx.reply(`<b>Nama file:</b>${video.file_name}\n<b>Size:</b> ${video.file_size} KB\n<b>ID file:</b> ${video.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,{
                parse_mode:'HTML'
            })
        }
        if (!ctx.message.caption)
        return ctx.replyWithVideo(video.file_id, {
            chat_id: process.env.LOG_CHANNEL,
            caption: `<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> ${first_name3} ${last_name3}\n\n<b>Nama file:</b> ${video.file_name}\n<b>Size:</b> ${video.file_size} KB\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
            parse_mode:'HTML'
        })
        ctx.replyWithVideo(video.file_id, {
            chat_id: process.env.LOG_CHANNEL,
            caption: `${ctx.message.caption}\n\n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> ${first_name3} ${last_name3}\n\n<b>Nama file:</b> ${video.file_name}\n<b>Size:</b> ${video.file_size} KB\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
            parse_mode:'HTML'
        })
    }else{
        try{
            var botStatus3 = await ctx.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member3 = await bot.telegram.getChatMember(channelId, ctx.from.id)
            console.log(member3);
            if (!member3 || member3.status == 'left'){
                var profile6 = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
                if (!profile6 || profile6.total_count == 0)
                return ctx.reply(`${first_name3} ${last_name3} \n\n${welcomejoin2}`,{
                    parse_mode:'HTML',
                    reply_markup:{
                        inline_keyboard:inKey2
                    }
                })
                ctx.replyWithPhoto(profile6.photos[0][0].file_id,{caption: `${first_name3} ${last_name3} \n\n${welcomejoin2}`,
                    parse_mode:'HTML',
                    reply_markup:{
                        inline_keyboard:inKey2
                    }
                })
            }else{
                await saver.checkBan(`${ctx.from.id}`).then((res) => {
                    console.log(res);
                    if (res == true) {
                        if(ctx.chat.type == 'private') {
                            ctx.reply(`${messagebanned2}`)
                        }
                    } else {
                        saver.saveFile(fileDetails)
                        if(ctx.chat.type == 'private') {
                            ctx.reply(`<b>Nama file:</b>${video.file_name}\n<b>Size:</b> ${video.file_size} KB\n<b>ID file:</b> ${video.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,{
                                parse_mode:'HTML'
                            })
                        }
                        if (!ctx.message.caption)
                        return ctx.replyWithVideo(video.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> ${first_name3} ${last_name3}\n\n<b>Nama file:</b> ${video.file_name}\n<b>Size:</b> ${video.file_size} KB\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                            parse_mode:'HTML'
                        })
                        ctx.replyWithVideo(video.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `${ctx.message.caption}\n\n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> ${first_name3} ${last_name3}\n\n<b>Nama file:</b> ${video.file_name}\n<b>Size:</b> ${video.file_size} KB\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                            parse_mode:'HTML'
                        })
                    }
                })
            }
        }
        catch(error){
            ctx.reply(`${messagebotnoaddgroup2}`)
        }
    }

})

//photo files
bot.on('photo', async(ctx) => {
    photo = ctx.message.photo
    console.log(ctx);
    fileDetails = {
        userId:ctx.from.id,
        file_id: photo[1].file_id,
        caption: ctx.message.caption,
        file_size: photo[1].file_size,
        uniqueId: photo[1].file_unique_id,
        type: 'photo'
    }

    console.log(fileDetails.caption);
    var first_name3 = first_name2(ctx);
    var last_name3 = last_name2(ctx);
    var welcomejoin2 = welcomejoin(ctx);
    var messagebanned2 = messagebanned(ctx);
    // var messagebotnoaddgroup2 = messagebotnoaddgroup(ctx);

    if(ctx.from.id ==process.env.ADMIN){
        saver.saveFile(fileDetails)
        if(ctx.chat.type == 'private') {
            ctx.reply(`<b>Size:</b> ${photo[1].file_size} KB\n<b>ID file:</b> ${photo[1].file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,{
                parse_mode:'HTML'
            })
        }
        if (!ctx.message.caption)
        return ctx.replyWithPhoto(photo[1].file_id, {
            chat_id: process.env.LOG_CHANNEL,
            caption: `<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> ${first_name3} ${last_name3}\n\n<b>Size:</b> ${photo[1].file_size} KB\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
            parse_mode:'HTML'
        })
        ctx.replyWithPhoto(photo[1].file_id, {
            chat_id: process.env.LOG_CHANNEL,
            caption: `${ctx.message.caption}\n\n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> ${first_name3} ${last_name3}\n\n<b>Size:</b> ${photo[1].file_size} KB\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
            parse_mode:'HTML'
        })
    }else{
        try{
            var botStatus4 = await ctx.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member4 = await bot.telegram.getChatMember(channelId, ctx.from.id)
            console.log(member4);
            if (!member4 || member4.status == 'left'){
                var profile7 = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
                if (!profile7 || profile7.total_count == 0)
                return ctx.reply(`${first_name3} ${last_name3} \n\n${welcomejoin2}`,{
                    parse_mode:'HTML',
                    reply_markup:{
                        inline_keyboard:inKey2
                    }
                })
                ctx.replyWithPhoto(profile7.photos[0][0].file_id,{caption: `${first_name3} ${last_name3} \n\n${welcomejoin2}`,
                    parse_mode:'HTML',
                    reply_markup:{
                        inline_keyboard:inKey2
                    }
                })
            }else{
                await saver.checkBan(`${ctx.from.id}`).then((res) => {
                    console.log(res);
                    if (res == true) {
                        if(ctx.chat.type == 'private') {
                            ctx.reply(`${messagebanned2}`)
                        }
                    } else {
                        saver.saveFile(fileDetails)
                        if(ctx.chat.type == 'private') {
                            ctx.reply(`<b>Size:</b> ${photo[1].file_size} KB\n<b>ID file:</b> ${photo[1].file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,{
                                parse_mode:'HTML'
                            })
                        }
                        if (!ctx.message.caption)
                        return ctx.replyWithPhoto(photo[1].file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> ${first_name3} ${last_name3}\n\n<b>Size:</b> ${photo[1].file_size} KB\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                            parse_mode:'HTML'
                        })
                        ctx.replyWithPhoto(photo[1].file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `${ctx.message.caption}\n\n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> ${first_name3} ${last_name3}\n\n<b>Size:</b> ${photo[1].file_size} KB\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                            parse_mode:'HTML'
                        })
                    }
                })
            }
        }
        catch(error){
            ctx.reply(`${messagebotnoaddgroup2}`)
        }
    }

})

//audio files
bot.on('audio', async(ctx) => {
    audio = ctx.message.audio
    console.log(ctx);
    fileDetails = {
        file_name: audio.file_name,
        userId:ctx.from.id,
        file_id: audio.file_id,
        caption: ctx.message.caption,
        file_size: audio.file_size,
        uniqueId: audio.file_unique_id,
        type: 'audio'
    }
    console.log(fileDetails.caption);
    var first_name3 = first_name2(ctx);
    var last_name3 = last_name2(ctx);
    var welcomejoin2 = welcomejoin(ctx);
    var messagebanned2 = messagebanned(ctx);
    // var messagebotnoaddgroup2 = messagebotnoaddgroup(ctx);

    if(ctx.from.id ==process.env.ADMIN){
        saver.saveFile(fileDetails)
        if(ctx.chat.type == 'private') {
            ctx.reply(`<b>Nama file:</b> ${audio.file_name}\n<b>Size:</b> ${audio.file_size} KB\n<b>ID file:</b> ${audio.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${audio.file_unique_id}`,{
                parse_mode:'HTML'
            })
        }
        if (!ctx.message.caption)
        return ctx.replyWithAudio(audio.file_id, {
            chat_id: process.env.LOG_CHANNEL,
            caption: `<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> ${first_name3} ${last_name3}\n\n<b>Nama file:</b> ${audio.file_name}\n<b>Size:</b> ${audio.file_size} KB\n<b>ID file:</b> ${audio.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${audio.file_unique_id}`,
            parse_mode:'HTML'
        })
        ctx.replyWithAudio(audio.file_id, {
            chat_id: process.env.LOG_CHANNEL,
            caption: `${ctx.message.caption}\n\n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> ${first_name3} ${last_name3}\n\n<b>Nama file:</b> ${audio.file_name}\n<b>Size:</b> ${audio.file_size} KB\n<b>ID file:</b> ${audio.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${audio.file_unique_id}`,
            parse_mode:'HTML'
        })
    }else{
        try{
            var botStatus5 = await ctx.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member5 = await bot.telegram.getChatMember(channelId, ctx.from.id)
            console.log(member5);
            if (!member5 || member5.status == 'left'){
                var profile8 = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
                if (!profile8 || profile8.total_count == 0)
                return ctx.reply(`${first_name3} ${last_name3} \n\n${welcomejoin2}`,{
                    parse_mode:'HTML',
                    reply_markup:{
                        inline_keyboard:inKey2
                    }
                })
                ctx.replyWithPhoto(profile8.photos[0][0].file_id,{caption: `${first_name3} ${last_name3} \n\n${welcomejoin2}`,
                    parse_mode:'HTML',
                    reply_markup:{
                        inline_keyboard:inKey2
                    }
                })
                }else{
                await saver.checkBan(`${ctx.from.id}`).then((res) => {
                    console.log(res);
                    if (res == true) {
                    if(ctx.chat.type == 'private') {
                            ctx.reply(`${messagebanned2}`)
                        }
                    } else {
                        saver.saveFile(fileDetails)
                        if(ctx.chat.type == 'private') {
                            ctx.reply(`<b>Nama file:</b> ${audio.file_name}\n<b>Size:</b> ${audio.file_size} KB\n<b>ID file:</b> ${audio.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${audio.file_unique_id}`,{
                                parse_mode:'HTML'
                            })
                        }
                        if (!ctx.message.caption)
                        return ctx.replyWithAudio(audio.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> ${first_name3} ${last_name3}\n\n<b>Nama file:</b> ${audio.file_name}\n<b>Size:</b> ${audio.file_size} KB\n<b>ID file:</b> ${audio.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${audio.file_unique_id}`,
                            parse_mode:'HTML'
                        })
                        ctx.replyWithAudio(audio.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `${ctx.message.caption}\n\n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> ${first_name3} ${last_name3}\n\n<b>Nama file:</b> ${audio.file_name}\n<b>Size:</b> ${audio.file_size} KB\n<b>ID file:</b> ${audio.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${audio.file_unique_id}`,
                            parse_mode:'HTML'
                        })
                    }
                })
            }
        }
        catch(error){
            ctx.reply(`${messagebotnoaddgroup2}`)
        }
    }

})

//checking bot status only for admins 
bot.command('stats',async(ctx)=>{
    stats = await saver.getUser().then((res)=>{
        if(ctx.from.id==process.env.ADMIN){
            ctx.reply(`📊 Total user: <b> ${res.length}</b>`,{parse_mode:'HTML'})
        }
        
    })
})

//getting files as inline result
bot.on('inline_query',async(ctx)=>{
    query = ctx.inlineQuery.query
    if(ctx.chat.type == 'private') {
        if(query.length>0){
            let searchResult = saver.getfileInline(query).then((res)=>{
                let result = res.map((item,index)=>{
                    return {
                        type:'document',
                        id:item._id,
                        title:item.file_name,
                        document_file_id:item.file_id,
                        caption:item.caption,
                        reply_markup:{
                            inline_keyboard:[
                                [{text:"🔎Pencarian",switch_inline_query:''}]
                            ]
                        }
                    }
                })
            
                ctx.answerInlineQuery(result)
            })
        }else{
            console.log('query not found');
        }
    }
    
})

//heroku config
domain = `${process.env.DOMAIN}.herokuapp.com`
bot.launch({
    webhook:{
       domain:domain,
        port:Number(process.env.PORT)

    }
})
