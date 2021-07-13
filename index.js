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


//BOT

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

    if(ctx.from.id ==process.env.ADMIN){
            //welcoming message on /start and if there is a query available we can send files
            if(length == 1){
                var profile = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
                if (!profile || profile.total_count == 0)
                    return ctx.reply(`${ctx.from.first_name} \n\nSaya akan menyimpan file untuk Anda dan memberikan tautan yang dapat dibagikan, saya juga dapat membuat file tersedia untuk semua pengguna. Bot mendukung pencarian dan <a href="t.me/mdtohtmlbot">HTML</a>.`,{
                    parse_mode:'HTML',
                    reply_markup:{
                        inline_keyboard:[
                            [{text:'Pencarian',switch_inline_query:''},{text:'Tautan',callback_data:'POP'}],
                            [{text:'Owner Bot', url: 'https://t.me/SoraHearts'},{text:'Owner Channel', url: 'https://t.me/Gingercandy02'}],
                            [{text:'Gabung Channel', url: 'https://t.me/gingercandyfiles'}]
                        ]
                    }
                })
                    ctx.replyWithPhoto(profile.photos[0][0].file_id,{caption: `${ctx.from.first_name} \n\nSaya akan menyimpan file untuk Anda dan memberikan tautan yang dapat dibagikan, saya juga dapat membuat file tersedia untuk semua pengguna. Bot mendukung pencarian dan <a href="t.me/mdtohtmlbot">HTML</a>.`,
                    parse_mode:'HTML',
                    reply_markup:{
                        inline_keyboard:[
                            [{text:'Pencarian',switch_inline_query:''},{text:'Tautan',callback_data:'POP'}],
                            [{text:'Owner 1', url: 'https://t.me/SoraHearts'},{text:'Owner 2', url: 'https://t.me/Gingercandy02'}],
                            [{text:'Gabung Channel', url: 'https://t.me/gingercandyfiles'}]
                        ]
                    }
                })
            }else{
                file = await saver.getFile(query).then((res)=>{
                    console.log(res);
                    if(res.type=='video'){
                        if (!res.caption)
                            return ctx.replyWithVideo(res.file_id,{caption: `\n\n<b>Selamat menikmati.</b>`,
                            parse_mode:'HTML'
                        })
                            ctx.replyWithVideo(res.file_id,{caption: `${res.caption} \n\n<b>Selamat menikmati.</b>`,
                            parse_mode:'HTML'
                        })
                    }else if(res.type=='photo'){
                        if (!res.caption)
                            return ctx.replyWithPhoto(res.file_id,{caption: `\n\n<b>Selamat menikmati.</b>`,
                            parse_mode:'HTML'
                        })
                            ctx.replyWithPhoto(res.file_id,{caption: `${res.caption} \n\n<b>Selamat menikmati.</b>`,
                            parse_mode:'HTML'
                        })
                    }else if(res.type=='document'){
                        if (!res.caption)
                            return ctx.replyWithDocument(res.file_id,{caption: `\n\n<b>Selamat menikmati.</b>`,
                            parse_mode:'HTML'
                        })
                            ctx.replyWithDocument(res.file_id,{caption: `${res.caption} \n\n<b>Selamat menikmati.</b>`,
                            parse_mode:'HTML'
                        })
                    }            
                })
            }

            //saving user details to the database
            saver.saveUser(user)

    }else(ctx.from.id ==process.env.MEMBER){
    
    try {
        var member = await bot.telegram.getChatMember(-1001590114101, ctx.from.id)
        console.log(member);
        if (!member || member.status == 'left'){
            ctx.reply(`${ctx.from.first_name} \n\n Anda belum masuk join, silakan join dulu!`,{
                parse_mode:'HTML',
                reply_markup:{
                    inline_keyboard:[
                        [{text:'Gabung Channel', url: 'https://t.me/joinchat/sJHfeRe7SQU3YjNh'}]
                    ]
                }
            })
        }else{
            //welcoming message on /start and if there is a query available we can send files
            if(length == 1){
                var profile = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
                if (!profile || profile.total_count == 0)
                    return ctx.reply(`${ctx.from.first_name} \n\nSaya akan menyimpan file untuk Anda dan memberikan tautan yang dapat dibagikan, saya juga dapat membuat file tersedia untuk semua pengguna. Bot mendukung pencarian dan <a href="t.me/mdtohtmlbot">HTML</a>.`,{
                    parse_mode:'HTML',
                    reply_markup:{
                        inline_keyboard:[
                            [{text:'Pencarian',switch_inline_query:''},{text:'Tautan',callback_data:'POP'}],
                            [{text:'Owner Bot', url: 'https://t.me/SoraHearts'},{text:'Owner Channel', url: 'https://t.me/Gingercandy02'}],
                            [{text:'Gabung Channel', url: 'https://t.me/gingercandyfiles'}]
                        ]
                    }
                })
                    ctx.replyWithPhoto(profile.photos[0][0].file_id,{caption: `${ctx.from.first_name} \n\nSaya akan menyimpan file untuk Anda dan memberikan tautan yang dapat dibagikan, saya juga dapat membuat file tersedia untuk semua pengguna. Bot mendukung pencarian dan <a href="t.me/mdtohtmlbot">HTML</a>.`,
                    parse_mode:'HTML',
                    reply_markup:{
                        inline_keyboard:[
                            [{text:'Pencarian',switch_inline_query:''},{text:'Tautan',callback_data:'POP'}],
                            [{text:'Owner 1', url: 'https://t.me/SoraHearts'},{text:'Owner 2', url: 'https://t.me/Gingercandy02'}],
                            [{text:'Gabung Channel', url: 'https://t.me/gingercandyfiles'}]
                        ]
                    }
                })
            }else{
                file = await saver.getFile(query).then((res)=>{
                    console.log(res);
                    if(res.type=='video'){
                        if (!res.caption)
                            return ctx.replyWithVideo(res.file_id,{caption: `\n\n<b>Selamat menikmati.</b>`,
                            parse_mode:'HTML'
                        })
                            ctx.replyWithVideo(res.file_id,{caption: `${res.caption} \n\n<b>Selamat menikmati.</b>`,
                            parse_mode:'HTML'
                        })
                    }else if(res.type=='photo'){
                        if (!res.caption)
                            return ctx.replyWithPhoto(res.file_id,{caption: `\n\n<b>Selamat menikmati.</b>`,
                            parse_mode:'HTML'
                        })
                            ctx.replyWithPhoto(res.file_id,{caption: `${res.caption} \n\n<b>Selamat menikmati.</b>`,
                            parse_mode:'HTML'
                        })
                    }else if(res.type=='document'){
                        if (!res.caption)
                            return ctx.replyWithDocument(res.file_id,{caption: `\n\n<b>Selamat menikmati.</b>`,
                            parse_mode:'HTML'
                        })
                            ctx.replyWithDocument(res.file_id,{caption: `${res.caption} \n\n<b>Selamat menikmati.</b>`,
                            parse_mode:'HTML'
                        })
                    }            
                })
            }

            //saving user details to the database
            saver.saveUser(user)
        }
    }catch(error){
        ctx.reply(`Bot belum masuk channel/grup pemiliknya`)
    }
    }
})

