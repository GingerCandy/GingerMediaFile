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

    //welcoming message on /start and if there is a query available we can send files

    if(length == 1){
        ctx.reply(`Saya akan menyimpan file untuk Anda dan memberikan tautan yang dapat dibagikan, saya juga dapat membuat file tersedia untuk semua pengguna. Mendukung <b><a href='https://t.me/mdtohtmlbot'></b>.`,{
            parse_mode:'HTML'
            reply_markup:{
                inline_keyboard:[
                    [{text:'Pencarian',switch_inline_query:''},{text:'Tautan',callback_data:'POP'}],
                    [{text:'Owner 1', url: 'https://t.me/SoraHearts'},{text:'Owner 2', url: 'https://t.me/Gingercandy02'}],
                    [{text:'Channel', url: 'https://t.me/gingercandyfiles'}]
                ]
            }
        })
    }else{
        file = await saver.getFile(query).then((res)=>{
            console.log(res);
            if(res.type=='video'){
                ctx.replyWithVideo(res.file_id,{caption:`<b>${res.caption}</b>`,
            parse_mode:'HTML'})
            }else{
                ctx.replyWithDocument(res.file_id,{caption:`<b>${res.caption}</b>`,
            parse_mode:'HTML'})
            }
            
        })
    }
    //saving user details to the database

    saver.saveUser(user)   
    
})

//DEFINING POP CALLBACK
bot.action('POP',(ctx)=>{
    ctx.deleteMessage()
    ctx.reply('Kirim bot file')
})


//help

//bot.command('/help',(ctx)=>{
//    ctx.reply(`Halo <b>${ctx.from.first_name}</b> \n\nAnda dapat mengirimi saya file dan saya akan menyimpan dan membagikan tautan untuk file itu untuk digunakan di dalam telegram\nAnda juga dapat menggunakan saya untuk mencari file yang disumbangkan oleh berbagai pengguna.`,{
//        parse_mode:'HTML',\n
//        reply_markup:{
//            inline_keyboard:[
//                [{text:'🎲Clone',url:'t.me/filesaverhelp'}]
//            ]
//        }    
//    })
//    if(ctx.from.id==process.env.ADMIN){
//        ctx.reply('https://telegra.ph/Filesaver-Admin-commands-06-05')
//    }
//})

//remove files with file_id

bot.command('rem', (ctx) => {
    msg = ctx.message.text
    let msgArray = msg.split(' ')
    msgArray.shift()
    let text = msgArray.join(' ')
    console.log(text);
    if(ctx.from.id ==process.env.ADMIN){
        saver.removeFile(text)
        ctx.reply('✅Dihapus')
    }
})

//remove whole collection(remove all files)

bot.command('clear',(ctx)=>{
    if(ctx.from.id ==process.env.ADMIN){
        saver.deleteCollection()
        ctx.reply('✅Dihapus')
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
        ctx.reply('✅Dihapus')
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
            ctx.reply(`<b>✅Jumlah pengguna aktif:</b>${userId.length - totalFail.length}\n❌<b>Total siaran yang gagal:</b>${totalFail.length}`,{
                parse_mode:'HTML'
            })

        }
        if (ctx.from.id == process.env.ADMIN) {
            broadcast(text)
            ctx.reply('Penyiaran dimulai -(Pesan disiarkan dari terakhir bergabung hingga pertama)')

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
            ctx.reply('✅Selesai')
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
        uniqueId: document.file_unique_id
    }
    await saver.checkBan(`${ctx.from.id}`).then((res) => {
        console.log(res);
        if (res == true) {
            ctx.reply('⚠ANDA DILARANG KARENA MENYALAHGUNAKAN BOT, HUBUNGI ADMIN UNTUK BANDING')
        } else {
            saver.saveFile(fileDetails)
            ctx.reply(`https://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`)
            ctx.replyWithDocument(document.file_id, {
                chat_id: process.env.LOG_CHANNEL,
                caption: `${ctx.message.caption}\n\n\nDari:${ctx.from.id}\nNama depan:${ctx.from.first_name}\nID file:${document.file_id}`

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
            ctx.reply('⚠ANDA DILARANG KARENA MENYALAHGUNAKAN BOT, HUBUNGI ADMIN UNTUK BANDING')
        } else {
            saver.saveFile(fileDetails)
            ctx.reply(`https://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`)
            ctx.replyWithVideo(video.file_id, {
                chat_id: process.env.LOG_CHANNEL,
                caption: `${ctx.message.caption}\n\n\nDari:${ctx.from.id}\nNama depan:${ctx.from.first_name}\nID file:${document.file_id}`
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
            ctx.reply('⚠ANDA DILARANG KARENA MENYALAHGUNAKAN BOT, HUBUNGI ADMIN UNTUK BANDING')
        } else {
            saver.saveFile(fileDetails)
            ctx.reply(`https://t.me/${process.env.BOTUSERNAME}?start=${audio.file_unique_id}`)
            ctx.replyWithDocument(audio.file_id, {
                chat_id: process.env.LOG_CHANNEL,
                caption: `${ctx.message.caption}\n\n\nDari:${ctx.from.id}\nNama depan:${ctx.from.first_name}\nID file:${document.file_id}`
            })
        }
    })

})

//checking bot status only for admins 

bot.command('stats',async(ctx)=>{
    stats = await saver.getUser().then((res)=>{
        if(ctx.from.id==process.env.ADMIN){
            ctx.reply(`📊Total user: <b> ${res.length}</b>`,{parse_mode:'HTML'})
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
                            [{text:"🔎Mencari lagi",switch_inline_query:''}]
                        ]
                    }
                }
            })
           
            ctx.answerInlineQuery(result)
        })
    }else{
        console.log('Kueri tidak ditemukan');
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



