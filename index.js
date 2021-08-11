require('dotenv').config()
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.TOKEN)

process.env.TZ = "Asia/Jakarta";

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
const channelId = `${process.env.CHANNELJOIN}`;

function today(ctx){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    return today = mm + '/' + dd + '/' + yyyy + ' ' + hours + ':' + minutes + ':' + seconds;
}

function today2(ctx){
    var today2 = new Date();
    var dd2 = String(today2.getDate()).padStart(2, '0');
    var mm2 = String(today2.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy2 = today2.getFullYear();
    var hours2 = today2.getHours();
    var minutes2 = today2.getMinutes();
    var seconds2 = today2.getSeconds();
    return today2 = mm2 + '/' + dd2 + '/' + yyyy2 + '-' + hours2 + ':' + minutes2 + ':' + seconds2;
}

//Function
function first_name(ctx){
    return `${ctx.from.first_name ? ctx.from.first_name : ""}`;
}
function last_name(ctx){
    return `${ctx.from.last_name ? ctx.from.last_name : ""}`;
}
function username(ctx){
    return ctx.from.username ? `@${ctx.from.username}` : "";
}
function fromid(ctx){
    return ctx.from.id ? `[${ctx.from.id}]` : "";
}
function captionbuild(ctx){
    return `${process.env.CAPTIONLINK}`;
}
function welcomejoin(ctx){
    return `${process.env.WELCOMEJOINBOT}\n\n${today(ctx)}`;
}
function messagewelcome(ctx){
    return `${process.env.MESSAGEWELCOMEBOT}\n\n${today(ctx)}`;
}
function messagebanned(ctx){
    return `⚠ ANDA DIBANNED KARENA MENYALAHGUNAKAN BOT, HUBUNGI ADMIN UNTUK BANDING.`;
}
function messagebotnoaddgroup(ctx){
    return `BOT belum masuk channel/grup pemiliknya.`;
}
function messagelink(ctx){
    return `Kirim BOT video, photo dan dokumen.`;
}

// inline keyboard
const inKey = [
  [{text:'🔎 Pencarian',switch_inline_query:''},{text:'📎 Tautan',callback_data:'POP'}],
  [{text:'📎 Join', url: `${process.env.LINKCHANNEL}`}]
];

const inKey2 = [
  [{text:'📎 Join', url: `${process.env.LINKCHANNEL}`}]
];

//BOT START
bot.start(async(ctx)=>{

    msg = ctx.message.text
    let msgArray = msg.split(' ')
    //console.log(msgArray.length);
    let length = msgArray.length
    msgArray.shift()
    let query = msgArray.join(' ')

     user ={
        first_name:ctx.from.first_name,
        userId:ctx.from.id
    }

    if(ctx.chat.type == 'private') {
        if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
            //welcoming message on /start and ifthere is a query available we can send files
            if(length == 1){
                var profile = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
                if(!profile || profile.total_count == 0)
                    return ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
                        parse_mode:'HTML',
                        disable_web_page_preview: true,
                        reply_markup:{
                            inline_keyboard:inKey
                        }
                    })
                    ctx.replyWithPhoto(profile.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
                        parse_mode:'HTML',
                        disable_web_page_preview: true,
                        reply_markup:{
                            inline_keyboard:inKey
                        }
                    })
            }else{
                if (query.indexOf('grp_') > -1){
                    var query1 = query.replace('grp_','');
                    file = await saver.getFile1(query1).then((res1)=>{
                        //console.log(res1);
                        let mediagroup = [];
                        for (let index = 0; index < res1.length; index++) {
                            const data = res1[index];
                            mediagroup.push({type: data.type, media: data.file_id, caption: data.caption, parse_mode:'HTML'});
                        }
                        //console.log(mediagroup);
                        return ctx.telegram.sendMediaGroup(ctx.chat.id, mediagroup);
                    })
                }else{
                    let query2 = query;
                    file2 = await saver.getFile2(query2).then((res2)=>{
                        //console.log(res2);
                        if(res2.type=='video'){
                            if(!res2.caption)
                            return ctx.replyWithVideo(res2.file_id,{caption: `\n\n${captionbuild(ctx)}`,
                                parse_mode:'HTML'
                            })
                            ctx.replyWithVideo(res2.file_id,{caption: `${res2.caption} \n\n${captionbuild(ctx)}`,
                                parse_mode:'HTML'
                            })
                        }else if(res2.type=='photo'){
                            if(!res2.caption)
                                return ctx.replyWithPhoto(res2.file_id,{caption: `\n\n${captionbuild(ctx)}`,
                                    parse_mode:'HTML'
                                })
                                ctx.replyWithPhoto(res2.file_id,{caption: `${res2.caption} \n\n${captionbuild(ctx)}`,
                                    parse_mode:'HTML'
                                })
                        }else if(res2.type=='document'){
                            if(!res2.caption)
                                return ctx.replyWithDocument(res2.file_id,{caption: `\n\n${captionbuild(ctx)}`,
                                    parse_mode:'HTML'
                                })
                                ctx.replyWithDocument(res2.file_id,{caption: `${res2.caption} \n\n${captionbuild(ctx)}`,
                                    parse_mode:'HTML'
                                })
                        }
                    })
                }
            }
        }else{
            try {
                var botStatus = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
                var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
                //console.log(member);
                if(!member || member.status == 'left' || member.status == 'kicked'){
                    var profile2 = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
                    if(!profile2 || profile2.total_count == 0)
                        return ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_markup:{
                                inline_keyboard:inKey2
                            }
                        })
                        ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_markup:{
                                inline_keyboard:inKey2
                            }
                        })
                }else{
                    //welcoming message on /start and ifthere is a query available we can send files
                    if(length == 1){
                        var profile3 = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
                        if(!profile3 || profile3.total_count == 0)
                            return ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                reply_markup:{
                                    inline_keyboard:inKey
                                }
                            })
                            ctx.replyWithPhoto(profile3.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                reply_markup:{
                                    inline_keyboard:inKey
                                }
                            })
                        }else{
                            if (query.indexOf('grp_') > -1){
                                var query1 = query.replace('grp_','');
                                file = await saver.getFile1(query1).then((res1)=>{
                                //console.log(res1);
                                    let mediagroup = [];
                                    for (let index = 0; index < res1.length; index++) {
                                        const data = res1[index];
                                        mediagroup.push({type: data.type, media: data.file_id, caption: data.caption, parse_mode:'HTML'});
                                    }
                                    //console.log(mediagroup);
                                    return ctx.telegram.sendMediaGroup(ctx.chat.id, mediagroup);
                                })
                            }else{
                                let query2 = query;
                                file2 = await saver.getFile2(query2).then((res2)=>{
                                    //console.log(res2);
                                    if(res2.type=='video'){
                                        if(!res2.caption)
                                            return ctx.replyWithVideo(res2.file_id,{caption: `\n\n${captionbuild(ctx)}`,
                                                parse_mode:'HTML'
                                            })
                                            ctx.replyWithVideo(res2.file_id,{caption: `${res2.caption} \n\n${captionbuild(ctx)}`,
                                                parse_mode:'HTML'
                                            })
                                    }else if(res2.type=='photo'){
                                        if(!res2.caption)
                                            return ctx.replyWithPhoto(res2.file_id,{caption: `\n\n${captionbuild(ctx)}`,
                                                parse_mode:'HTML'
                                            })
                                            ctx.replyWithPhoto(res2.file_id,{caption: `${res2.caption} \n\n${captionbuild(ctx)}`,
                                                parse_mode:'HTML'
                                            })
                                    }else if(res2.type=='document'){
                                        if(!res2.caption)
                                            return ctx.replyWithDocument(res2.file_id,{caption: `\n\n${captionbuild(ctx)}`,
                                                parse_mode:'HTML'
                                            })
                                            ctx.replyWithDocument(res2.file_id,{caption: `${res2.caption} \n\n${captionbuild(ctx)}`,
                                                parse_mode:'HTML'
                                            })
                                    }
                                })
                            }
                        }
                    }
                }
            catch(error){
                ctx.reply(`${messagebotnoaddgroup(ctx)}`)
            }
        }
        //saving user details to the database
        saver.saveUser(user)
    }
})