//DEFINING POP CALLBACK
bot.action('POP',(ctx)=>{
    ctx.deleteMessage()
    ctx.reply('Kirim bot video, photo, dokumen dan suara.')
})

//check account

bot.command('/getid',(ctx)=>{
    ctx.reply(`<b>Name:</b> ${ctx.from.first_name}\n<b>Username:</b> @${ctx.from.username}\n<b>ID:</b> ${ctx.from.id}`,{
        parse_mode:'HTML'  
    })
})


//remove files with file_id

bot.command('rem', (ctx) => {
    msg = ctx.message.text
    let msgArray = msg.split(' ')
    msgArray.shift()
    let text = msgArray.join(' ')
    console.log(text);
    if(ctx.from.id ==process.env.ADMIN){
        saver.removeFile(text)
        ctx.reply('✅ Dihapus')
    }
})

//remove whole collection(remove all files)

bot.command('clear',(ctx)=>{
    if(ctx.from.id ==process.env.ADMIN){
        saver.deleteCollection()
        ctx.reply('✅ Dihapus')
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
    if(ctx.from.id ==process.env.ADMIN|| ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
        saver.removeUserFile(id)
        ctx.reply('✅ Dihapus')
    }
})

//broadcasting message to bot users(from last joined to first)

bot.command('send',async(ctx)=>{
    msg = ctx.message.text
    let msgArray = msg.split(' ')
    msgArray.shift()
    let text = msgArray.join(' ')

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
                    await bot.telegram.sendMessage(users, String(text))
                } catch (err) {
                    saver.updateUser(users)
                    totalFail.push(users)

                }
            }
            ctx.reply(`✅ <b>Jumlah pengguna aktif:</b> ${userId.length - totalFail.length}\n❌ <b>Total siaran yang gagal:</b> ${totalFail.length}`,{
                parse_mode:'HTML'
            })

        }
        if (ctx.from.id == process.env.ADMIN) {
            broadcast(text)
            ctx.reply('Penyiaran dimulai (Pesan disiarkan dari terakhir bergabung hingga pertama).')

        }else{
            ctx.replyWithAnimation('https://media.giphy.com/media/fnuSiwXMTV3zmYDf6k/giphy.gif')
        }

    })
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
    if(ctx.from.id ==process.env.ADMIN){
        saver.banUser(userId).then((res) => {
            ctx.reply('Dilarang')
        })
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
    

    if(ctx.from.id ==process.env.ADMIN){
        saver.unBan(userId).then((res) => {
            ctx.reply('✅ Selesai')
        })
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
    await saver.checkBan(`${ctx.from.id}`).then((res) => {
        console.log(res);
        if (res == true) {
            ctx.reply('⚠YOU ARE BANNED FOR MISUSING BOT, CONTACT ADMIN TO APPEAL')
        } else {
            saver.saveFile(fileDetails)
            ctx.reply(`https://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`)
            ctx.replyWithDocument(document.file_id, {
                chat_id: process.env.LOG_CHANNEL,
                caption: `${ctx.message.caption}\n\nDari: ${ctx.from.id}\nNama depan: ${ctx.from.first_name}\nID file: ${document.file_id}`

            })
        }
    })

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
    await saver.checkBan(`${ctx.from.id}`).then((res) => {
        console.log(res);
        if (res == true) {
            ctx.reply('⚠YOU ARE BANNED FOR MISUSING BOT, CONTACT ADMIN TO APPEAL')
        } else {
            saver.saveFile(fileDetails)
            ctx.reply(`https://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`)
            ctx.replyWithVideo(video.file_id, {
                chat_id: process.env.LOG_CHANNEL,
                caption: `${ctx.message.caption}\n\nDari: ${ctx.from.id}\nNama depan: ${ctx.from.first_name}\nID file: ${video.file_id}`

            })
        }
    })

})

//photo files

bot.on('photo', async(ctx) => {
    photo = ctx.message.photo
    console.log(ctx);
    fileDetails = {
        userId:ctx.from.id,
        file_id: photo[1].file_id,
        caption: ctx.message.caption,
        uniqueId: photo[1].file_unique_id,
        type: 'photo'
    }
    console.log(fileDetails.caption);
    await saver.checkBan(`${ctx.from.id}`).then((res) => {
        console.log(res);
        if (res == true) {
            ctx.reply('⚠YOU ARE BANNED FOR MISUSING BOT, CONTACT ADMIN TO APPEAL')
        } else {
            saver.saveFile(fileDetails)
            ctx.reply(`https://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`)
            ctx.replyWithPhotoPhoto(photo[1].file_id, {
                chat_id: process.env.LOG_CHANNEL,
                caption: `${ctx.message.caption}\n\nDari: ${ctx.from.id}\nNama depan: ${ctx.from.first_name}\nID file: ${document.file_id}`

            })
        }
    })

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
    await saver.checkBan(`${ctx.from.id}`).then((res) => {
        console.log(res);
        if (res == true) {
            ctx.reply('⚠YOU ARE BANNED FOR MISUSING BOT, CONTACT ADMIN TO APPEAL')
        } else {
            saver.saveFile(fileDetails)
            ctx.reply(`https://t.me/${process.env.BOTUSERNAME}?start=${audio.file_unique_id}`)
            ctx.replyWithAudio(audio.file_id, {
                chat_id: process.env.LOG_CHANNEL,
                caption: `${ctx.message.caption}\n\nDari: ${ctx.from.id}\nNama depan: ${ctx.from.first_name}\nID file: ${document.file_id}`

            })
        }
    })

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
                            [{text:"🔎 Mencari",switch_inline_query:''}]
                        ]
                    }
                }
            })
           
            ctx.answerInlineQuery(result)
        })
    }else{
        console.log('query not found');
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