//DEFINING POP CALLBACK
bot.action('POP',(ctx)=>{
    ctx.deleteMessage()
    ctx.reply(`${messagelink(ctx)}`,{
        parse_mode: 'HTML',
        reply_markup:{
            inline_keyboard: [
                [{text:'Batal',callback_data:'STARTUP'}]
            ]
        }
    })
})

bot.action('STARTUP',async(ctx)=>{
    ctx.deleteMessage()
    var profile = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
    if(!profile || profile.total_count == 0)
        return ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
            parse_mode:'HTML',
            disable_web_page_preview: true,
            reply_markup:{
                inline_keyboard:inKey
            }
        })
        ctx.replyWithPhoto(profile.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
            parse_mode:'HTML',
            disable_web_page_preview: true,
            reply_markup:{
                inline_keyboard:inKey
            }
        })
})

//TEST BOT
bot.hears('ping',(ctx)=>{
    let chatId = ctx.message.from.id;
    let opts = {
        reply_to_message_id: ctx.message.message_id,
        reply_markup:{
            inline_keyboard: [[{text:'OK',callback_data:'PONG'}]]
        }
    }
    return bot.telegram.sendMessage(chatId, 'pong', opts);
})

bot.action('PONG',(ctx)=>{
    ctx.deleteMessage()
})

//GROUP COMMAND
bot.command('reload',async(ctx)=>{
    group ={
        groupId:ctx.chat.id
    }

    var botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)
    var memberstatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.from.id)
    //console.log(memberstatus);
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        if(!memberstatus || memberstatus.status == 'creator' || memberstatus.status == 'administrator'){
            ctx.reply('BOT dimulai ulang')
            saver.saveGroup(group)
        }
        if(ctx.from.username == 'GroupAnonymousBot'){
            ctx.reply('BOT dimulai ulang')
            saver.saveGroup(group)
        }
    }
})

bot.command('kick',async(ctx)=>{
    groupDetails = await saver.getGroup().then((res)=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function kick() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){    
                        if(!memberstatus || memberstatus.can_restrict_members == true){                
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.kickChatMember(ctx.chat.id, args[0]).then(result=>{
                                    //console.log(result)
                                })
                            }
                            await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(result=>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        if(ctx.message.reply_to_message == undefined){
                            let args = ctx.message.text.split(" ").slice(1)
                            await bot.telegram.kickChatMember(ctx.chat.id, args[0]).then(result=>{
                                //console.log(result)
                            })
                        }
                        await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(result=>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.kickChatMember(ctx.chat.id, args[0]).then(result=>{
                                    //console.log(result)
                                })
                            }
                            await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(result=>{
                                //console.log(result)
                            })
                        }
                    }
                }
            }
        }
        kick()
    })
})

bot.command('ban',async(ctx)=>{
    groupDetails = await saver.getGroup().then((res)=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function ban() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        if(!memberstatus || memberstatus.can_restrict_members == true){
                            if(ctx.message.reply_to_message == undefined){

                                const str = ctx.message.text;
                                const words = str.split(/ +/g);
                                const command = words.shift().slice(1);
                                const userId = words.shift();
                                const caption = words.join(" ");
                                const caption2 = caption ? `\n<b>Karena:</b> ${caption}` : "";

                                await bot.telegram.callApi('banChatMember', {
                                chat_id: ctx.message.chat.id,
                                user_id: userId
                                }).then(result=>{
                                    //console.log(result)
                                    ctx.reply(`[${userId}] dibanned ${caption2}`,{
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                    return bot.telegram.sendMessage(userId, `${caption} Anda telah dibanned di ${ctx.message.chat.title}`)
                                })
                            }

                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Karena:</b> ${caption}` : "";

                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: ctx.message.reply_to_message.from.id
                            }).then(result=>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                ctx.reply(`${replyUsername} ${replyFromid} dibanned ${caption2}`,{
                                    reply_to_message_id: ctx.message.message_id
                                })
                                return bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `${caption} Anda telah dibanned di ${ctx.message.chat.title}`)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        if(ctx.message.reply_to_message == undefined){

                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const userId = words.shift();
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Karena:</b> ${caption}` : "";

                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: userId
                            }).then(result=>{
                                //console.log(result)
                                ctx.reply(`[${userId}] dibanned ${caption2}`,{
                                    reply_to_message_id: ctx.message.message_id
                                })
                                return bot.telegram.sendMessage(userId, `${caption} Anda telah dibanned di ${ctx.message.chat.title}`)
                            })
                        }

                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const caption = words.join(" ");
                        const caption2 = caption ? `\n<b>Karena:</b> ${caption}` : "";

                        await bot.telegram.callApi('banChatMember', {
                        chat_id: ctx.message.chat.id,
                        user_id: ctx.message.reply_to_message.from.id
                        }).then(result=>{
                            //console.log(result)
                            let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                            let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                            ctx.reply(`${replyUsername} ${replyFromid} dibanned ${caption2}`,{
                                reply_to_message_id: ctx.message.message_id
                            })
                            return bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `${caption} Anda telah dibanned di ${ctx.message.chat.title}`)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            if(ctx.message.reply_to_message == undefined){

                                const str = ctx.message.text;
                                const words = str.split(/ +/g);
                                const command = words.shift().slice(1);
                                const userId = words.shift();
                                const caption = words.join(" ");
                                const caption2 = caption ? `\n<b>Karena:</b> ${caption}` : "";
    
                                await bot.telegram.callApi('banChatMember', {
                                chat_id: ctx.message.chat.id,
                                user_id: userId
                                }).then(result=>{
                                    //console.log(result)
                                    ctx.reply(`[${userId}] dibanned ${caption2}`,{
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                    return bot.telegram.sendMessage(userId, `${caption} Anda telah dibanned di ${ctx.message.chat.title}`)
                                })
                            }
    
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Karena:</b> ${caption}` : "";
    
                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: ctx.message.reply_to_message.from.id
                            }).then(result=>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                ctx.reply(`${replyUsername} ${replyFromid} dibanned ${caption2}`,{
                                    reply_to_message_id: ctx.message.message_id
                                })
                                return bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `${caption} Anda telah dibanned di ${ctx.message.chat.title}`)
                            })
                        }
                    }
                }
            }
        }
        ban()
    })
})

bot.command('unban',async(ctx)=>{
    groupDetails = await saver.getGroup().then((res)=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function unban() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        if(!memberstatus || memberstatus.can_restrict_members == true){
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.unbanChatMember(ctx.chat.id, args[0]).then(result=>{
                                    //console.log(result)
                                    ctx.reply(`[${args[0]}] tidak diblokir, boleh masuk kembali!`,{
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                    return bot.telegram.sendMessage(args[0], `Anda tidak diblokir, boleh masuk kembali di ${ctx.message.chat.title}`)
                                })
                            }
                            await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(result=>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                ctx.reply(`${replyUsername} ${replyFromid} tidak diblokir, boleh masuk kembali!`,{
                                    reply_to_message_id: ctx.message.message_id
                                })
                                return bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `Anda tidak diblokir, boleh masuk kembali di ${ctx.message.chat.title}`)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        if(ctx.message.reply_to_message == undefined){
                            let args = ctx.message.text.split(" ").slice(1)
                            await bot.telegram.unbanChatMember(ctx.chat.id, args[0]).then(result=>{
                                //console.log(result)
                                ctx.reply(`[${args[0]}] tidak diblokir, boleh masuk kembali!`,{
                                    reply_to_message_id: ctx.message.message_id
                                })
                                return bot.telegram.sendMessage(args[0], `Anda tidak diblokir, boleh masuk kembali di ${ctx.message.chat.title}`)
                            })
                        }
                        await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(result=>{
                            //console.log(result)
                            let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                            let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                            ctx.reply(`${replyUsername} ${replyFromid} tidak diblokir, boleh masuk kembali!`,{
                                reply_to_message_id: ctx.message.message_id
                            })
                            return bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `Anda tidak diblokir, boleh masuk kembali di ${ctx.message.chat.title}`)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.unbanChatMember(ctx.chat.id, args[0]).then(result=>{
                                    //console.log(result)
                                    ctx.reply(`[${args[0]}] tidak diblokir, boleh masuk kembali!`,{
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                    return bot.telegram.sendMessage(args[0], `Anda tidak diblokir, boleh masuk kembali di ${ctx.message.chat.title}`)
                                })
                            }
                            await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(result=>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                ctx.reply(`${replyUsername} ${replyFromid} tidak diblokir, boleh masuk kembali!`,{
                                    reply_to_message_id: ctx.message.message_id
                                })
                                return bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `Anda tidak diblokir, boleh masuk kembali di ${ctx.message.chat.title}`)
                            })
                        }
                    }
                }
            }
        }
        unban()
    })
})

bot.command('pin',async(ctx)=>{
    groupDetails = await saver.getGroup().then((res)=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function pin() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        if(!memberstatus || memberstatus.can_pin_messages == true){
                            await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                                disable_notification: false,
                            }).then(result=>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                            disable_notification: false,
                        }).then(result=>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                                disable_notification: false,
                            }).then(result=>{
                                //console.log(result)
                            })
                        }
                    }
                }
            }
        }
        pin()
    })
})

bot.command('unpin',async(ctx)=>{
    groupDetails = await saver.getGroup().then((res)=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function unpin() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        if(!memberstatus || memberstatus.can_pin_messages == true){
                            await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(result=>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(result=>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(result=>{
                                //console.log(result)
                            })
                        }
                    }
                }
            }
        }
        unpin()
    })
})

bot.command('send',async(ctx)=>{
    groupDetails = await saver.getGroup().then((res)=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function send() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(!memberstatus || memberstatus.status == 'creator' || memberstatus.status == 'administrator'){
                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const caption = words.join(" ");

                        return bot.telegram.sendMessage(group, `${caption}`)
                    }
                    if(ctx.from.username == 'GroupAnonymousBot'){
                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const caption = words.join(" ");

                        return bot.telegram.sendMessage(group, `${caption}`)
                    }
                }
            }
        }
        send()
    })
})
//END

//check account
bot.command('getid',async(ctx)=>{

    var profile4 = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
    
    if(ctx.chat.type == 'private') {
        if(!profile4 || profile4.total_count == 0){
            ctx.reply(`<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n<b>Username:</b> ${username(ctx)}\n<b>ID:</b> ${ctx.from.id}`,{
                parse_mode:'HTML'  
            })
        }else{
            ctx.replyWithPhoto(profile4.photos[0][0].file_id,{caption: `<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n<b>Username:</b> ${username(ctx)}\n<b>ID:</b> ${ctx.from.id}`,
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
    //console.log(text);

    if(ctx.chat.type == 'private') {
        if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
            saver.removeFile(text)
            ctx.reply('✅ Dihapus')
        }
    }
})

//remove files with mediaId
bot.command('remgrp', (ctx) => {
    msg = ctx.message.text
    let msgArray = msg.split(' ')
    msgArray.shift()
    let text = msgArray.join(' ')
    //console.log(text);

    if(ctx.chat.type == 'private') {
        if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
            saver.removeFileMedia(text)
            ctx.reply('✅ Group Dihapus')
        }
    }
})

//remove whole collection(remove all files)
bot.command('clear',(ctx)=>{
    if(ctx.chat.type == 'private') {
        if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
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
    //console.log(text);
    let id = parseInt(text)

    if(ctx.chat.type == 'private') {
        if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
            saver.removeUserFile(id)
            ctx.reply('✅ Dihapus')
        }
    }
})

bot.command('sendchat',async(ctx)=>{
    groupDetails = await saver.getGroup().then((res)=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function sendchat() {
            for (const group of groupId) {
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(!memberstatus || memberstatus.status == 'creator' || memberstatus.status == 'administrator'){
                    const str = ctx.message.text;
                    const words = str.split(/ +/g);
                    const command = words.shift().slice(1);
                    const userId = words.shift();
                    const caption = words.join(" ");
                    ctx.reply('Terkirim!',{
                        reply_to_message_id: ctx.message.message_id
                    })
                    return bot.telegram.sendMessage(userId, `${caption}`)
                }
            }
        }

        if(ctx.chat.type == 'private') {
            if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
                const str = ctx.message.text;
                const words = str.split(/ +/g);
                const command = words.shift().slice(1);
                const userId = words.shift();
                const caption = words.join(" ");
                ctx.reply('Terkirim!',{
                    reply_to_message_id: ctx.message.message_id
                })

                return bot.telegram.sendMessage(userId, `${caption}`)
            }

            sendchat()
        }
    })
})

//broadcasting message to bot users(from last joined to first)
bot.command('broadcast',async(ctx)=>{
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
                            parse_mode:'HTML',
                            disable_web_page_preview: true
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
bot.command('banchat', (ctx) => {
    msg = ctx.message.text
    let msgArray = msg.split(' ')
    msgArray.shift()
    let text = msgArray.join(' ')
    //console.log(text)
    userId = {
        id: text
    }

    if(ctx.chat.type == 'private') {
        if(ctx.from.id ==process.env.ADMIN|| ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
            saver.banUser(userId).then((res) => {
                ctx.reply('❌ Dibanned')
            })
        }
    }
    
})

//unban user with user id
bot.command('unbanchat', (ctx) => {
    msg = ctx.message.text
    let msgArray = msg.split(' ')
    msgArray.shift()
    let text = msgArray.join(' ')
    //console.log(text)
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
    //console.log(ctx);
    
    fileDetails1 = {
            file_name: document.file_name,
            userId:ctx.from.id,
            file_id: document.file_id,
            mediaId: ctx.message.media_group_id,
            caption: ctx.message.caption,
            file_size: document.file_size,
            uniqueId: document.file_unique_id,
            type: 'document'
        }
        //console.log(fileDetails1.caption);    
    
    if(fileDetails1.mediaId == undefined){
        if(fileDetails1.file_name == undefined){
            fileDetails2 = {
                file_name: today2(ctx),
                userId:ctx.from.id,
                file_id: document.file_id,
                caption: ctx.message.caption,
                file_size: document.file_size,
                uniqueId: document.file_unique_id,
                type: 'document'
            }
            //console.log(fileDetails2.caption);
        }else{
            var exstension = document.file_name;
            var regex = /\.[A-Za-z0-9]+$/gm
            var doctext = exstension.replace(regex, '');
            fileDetails = {
                file_name: doctext,
                userId:ctx.from.id,
                file_id: document.file_id,
                caption: ctx.message.caption,
                file_size: document.file_size,
                uniqueId: document.file_unique_id,
                type: 'document'
            }
            //console.log(fileDetails.caption);
        }
    }else{
        if(fileDetails1.file_name == undefined){
            fileDetails4 = {
                file_name: today2(ctx),
                userId:ctx.from.id,
                file_id: document.file_id,
                mediaId: ctx.message.media_group_id,
                caption: ctx.message.caption,
                file_size: document.file_size,
                uniqueId: document.file_unique_id,
                type: 'document'
            }
            //console.log(fileDetails4.caption);
        }else{
            var exstension = document.file_name;
            var regex = /\.[A-Za-z0-9]+$/gm
            var doctext = exstension.replace(regex, '');
            fileDetails3 = {
                file_name: doctext,
                userId:ctx.from.id,
                file_id: document.file_id,
                mediaId: ctx.message.media_group_id,
                caption: ctx.message.caption,
                file_size: document.file_size,
                uniqueId: document.file_unique_id,
                type: 'document'
            }
            //console.log(fileDetails3.caption);
        }
    }
    
    if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
        if(!fileDetails1.mediaId){
            if(!fileDetails1.file_name){
                saver.saveFile(fileDetails2)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Document disimpan \n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(!ctx.message.caption)
                    return ctx.replyWithDocument(document.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithDocument(document.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                        parse_mode:'HTML'
                    })
            }else{
                saver.saveFile(fileDetails)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Document disimpan \n<b>Nama file:</b> ${doctext}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(!ctx.message.caption)
                    return ctx.replyWithDocument(document.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${doctext}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithDocument(document.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${doctext}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                        parse_mode:'HTML'
                    })
            }
        }z
        if(!fileDetails1.file_name){
            saver.saveFile(fileDetails4)
            if(ctx.chat.type == 'private') {
                ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                    reply_to_message_id: ctx.message.message_id
                })
            }
            if(!ctx.message.caption)                   
                return ctx.replyWithDocument(document.file_id, {
                    chat_id: process.env.LOG_CHANNEL,
                    caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                    parse_mode:'HTML'
                })
                ctx.replyWithDocument(document.file_id, {
                    chat_id: process.env.LOG_CHANNEL,
                    caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                    parse_mode:'HTML'
                })
        }else{
            saver.saveFile(fileDetails3)
            if(ctx.chat.type == 'private') {
                ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${doctext}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_unique_id}\n<b>ID grup:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                    reply_to_message_id: ctx.message.message_id
                })
            }
            if(!ctx.message.caption)                   
                return ctx.replyWithDocument(document.file_id, {
                    chat_id: process.env.LOG_CHANNEL,
                    caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${doctext}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                    parse_mode:'HTML'
                })
                ctx.replyWithDocument(document.file_id, {
                    chat_id: process.env.LOG_CHANNEL,
                    caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${doctext}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                    parse_mode:'HTML'
                })
        }
    }else{
        //try{
            var botStatus3 = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member3 = await bot.telegram.getChatMember(channelId, ctx.from.id)
            //console.log(member3);
            if(!member3 || member3.status == 'left' || member3.status == 'kicked'){
                var profile6 = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
                if(!profile6 || profile6.total_count == 0)
                    return ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                        parse_mode:'HTML',
                        disable_web_page_preview: true,
                        reply_markup:{
                            inline_keyboard:inKey2
                        }
                    })
                    ctx.replyWithPhoto(profile6.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                        parse_mode:'HTML',
                        disable_web_page_preview: true,
                        reply_markup:{
                            inline_keyboard:inKey2
                        }
                    })
            }else{
                await saver.checkBan(`${ctx.from.id}`).then((res) => {
                //console.log(res);
                if(res == true) {
                    if(ctx.chat.type == 'private') {
                        ctx.reply(`${messagebanned(ctx)}`)
                    }
                }else{
                    if(!fileDetails1.mediaId){
                        if(!fileDetails1.file_name){
                            saver.saveFile(fileDetails2)
                            if(ctx.chat.type == 'private') {
                                ctx.reply(`✔️ Document disimpan \n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,{
                                    parse_mode: 'HTML',
                                    disable_web_page_preview: true,
                                    reply_to_message_id: ctx.message.message_id
                                })
                            }
                            if(!ctx.message.caption)
                                return ctx.replyWithDocument(document.file_id, {
                                    chat_id: process.env.LOG_CHANNEL,
                                    caption: `✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                                    parse_mode:'HTML'
                                })
                                ctx.replyWithDocument(document.file_id, {
                                    chat_id: process.env.LOG_CHANNEL,
                                    caption: `${ctx.message.caption}\n\n✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                                    parse_mode:'HTML'
                                })
                        }else{
                            saver.saveFile(fileDetails)
                            if(ctx.chat.type == 'private') {
                                ctx.reply(`✔️ Document disimpan \n<b>Nama file:</b> ${doctext}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,{
                                    parse_mode: 'HTML',
                                    disable_web_page_preview: true,
                                    reply_to_message_id: ctx.message.message_id
                                })
                            }
                            if(!ctx.message.caption)
                                return ctx.replyWithDocument(document.file_id, {
                                    chat_id: process.env.LOG_CHANNEL,
                                    caption: `✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${doctext}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                                    parse_mode:'HTML'
                                })
                                ctx.replyWithDocument(document.file_id, {
                                    chat_id: process.env.LOG_CHANNEL,
                                    caption: `${ctx.message.caption}\n\n✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${doctext}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                                    parse_mode:'HTML'
                                })
                        }
                    }
                }
                if(!fileDetails1.file_name){
                    saver.saveFile(fileDetails4)
                    if(ctx.chat.type == 'private') {
                        ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                    }
                    if(!ctx.message.caption)                   
                        return ctx.replyWithDocument(document.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                            parse_mode:'HTML'
                        })
                        ctx.replyWithDocument(document.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                            parse_mode:'HTML'
                        })
                }else{
                    saver.saveFile(fileDetails3)
                    if(ctx.chat.type == 'private') {
                        ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${doctext}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                    }
                    if(!ctx.message.caption)                   
                        return ctx.replyWithDocument(document.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${doctext}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                            parse_mode:'HTML'
                        })
                        ctx.replyWithDocument(document.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${doctext}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                            parse_mode:'HTML'
                        })
                }
            })
        }
        //}
        //catch(error){
        //    ctx.reply(`${messagebotnoaddgroup(ctx)}`)
        //}
    }

})

//video files
bot.on('video', async(ctx) => {
    video = ctx.message.video
    //console.log(ctx);

    fileDetails1 = {
            file_name: video.file_name,
            userId:ctx.from.id,
            file_id: video.file_id,
            mediaId: ctx.message.media_group_id,
            caption: ctx.message.caption,
            file_size: video.file_size,
            uniqueId: video.file_unique_id,
            type: 'video'
        }
        //console.log(fileDetails1.caption);    

    if(fileDetails1.mediaId == undefined){
        if(fileDetails1.file_name == undefined){
            fileDetails2 = {
                file_name: today2(ctx),
                userId:ctx.from.id,
                file_id: video.file_id,
                caption: ctx.message.caption,
                file_size: video.file_size,
                uniqueId: video.file_unique_id,
                type: 'video'
            }
            //console.log(fileDetails2.caption);
        }else{
            var exstension = video.file_name;
            var regex = /\.[A-Za-z0-9]+$/gm
            var vidext = exstension.replace(regex, '');
            fileDetails = {
                file_name: vidext,
                userId:ctx.from.id,
                file_id: video.file_id,
                caption: ctx.message.caption,
                file_size: video.file_size,
                uniqueId: video.file_unique_id,
                type: 'video'
            }
            //console.log(fileDetails.caption);
        }
    }else{
        if(fileDetails1.file_name == undefined){
            fileDetails4 = {
                file_name: today2(ctx),
                userId:ctx.from.id,
                file_id: video.file_id,
                mediaId: ctx.message.media_group_id,
                caption: ctx.message.caption,
                file_size: video.file_size,
                uniqueId: video.file_unique_id,
                type: 'video'
            }
            //console.log(fileDetails4.caption);
        }else{
            var exstension = video.file_name;
            var regex = /\.[A-Za-z0-9]+$/gm
            var vidext = exstension.replace(regex, '');
            fileDetails3 = {
                file_name: vidext,
                userId:ctx.from.id,
                file_id: video.file_id,
                mediaId: ctx.message.media_group_id,
                caption: ctx.message.caption,
                file_size: video.file_size,
                uniqueId: video.file_unique_id,
                type: 'video'
            }
            //console.log(fileDetails3.caption);
        }
    }

    if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
        if(!fileDetails1.mediaId){
            if(!fileDetails1.file_name){
                saver.saveFile(fileDetails2)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Video disimpan \n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(!ctx.message.caption)
                    return ctx.replyWithVideo(video.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithVideo(video.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                        parse_mode:'HTML'
                    })
            }else{
                saver.saveFile(fileDetails)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Video disimpan \n<b>Nama file:</b> ${vidext}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(!ctx.message.caption)
                    return ctx.replyWithVideo(video.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${vidext}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithVideo(video.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${vidext}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                        parse_mode:'HTML'
                    })
            }
        }
        if(!fileDetails1.file_name){
            saver.saveFile(fileDetails4)
            if(ctx.chat.type == 'private') {
                ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                    reply_to_message_id: ctx.message.message_id
                })
            }
            if(!ctx.message.caption)                   
                return ctx.replyWithVideo(video.file_id, {
                    chat_id: process.env.LOG_CHANNEL,
                    caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                    parse_mode:'HTML'
                })
                ctx.replyWithVideo(video.file_id, {
                    chat_id: process.env.LOG_CHANNEL,
                    caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                    parse_mode:'HTML'
                })
        }else{
            saver.saveFile(fileDetails3)
            if(ctx.chat.type == 'private') {
                ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${vidext}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                    reply_to_message_id: ctx.message.message_id
                })
            }
            if(!ctx.message.caption)                   
                return ctx.replyWithVideo(video.file_id, {
                    chat_id: process.env.LOG_CHANNEL,
                    caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${vidext}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                    parse_mode:'HTML'
                })
                ctx.replyWithVideo(video.file_id, {
                    chat_id: process.env.LOG_CHANNEL,
                    caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${vidext}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                    parse_mode:'HTML'
                })
        }
    }else{
        //try{
            var botStatus3 = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member3 = await bot.telegram.getChatMember(channelId, ctx.from.id)
            //console.log(member3);
            if(!member3 || member3.status == 'left' || member3.status == 'kicked'){
                var profile6 = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
                if(!profile6 || profile6.total_count == 0)
                    return ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                        parse_mode:'HTML',
                        disable_web_page_preview: true,
                        reply_markup:{
                            inline_keyboard:inKey2
                        }
                    })
                    ctx.replyWithPhoto(profile6.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                        parse_mode:'HTML',
                        disable_web_page_preview: true,
                        reply_markup:{
                            inline_keyboard:inKey2
                        }
                    })
            }else{
                await saver.checkBan(`${ctx.from.id}`).then((res) => {
                //console.log(res);
                if(res == true) {
                    if(ctx.chat.type == 'private') {
                        ctx.reply(`${messagebanned(ctx)}`)
                    }
                }else{
                    if(!fileDetails1.mediaId){
                        if(!fileDetails1.file_name){
                            saver.saveFile(fileDetails2)
                            if(ctx.chat.type == 'private') {
                                ctx.reply(`✔️ Video disimpan \n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,{
                                    parse_mode: 'HTML',
                                    disable_web_page_preview: true,
                                    reply_to_message_id: ctx.message.message_id
                                })
                            }
                            if(!ctx.message.caption)
                                return ctx.replyWithVideo(video.file_id, {
                                    chat_id: process.env.LOG_CHANNEL,
                                    caption: `✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                                    parse_mode:'HTML'
                                })
                                ctx.replyWithVideo(video.file_id, {
                                    chat_id: process.env.LOG_CHANNEL,
                                    caption: `${ctx.message.caption}\n\n<b>✔️ Video disimpan \nDari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                                    parse_mode:'HTML'
                                })
                        }else{
                            saver.saveFile(fileDetails)
                            if(ctx.chat.type == 'private') {
                                ctx.reply(`✔️ Video disimpan \n<b>Nama file:</b> ${vidext}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,{
                                    parse_mode: 'HTML',
                                    disable_web_page_preview: true,
                                    reply_to_message_id: ctx.message.message_id
                                })
                            }
                            if(!ctx.message.caption)
                                return ctx.replyWithVideo(video.file_id, {
                                    chat_id: process.env.LOG_CHANNEL,
                                    caption: `✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${vidext}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                                    parse_mode:'HTML'
                                })
                                ctx.replyWithVideo(video.file_id, {
                                    chat_id: process.env.LOG_CHANNEL,
                                    caption: `${ctx.message.caption}\n\n✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${vidext}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                                    parse_mode:'HTML'
                                })
                        }
                    }
                }
                if(!fileDetails1.file_name){
                    saver.saveFile(fileDetails4)
                    if(ctx.chat.type == 'private') {
                        ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                    }
                    if(!ctx.message.caption)                   
                        return ctx.replyWithVideo(video.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                            parse_mode:'HTML'
                        })
                        ctx.replyWithVideo(video.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                            parse_mode:'HTML'
                        })
                }else{
                    saver.saveFile(fileDetails3)
                    if(ctx.chat.type == 'private') {
                        ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${vidext}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                    }
                    if(!ctx.message.caption)                   
                        return ctx.replyWithVideo(video.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${vidext}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                            parse_mode:'HTML'
                        })
                        ctx.replyWithVideo(video.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${vidext}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                            parse_mode:'HTML'
                        })
                }
            })
        }
        //}
        //catch(error){
        //    ctx.reply(`${messagebotnoaddgroup(ctx)}`)
        //}
    }

})

//photo files
bot.on('photo', async(ctx) => {
    photo = ctx.message.photo
    //console.log(ctx);

    fileDetails1 = {
            file_name: photo[1].file_name,
            userId:ctx.from.id,
            file_id: photo[1].file_id,
            mediaId: ctx.message.media_group_id,
            caption: ctx.message.caption,
            file_size: photo[1].file_size,
            uniqueId: photo[1].file_unique_id,
            type: 'photo'
        }
        //console.log(fileDetails1.caption);    

    if(fileDetails1.mediaId == undefined){
        if(fileDetails1.file_name == undefined){
            fileDetails2 = {
                file_name: today2(ctx),
                userId:ctx.from.id,
                file_id: photo[1].file_id,
                caption: ctx.message.caption,
                file_size: photo[1].file_size,
                uniqueId: photo[1].file_unique_id,
                type: 'photo'
            }
            //console.log(fileDetails2.caption);
        }else{
            var exstension = photo[1].file_name;
            var regex = /\.[A-Za-z0-9]+$/gm
            var photext = exstension.replace(regex, '');
            fileDetails = {
                file_name: photext,
                userId:ctx.from.id,
                file_id: photo[1].file_id,
                caption: ctx.message.caption,
                file_size: photo[1].file_size,
                uniqueId: photo[1].file_unique_id,
                type: 'photo'
            }
            //console.log(fileDetails.caption);
        }
    }else{
        if(fileDetails1.file_name == undefined){
            fileDetails4 = {
                file_name: today2(ctx),
                userId:ctx.from.id,
                file_id: photo[1].file_id,
                mediaId: ctx.message.media_group_id,
                caption: ctx.message.caption,
                file_size: photo[1].file_size,
                uniqueId: photo[1].file_unique_id,
                type: 'photo'
            }
            //console.log(fileDetails4.caption);
        }else{
            var exstension = photo[1].file_name;
            var regex = /\.[A-Za-z0-9]+$/gm
            var photext = exstension.replace(regex, '');
            fileDetails3 = {
                file_name: photext,
                userId:ctx.from.id,
                file_id: photo[1].file_id,
                mediaId: ctx.message.media_group_id,
                caption: ctx.message.caption,
                file_size: photo[1].file_size,
                uniqueId: photo[1].file_unique_id,
                type: 'photo'
            }
            //console.log(fileDetails3.caption);
        }
    }

    if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
        if(!fileDetails1.mediaId){
            if(!fileDetails1.file_name){
                saver.saveFile(fileDetails2)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Photo disimpan \n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(!ctx.message.caption)
                    return ctx.replyWithPhoto(photo[1].file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithPhoto(photo[1].file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                        parse_mode:'HTML'
                    })
            }else{
                saver.saveFile(fileDetails)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Photo disimpan \n<b>Nama file:</b> ${photext}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(!ctx.message.caption)
                    return ctx.replyWithPhoto(photo[1].file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${photext}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithPhoto(photo[1].file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${photext}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                        parse_mode:'HTML'
                    })
            }
        }
        if(!fileDetails1.file_name){
            saver.saveFile(fileDetails4)
            if(ctx.chat.type == 'private') {
                ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                    reply_to_message_id: ctx.message.message_id
                })
            }
            if(!ctx.message.caption)                   
                return ctx.replyWithPhoto(photo[1].file_id, {
                    chat_id: process.env.LOG_CHANNEL,
                    caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                    parse_mode:'HTML'
                })
                ctx.replyWithPhoto(photo[1].file_id, {
                    chat_id: process.env.LOG_CHANNEL,
                    caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                    parse_mode:'HTML'
                })
        }else{
            saver.saveFile(fileDetails3)
            if(ctx.chat.type == 'private') {
                ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${photext}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                    reply_to_message_id: ctx.message.message_id
                })
            }
            if(!ctx.message.caption)                   
                return ctx.replyWithPhoto(photo[1].file_id, {
                    chat_id: process.env.LOG_CHANNEL,
                    caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${photext}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                    parse_mode:'HTML'
                })
                ctx.replyWithPhoto(photo[1].file_id, {
                    chat_id: process.env.LOG_CHANNEL,
                    caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${photext}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                    parse_mode:'HTML'
                })
        }
    }else{
        //try{
            var botStatus3 = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member3 = await bot.telegram.getChatMember(channelId, ctx.from.id)
            //console.log(member3);
            if(!member3 || member3.status == 'left' || member3.status == 'kicked'){
                var profile6 = await bot.telegram.getUserProfilePhotos(ctx.chat.id)
                if(!profile6 || profile6.total_count == 0)
                    return ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                        parse_mode:'HTML',
                        disable_web_page_preview: true,
                        reply_markup:{
                            inline_keyboard:inKey2
                        }
                    })
                    ctx.replyWithPhoto(profile6.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                        parse_mode:'HTML',
                        disable_web_page_preview: true,
                        reply_markup:{
                            inline_keyboard:inKey2
                        }
                    })
            }else{
                await saver.checkBan(`${ctx.from.id}`).then((res) => {
                //console.log(res);
                if(res == true) {
                    if(ctx.chat.type == 'private') {
                        ctx.reply(`${messagebanned(ctx)}`)
                    }
                }else{
                    if(!fileDetails1.mediaId){
                        if(!fileDetails1.file_name){
                            saver.saveFile(fileDetails2)
                            if(ctx.chat.type == 'private') {
                                ctx.reply(`✔️ Photo disimpan \n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,{
                                    parse_mode: 'HTML',
                                    disable_web_page_preview: true,
                                    reply_to_message_id: ctx.message.message_id
                                })
                            }
                            if(!ctx.message.caption)
                                return ctx.replyWithPhoto(photo[1].file_id, {
                                    chat_id: process.env.LOG_CHANNEL,
                                    caption: `✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                                    parse_mode:'HTML'
                                })
                                ctx.replyWithPhoto(photo[1].file_id, {
                                    chat_id: process.env.LOG_CHANNEL,
                                    caption: `${ctx.message.caption}\n\n✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                                    parse_mode:'HTML'
                                })
                        }else{
                            saver.saveFile(fileDetails)
                            if(ctx.chat.type == 'private') {
                                ctx.reply(`✔️ Photo disimpan \n<b>Nama file:</b> ${photext}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,{
                                    parse_mode: 'HTML',
                                    disable_web_page_preview: true,
                                    reply_to_message_id: ctx.message.message_id
                                })
                            }
                            if(!ctx.message.caption)
                                return ctx.replyWithPhoto(photo[1].file_id, {
                                    chat_id: process.env.LOG_CHANNEL,
                                    caption: `✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${photext}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                                    parse_mode:'HTML'
                                })
                                ctx.replyWithPhoto(photo[1].file_id, {
                                    chat_id: process.env.LOG_CHANNEL,
                                    caption: `${ctx.message.caption}\n\n✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${photext}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                                    parse_mode:'HTML'
                                })
                        }
                    }
                }
                if(!fileDetails1.file_name){
                    saver.saveFile(fileDetails4)
                    if(ctx.chat.type == 'private') {
                        ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                    }
                    if(!ctx.message.caption)                   
                        return ctx.replyWithPhoto(photo[1].file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                            parse_mode:'HTML'
                        })
                        ctx.replyWithPhoto(photo[1].file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${today2(ctx)}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                            parse_mode:'HTML'
                        })
                }else{
                    saver.saveFile(fileDetails3)
                    if(ctx.chat.type == 'private') {
                        ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${photext}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                    }
                    if(!ctx.message.caption)                   
                        return ctx.replyWithPhoto(photo[1].file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${photext}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                            parse_mode:'HTML'
                        })
                        ctx.replyWithPhoto(photo[1].file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${photext}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                            parse_mode:'HTML'
                        })
                }
            })
        }
        //}
        //catch(error){
        //    ctx.reply(`${messagebotnoaddgroup(ctx)}`)
        //}
    }

})

bot.command('stats',async(ctx)=>{
    stats = await saver.getUser().then((res)=>{
        if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
            ctx.reply(`📊 Total pengguna: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
        
    })
    stats = await saver.getMedia().then((res)=>{
        if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
            ctx.reply(`📊 Total media: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }

    })
    stats = await saver.getBan().then((res)=>{
        if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
            ctx.reply(`📊 Total pengguna melanggar: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
        
    })
    stats = await saver.getGroup().then((res)=>{
        if(ctx.from.id ==process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
            ctx.reply(`📊 Total grup terdaftar: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
        
    })
})

//getting files as inline result
bot.on('inline_query',async(ctx)=>{
    query = ctx.inlineQuery.query
    if(query.length>0){
        // pastikan input sesuai regex
        const type_reg = /(document|video|photo)?\s(\w*)/;
        var reg_veriv = type_reg.exec(query)
        
        if(!reg_veriv) return;
        if(!reg_veriv[1])return;

        var file_type = reg_veriv[1];
        var keyword = reg_veriv[2];

        let searchResult = saver.getfileInline(keyword).then((res)=>{
            let result = res.filter(e => e.type == file_type).map((ctx,index)=>{
                    var data = {
                        type:ctx.type,
                        id:ctx._id,
                        title:ctx.file_name,
                        caption:ctx.caption,
                        reply_markup:{
                            inline_keyboard:[
                                [{text:"Pencarian",switch_inline_query:''}]
                            ]
                        }
                    }
                    data[`${ctx.type}_file_id`] = ctx.file_id;
                    return data;
                }
            )
            ctx.answerInlineQuery(result)
        })
    }else{
        //console.log('query not found');
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
