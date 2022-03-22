require('dotenv').config()
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.TOKEN, {
    handlerTimeout: 90_000,
 });
 

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
    return `⚠ YOU ARE BLOCKED FOR ABUSE OF A BOTT, CALL THE ADMIN FOR APPEAL.`;
}
function messagebotnoaddgroup(ctx){
    return `The bot has not entered the owner's channel/group.`;
}
function messagelink(ctx){
    return `Send bot videos, photos and documents.`;
}

const url2 = process.env.LINKCHANNEL.split(/[\,-]+/);
const url3 = url2[0];
const url4 = url2[1];

// inline keyboard
const inKey = [
  [{text:'📎 Tautan',callback_data:'POP'}],
  [{text: `${url3}`, url: `${url4}`}]
];

const inKey2 = [
  [{text: `${url3}`, url: `${url4}`}]
];

//BOT START
bot.start(async(ctx)=>{
    if(ctx.chat.type == 'private') {
        const msg = ctx.message.text
        let msgArray = msg.split(' ')
        //console.log(msgArray.length);
        let length = msgArray.length
        msgArray.shift()
        let query = msgArray.join(' ')
    
        const user = {
            first_name:ctx.from.first_name,
            userId:ctx.from.id
        }

        if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2)){
            //welcoming message on /start and ifthere is a query available we can send files
            if(length == 1){
                await ctx.deleteMessage(ctx.message.message_id)
                const profile = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                if(!profile || profile.total_count == 0)
                    return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
                        parse_mode:'HTML',
                        disable_web_page_preview: true,
                        reply_markup:{
                            inline_keyboard:inKey
                        }
                    })
                    await ctx.replyWithPhoto(profile.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
                        parse_mode:'HTML',
                        disable_web_page_preview: true,
                        reply_markup:{
                            inline_keyboard:inKey
                        }
                    })
            }else{
                if(query.indexOf('grp_') > -1){
                    let query1 = query.replace('grp_','');
                    try{
                        const res1 = await saver.getFile1(query1)
                            let mediagroup = [];
                            for (let index = 0; index < res1.length; index++) {
                            const data = res1[index];
                            mediagroup.push({type: data.type, media: data.file_id, caption: data.caption, parse_mode:'HTML'});
                        }

                        async function captionFunction() {
                            return await ctx.reply(`${captionbuild(ctx)}`,{
                                parse_mode:'HTML'
                            })
                        }
                        await ctx.deleteMessage(ctx.message.message_id)
                        await ctx.telegram.sendMediaGroup(ctx.chat.id, mediagroup);
                        setTimeout(captionFunction, 1000)
                    }catch(error){
                        await ctx.reply(`Media not found or has been removed.`)
                    }
                }else{
                    let query2 = query;
                    try{
                        const res2 = await saver.getFile2(query2)
        
                        async function captionFunction2() {
                            await ctx.reply(`${captionbuild(ctx)}`,{
                                parse_mode:'HTML'
                            })
                        }
                        if(res2.type=='video'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            if(!res2.caption) {
                                setTimeout(captionFunction2, 1000)
                                return await ctx.replyWithVideo(res2.file_id);
                            }
                            await ctx.replyWithVideo(res2.file_id,{caption: `${res2.caption}`,
                                parse_mode:'HTML'
                            });
                                setTimeout(captionFunction2, 1000)
                        }else if(res2.type=='photo'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            if(!res2.caption) {
                                setTimeout(captionFunction2, 1000)
                                return await ctx.replyWithPhoto(res2.file_id);
                            }
                            await ctx.replyWithPhoto(res2.file_id,{caption: `${res2.caption}`,
                                parse_mode:'HTML'
                            });
                                setTimeout(captionFunction2, 1000)
                        }else if(res2.type=='document'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            if(!res2.caption) {
                                setTimeout(captionFunction2, 1000)
                                return await ctx.replyWithDocument(res2.file_id);
                            }
                            await ctx.replyWithDocument(res2.file_id,{caption: `${res2.caption}`,
                                parse_mode:'HTML'
                            })
                                setTimeout(captionFunction2, 1000)
                        }
                    }catch(error){
                        await ctx.deleteMessage(ctx.message.message_id)
                        await ctx.reply(`Media not found or has been removed.`)
                    }
                }
            }
        }else{
            try {
                var botStatus = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
                var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
                //console.log(member);
                if(member.status == 'restricted' || member.status == 'left' || member.status == 'kicked'){
                    const profile2 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            if(ctx.chat.type == 'private') {
                                await ctx.deleteMessage(ctx.message.message_id)
                                await ctx.reply(`${messagebanned(ctx)}`)
                            }
                        }else{
                            ctx.deleteMessage()
                            if(!profile2 || profile2.total_count == 0)
                                return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                                    parse_mode:'HTML',
                                    disable_web_page_preview: true,
                                    reply_markup:{
                                        inline_keyboard:inKey2
                                    }
                                })
                                await ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                                    parse_mode:'HTML',
                                    disable_web_page_preview: true,
                                    reply_markup:{
                                        inline_keyboard:inKey2
                                    }
                                })
                        }
                    })
                }else{
                    //welcoming message on /start and ifthere is a query available we can send files
                    if(length == 1){
                        const profile3 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                            await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                //console.log(res);
                                if(res == true) {
                                    if(ctx.chat.type == 'private') {
                                        await ctx.deleteMessage(ctx.message.message_id)
                                        await ctx.reply(`${messagebanned(ctx)}`)
                                    }
                                }else{
                                    await ctx.deleteMessage(ctx.message.message_id)
                                    if(!profile3 || profile3.total_count == 0)
                                        return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true,
                                            reply_markup:{
                                                inline_keyboard:inKey
                                            }
                                        })
                                        await ctx.replyWithPhoto(profile3.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true,
                                            reply_markup:{
                                                inline_keyboard:inKey
                                            }
                                        })
                                }
                            })
                        }else{
                            if (query.indexOf('grp_') > -1){
                                let query1 = query.replace('grp_','');
                                try{
                                    const res1 = await saver.getFile1(query1)
                                        let mediagroup = [];
                                        for (let index = 0; index < res1.length; index++) {
                                        const data = res1[index];
                                        mediagroup.push({type: data.type, media: data.file_id, caption: data.caption, parse_mode:'HTML'});
                                    }
                    
                                    async function captionFunction() {
                                        return await ctx.reply(`${captionbuild(ctx)}`,{
                                            parse_mode:'HTML'
                                        })
                                    }
                                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                        //console.log(res);
                                        if(res == true) {
                                            await ctx.deleteMessage(ctx.message.message_id)
                                            if(ctx.chat.type == 'private') {
                                                await ctx.deleteMessage(ctx.message.message_id)
                                                await ctx.reply(`${messagebanned(ctx)}`)
                                            }
                                        }else{
                                            await ctx.deleteMessage(ctx.message.message_id)
                                            await ctx.telegram.sendMediaGroup(ctx.chat.id, mediagroup);
                                            setTimeout(captionFunction, 1000)
                                        }
                                    })
                                }catch(error){
                                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                        //console.log(res);
                                        if(res == true) {
                                            if(ctx.chat.type == 'private') {
                                                await ctx.deleteMessage(ctx.message.message_id)
                                                await ctx.reply(`${messagebanned(ctx)}`)
                                            }
                                        }else{
                                            await ctx.reply(`Media not found or has been removed.`)
                                        }
                                    })
                                }
                            }else{
                                let query2 = query;
                                try{
                                    const res2 = await saver.getFile2(query2)
                    
                                    async function captionFunction2() {
                                        await ctx.reply(`${captionbuild(ctx)}`,{
                                            parse_mode:'HTML'
                                        })
                                    }
                                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                        //console.log(res);
                                        if(res == true) {
                                            if(ctx.chat.type == 'private') {
                                                await ctx.deleteMessage(ctx.message.message_id)
                                                await ctx.reply(`${messagebanned(ctx)}`)
                                            }
                                        }else{
                                            if(res2.type=='video'){
                                                await ctx.deleteMessage(ctx.message.message_id)
                                                if(!res2.caption) {
                                                    setTimeout(captionFunction2, 1000)
                                                    return ctx.replyWithVideo(res2.file_id);
                                                }
                                                await ctx.replyWithVideo(res2.file_id,{caption: `${res2.caption}`,
                                                    parse_mode:'HTML'
                                                });
                                                    setTimeout(captionFunction2, 1000)
                                            }else if(res2.type=='photo'){
                                                await ctx.deleteMessage(ctx.message.message_id)
                                                if(!res2.caption) {
                                                    setTimeout(captionFunction2, 1000)
                                                    return await ctx.replyWithPhoto(res2.file_id);
                                                }
                                                await ctx.replyWithPhoto(res2.file_id,{caption: `${res2.caption}`,
                                                    parse_mode:'HTML'
                                                });
                                                    setTimeout(captionFunction2, 1000)
                                            }else if(res2.type=='document'){
                                                await ctx.deleteMessage(ctx.message.message_id)
                                                if(!res2.caption) {
                                                    setTimeout(captionFunction2, 1000)
                                                    return await ctx.replyWithDocument(res2.file_id);
                                                }
                                                await ctx.replyWithDocument(res2.file_id,{caption: `${res2.caption}`,
                                                    parse_mode:'HTML'
                                                })
                                                    setTimeout(captionFunction2, 1000)
                                            }
                                        }
                                    })
                                }catch(error){
                                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                        //console.log(res);
                                        if(res == true) {
                                            if(ctx.chat.type == 'private') {
                                                await ctx.deleteMessage(ctx.message.message_id)
                                                await ctx.reply(`${messagebanned(ctx)}`)
                                            }
                                        }else{
                                            await ctx.deleteMessage(ctx.message.message_id)
                                            await ctx.reply(`Media not found or has been removed.`)
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            catch(error){
                await ctx.deleteMessage(ctx.message.message_id)
                await ctx.reply(`${messagebotnoaddgroup(ctx)}`)
            }
        }
        //saving user details to the database
        await saver.saveUser(user)
    }
})

//DEFINING POP CALLBACK
bot.action('POP', async(ctx)=>{
    await ctx.deleteMessage()
    await ctx.reply(`${messagelink(ctx)}`,{
        parse_mode: 'HTML',
        reply_markup:{
            inline_keyboard: [
                [{text:'Batal',callback_data:'STARTUP'}]
            ]
        }
    })
})

bot.action('STARTUP', async(ctx)=>{
    await ctx.deleteMessage()
    const profile = await bot.telegram.getUserProfilePhotos(ctx.from.id)
    if(!profile || profile.total_count == 0)
        return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
            parse_mode:'HTML',
            disable_web_page_preview: true,
            reply_markup:{
                inline_keyboard:inKey
            }
        })
        await ctx.replyWithPhoto(profile.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
            parse_mode:'HTML',
            disable_web_page_preview: true,
            reply_markup:{
                inline_keyboard:inKey
            }
        })
})

//TEST BOT
bot.hears(/ping/i,async(ctx)=>{
    if(ctx.chat.type == 'private') {    
        await saver.checkBan(`${ctx.from.id}`).then(async res => {
            //console.log(res);
            if(res == true) {
                if(ctx.chat.type == 'private') {
                    await ctx.deleteMessage(ctx.message.message_id)
                    await ctx.reply(`${messagebanned(ctx)}`)
                }
            }else{
                await ctx.deleteMessage(ctx.message.message_id)
                let chatId = ctx.message.from.id;
                let opts = {
                    reply_markup:{
                        inline_keyboard: [[{text:'OK',callback_data:'PONG'}]]
                    }
                }
                return await bot.telegram.sendMessage(chatId, 'pong' , opts);
            }
        })
    }
})

bot.action('PONG',async(ctx)=>{
    await ctx.deleteMessage(ctx.message.message_id)
})

//GROUP COMMAND
bot.command('reload',async(ctx)=>{
    var botStatus2 = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)
    var memberstatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.from.id)
    //console.log(memberstatus);
    const group = {
        groupId:ctx.chat.id
    }
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        if(memberstatus.status == 'creator' || memberstatus.status == 'administrator'){
            await ctx.deleteMessage(ctx.message.message_id)
            await ctx.reply('Bot restarted')
            await saver.saveGroup(group)
        }
        if(ctx.from.username == 'GroupAnonymousBot'){
            await ctx.deleteMessage(ctx.message.message_id)
            await ctx.reply('Bot restarted')
            await saver.saveGroup(group)
        }
    }
    
})

bot.command('kick',async(ctx)=>{
    const groupDetails = await saver.getGroup().then(async res=>{
        const n = res.length
        const groupId = []
        for (let i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function kick() {
            for (const group of groupId) {
                var botStatus2 = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){  
                        await ctx.deleteMessage(ctx.message.message_id)  
                        if(memberstatus.can_restrict_members == true){       
                                                if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.kickChatMember(ctx.chat.id, Number(args[0])).then(async result =>{
                                    //console.log(result)
                                })
                            }
                            await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(ctx.message.reply_to_message == undefined){
                            let args = ctx.message.text.split(" ").slice(1)
                            await bot.telegram.kickChatMember(ctx.chat.id, Number(args[0])).then(async result =>{
                                //console.log(result)
                            })
                        }
                        await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.kickChatMember(ctx.chat.id, Number(args[0])).then(async result =>{
                                    //console.log(result)
                                })
                            }
                            await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
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
    const groupDetails = await saver.getGroup().then(async res => {
        const n = res.length
        const groupId = []
        for (let i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function ban() {
            for (const group of groupId) {
                var botStatus2 = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(memberstatus.can_restrict_members == true){
                            if(ctx.message.reply_to_message == undefined){
                               const str = ctx.message.text;
                               const words = str.split(/ +/g);
                               const command = words.shift().slice(1);
                               const userId = words.shift();
                               const caption = words.join(" ");
                               const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";

                               await bot.telegram.callApi('banChatMember', {
                               chat_id: ctx.message.chat.id,
                               user_id: userId
                               }).then(async result =>{
                                   //console.log(result)
                                   await ctx.reply(`[${userId}] blocked. ${caption2}`,{
                                       parse_mode: 'HTML'
                                   })
                                   return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                       parse_mode: 'HTML'
                                   })
                               })
                            }
    
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const userId = words.shift();
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";
    
                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: ctx.message.reply_to_message.from.id
                            }).then(async result =>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                await ctx.reply(`${replyUsername} ${replyFromid} blocked. ${caption2}`,{
                                    parse_mode: 'HTML',
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                    parse_mode: 'HTML'
                                })
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(ctx.message.reply_to_message == undefined){
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const userId = words.shift();
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";

                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: userId
                            }).then(async result =>{
                                //console.log(result)
                                await ctx.reply(`[${userId}] blocked. ${caption2}`,{
                                    parse_mode: 'HTML'
                                })
                                return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                    parse_mode: 'HTML'
                                })
                            })
                        }

                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const userId = words.shift();
                        const caption = words.join(" ");
                        const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";

                        await bot.telegram.callApi('banChatMember', {
                        chat_id: ctx.message.chat.id,
                        user_id: ctx.message.reply_to_message.from.id
                        }).then(async result =>{
                            //console.log(result)
                            let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                            let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                            await ctx.reply(`${replyUsername} ${replyFromid} blocked. ${caption2}`,{
                                parse_mode: 'HTML',
                                reply_to_message_id: ctx.message.reply_to_message.message_id
                            })
                            return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                parse_mode: 'HTML'
                            })
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            if(ctx.message.reply_to_message == undefined){
                                const str = ctx.message.text;
                                const words = str.split(/ +/g);
                                const command = words.shift().slice(1);
                                const userId = words.shift();
                                const caption = words.join(" ");
                                const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";
    
                                await bot.telegram.callApi('banChatMember', {
                                chat_id: ctx.message.chat.id,
                                user_id: userId
                                }).then(async result =>{
                                    //console.log(result)
                                    await ctx.reply(`[${userId}] blocked. ${caption2}`,{
                                        parse_mode: 'HTML'
                                    })
                                    return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                        parse_mode: 'HTML'
                                    })
                                })
                            }
    
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const userId = words.shift();
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";
    
                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: ctx.message.reply_to_message.from.id
                            }).then(async result =>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                await ctx.reply(`${replyUsername} ${replyFromid} blocked. ${caption2}`,{
                                    parse_mode: 'HTML',
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                    parse_mode: 'HTML'
                                })
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
    const groupDetails = await saver.getGroup().then(async res => {
        const n = res.length
        const groupId = []
        for (let i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function unban() {
            for (const group of groupId) {
                var botStatus2 = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(memberstatus.can_restrict_members == true){
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.unbanChatMember(ctx.chat.id, Number(args[0])).then(async result =>{
                                    //console.log(result)
                                    await ctx.reply(`[${args[0]}] not blocked, can re-enter!`)
                                    return await bot.telegram.sendMessage(args[0], `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                                })
                            }
                            await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                await ctx.reply(`${replyUsername} ${replyFromid} not blocked, can re-enter!`,{
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return await bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(ctx.message.reply_to_message == undefined){
                            let args = ctx.message.text.split(" ").slice(1)
                            await bot.telegram.unbanChatMember(ctx.chat.id, Number(args[0])).then(async result =>{
                                //console.log(result)
                                await ctx.reply(`[${args[0]}] not blocked, can re-enter!`)
                                return await bot.telegram.sendMessage(args[0], `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                            })
                        }
                        await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                            //console.log(result)
                            let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                            let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                            await ctx.reply(`${replyUsername} ${replyFromid} not blocked, can re-enter!`,{
                                reply_to_message_id: ctx.message.reply_to_message.message_id
                            })
                            return await bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.unbanChatMember(ctx.chat.id, Number(args[0])).then(async result =>{
                                    //console.log(result)
                                    await ctx.reply(`[${args[0]}] not blocked, can re-enter!`)
                                    return await bot.telegram.sendMessage(args[0], `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                                })
                            }
                            await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                await ctx.reply(`${replyUsername} ${replyFromid} not blocked, can re-enter!`,{
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return await bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
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
    const groupDetails = await saver.getGroup().then(async res =>{
        const n = res.length
        const groupId = []
        for (let i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function pin() {
            for (const group of groupId) {
                var botStatus2 = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(memberstatus.can_pin_messages == true){
                            await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                                disable_notification: false,
                            }).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                            disable_notification: false,
                        }).then(async result =>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                                disable_notification: false,
                            }).then(async result =>{
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
    const groupDetails = await saver.getGroup().then( async res=>{
        const n = res.length
        const groupId = []
        for (let i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function unpin() {
            for (const group of groupId) {
                var botStatus2 = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(memberstatus.can_pin_messages == true){
                            await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(async result =>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage(ctx.message.message_id)
                            await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(async result =>{
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
    const groupDetails = await saver.getGroup().then(async res =>{
        const n = res.length
        const groupId = []
        for (let i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function send() {
            for (const group of groupId) {
                var botStatus2 = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'creator' || memberstatus.status == 'administrator'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(ctx.message.reply_to_message == undefined){
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const caption = words.join(" ");
    
                            return await bot.telegram.sendMessage(group, `${caption}`)
                        }
                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const caption = words.join(" ");

                        return await bot.telegram.sendMessage(group, `${caption}`,{
                            reply_to_message_id: ctx.message.reply_to_message.message_id
                        })
                    }
                    if(ctx.from.username == 'GroupAnonymousBot'){
                        await ctx.deleteMessage(ctx.message.message_id)
                        if(ctx.message.reply_to_message == undefined){
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const caption = words.join(" ");
    
                            return await bot.telegram.sendMessage(group, `${caption}`)
                        }
                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const caption = words.join(" ");

                        return await bot.telegram.sendMessage(group, `${caption}`,{
                            reply_to_message_id: ctx.message.reply_to_message.message_id
                        })
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
    if(ctx.chat.type == 'private') {       
        const profile4 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
        await saver.checkBan(`${ctx.from.id}`).then(async res => {
            //console.log(res);
            if(res == true) {
                if(ctx.chat.type == 'private') {
                    await ctx.deleteMessage(ctx.message.message_id)
                    await ctx.reply(`${messagebanned(ctx)}`)
                }
            }else{
                if(!profile4 || profile4.total_count == 0){
                    await ctx.deleteMessage(ctx.message.message_id)
                    await ctx.reply(`<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n<b>Username:</b> ${username(ctx)}\n<b>ID:</b> ${ctx.from.id}`,{
                        parse_mode:'HTML'  
                    })
                }else{
                    await ctx.deleteMessage(ctx.message.message_id)
                    await ctx.replyWithPhoto(profile4.photos[0][0].file_id,{caption: `<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n<b>Username:</b> ${username(ctx)}\n<b>ID:</b> ${ctx.from.id}`,
                        parse_mode:'HTML'
                    })
                }
            }
        })
    }
    
})

//remove files with file_id
bot.command('rem', async(ctx) => {
    if(ctx.chat.type == 'private') {
        const msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text2 = msgArray.join(' ')
        let text = `${text2}`.replace(/_/g, '-');
        console.log(text);

        if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2)){
            await ctx.deleteMessage(ctx.message.message_id)
            saver.removeFile(text)
            await ctx.reply('❌ 1 media deleted successfully')
        }
    }
    
})

bot.command('remgrp', async(ctx) => {
    if(ctx.chat.type == 'private') {
        const msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let media = msgArray.join(' ')
        //console.log(media);

        if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2)){
            await ctx.deleteMessage(ctx.message.message_id)
            saver.removeFileMedia(media)
            await ctx.reply('❌ Media group deleted successfully')
        }
    }
})

//remove whole collection(remove all files)
bot.command('clear', async(ctx)=>{
    if(ctx.chat.type == 'private') {
        if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2)){
            await ctx.deleteMessage(ctx.message.message_id)
            await saver.deleteCollection()
            await ctx.reply('❌ All media deleted successfully')
        }
    }
})

//removing all files sent by a user
bot.command('remall', async(ctx) => {
    if(ctx.chat.type == 'private') {
        const msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')
        //console.log(text);
        let id = parseInt(text)

        if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2)){
            await ctx.deleteMessage(ctx.message.message_id)
            await saver.removeUserFile(id)
            await ctx.reply('❌ Delete all user media successfully')
        }
    }
    
})

//broadcasting message to bot users(from last joined to first)
bot.command('broadcast',async(ctx)=>{
    if(ctx.chat.type == 'private') {
        const msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')
        const userDetails = await saver.getUser().then(async res =>{
            const n = res.length
            const userId = []
            for (let i = n-1; i >=0; i--) {
                userId.push(res[i].userId)
            }

            //broadcasting
            const totalBroadCast = 0
            const totalFail = []

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
                        await saver.updateUser(users)
                        totalFail.push(users)

                    }
                }
                await ctx.reply(`✅ <b>Number of active users:</b> ${userId.length - totalFail.length}\n❌ <b>Total failed broadcasts:</b> ${totalFail.length}`,{
                    parse_mode:'HTML'
                })

            }

            if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2)){
                await ctx.deleteMessage(ctx.message.message_id)
                broadcast(text)
                await ctx.reply('Broadcast starts (Message is broadcast from last joined to first).')

            }else{
                await ctx.deleteMessage(ctx.message.message_id)
                await ctx.reply(`Commands can only be used by Admin.`) 
            }

        })
    }
    
})

//ban user with user id
bot.command('banchat', async(ctx) => {
    if(ctx.chat.type == 'private') {
        const msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')
        //console.log(text)
        const userId = {
            id: text
        }

        if(ctx.chat.type == 'private') {
            if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2)){
                await ctx.deleteMessage(ctx.message.message_id)
                await saver.banUser(userId).then(async res => {
                    await ctx.reply('❌ Banned')
                })
            }
        }
    }
     
})

//unban user with user id
bot.command('unbanchat', async(ctx) => {
    if(ctx.chat.type == 'private') {
        const msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift();
        let text = msgArray.join(' ')
        //console.log(text)
        const userId = {
            id: text
        }

        if(ctx.chat.type == 'private') {
            if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2)){
                await ctx.deleteMessage(ctx.message.message_id)
                await saver.unBan(userId).then(async res => {
                    await ctx.reply('✅ Finished')
                })
            }
        }
    }
    
})

//saving file
bot.on(['document', 'video', 'photo'], async(ctx,next) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
          return resolve("Result");
        }, 2000);
    });
    if (ctx.message.document) {
        if(ctx.chat.type == 'private') {
            if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2)){
                //const document = ctx.message.document
                const array1 = [
                    {
                        file: ctx.message.file_name,
                        userId: ctx.from.id,
                        file_id: ctx.message.document.file_id,
                        mediaId: ctx.message.media_group_id,
                        caption: ctx.message.caption,
                        file_size: ctx.message.document.file_size,
                        uniqueId: ctx.message.document.file_unique_id,
                        type: 'document'
                    }
                ];
                const element1 = array1.shift();
    
                if(element1.mediaId == undefined){
                    var tag = `✔️ Document save`;
                    var mediaId = ``;
                    var mediaId2 = ``;
                    if(element1.file == undefined){
                        var file_name2 = `${today2(ctx)}`;
                        if(element1.caption == undefined){
                            var caption2 =  ``;
                        }else{
                            var caption2 =  `\n\n${element1.caption}`;
                        }
                    }else{
                        var exstension2 = element1.file;
                        var regex2 = /\.[A-Za-z0-9]+$/gm
                        var doctext2 = exstension2.replace(regex2, '');
                        
                        var file_name2 = `${doctext2}`;
                        if(element1.caption == undefined){
                            var caption2 =  ``;
                        }else{
                            var caption2 =  `\n\n${element1.caption}`;
                        }
                    }
                }else{
                    var tag = `✔️ Group save`;
                    var mediaId = `\n<b>Media ID</b>: ${element1.mediaId}`;
                    var mediaId2 = `\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${element1.mediaId}`;
                    if(element1.file == undefined){
                        var file_name2 = `${today2(ctx)}`;
                        if(element1.caption == undefined){
                            var caption2 =  ``;
                        }else{
                            var caption2 =  `\n\n${element1.caption}`;
                        }
                    }else{
                        var exstension2 = element1.file;
                        var regex2 = /\.[A-Za-z0-9]+$/gm
                        var doctext2 = exstension2.replace(regex2, '');
                        
                        var file_name2 = `${doctext2}`;
                        if(element1.caption == undefined){
                            var caption2 =  ``;
                        }else{
                            var caption2 =  `\n\n${element1.caption}`;
                        }
                    }
                }
    
                await saver.checkFile(`${element1.uniqueId}`).then(async res => {
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`File already exists.`,{
                            reply_to_message_id: ctx.message.message_id
                        })
                    }else{
                        await ctx.replyWithDocument(element1.file_id, {
                            chat_id: ctx.chat.id,
                            caption: `${tag} \n<b>Name file:</b> ${file_name2}\n<b>Size:</b> ${element1.fle_size} B\n<b>File ID:</b> ${element1.uniqueId} ${mediaId} \n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${element1.uniqueId} ${mediaId2}`,
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                        await ctx.replyWithDocument(element1.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `${tag} \n<b>From:</b> ${ctx.from.id}\n<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Name file:</b> ${file_name2}\n<b>Size:</b> ${element1.fle_size} B\n<b>File ID:</b> ${element1.uniqueId} ${mediaId} \n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${element1.uniqueId} ${mediaId2} ${caption2}`,
                            parse_mode:'HTML'
                        })
                        const fileDetails1 = {
                            file_name: file_name2,
                            userId: ctx.from.id,
                            file_id: element1.file_id,
                            mediaId: element1.mediaId,
                            caption: element1.caption,
                            file_size: element1.fle_size,
                            uniqueId: element1.uniqueId,
                            type: 'document'
                        }
                        await saver.saveFile(fileDetails1)
                    }
                })
            }
        }
    } else if (ctx.message.video) {
        if(ctx.chat.type == 'private') {
            if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2)){
                //const video = ctx.message.video
                const array1 = [
                    {
                        file: ctx.message.file_name,
                        userId: ctx.from.id,
                        file_id: ctx.message.video.file_id,
                        mediaId: ctx.message.media_group_id,
                        caption: ctx.message.caption,
                        file_size: ctx.message.video.file_size,
                        uniqueId: ctx.message.video.file_unique_id,
                        type: 'video'
                    }
                ];
                const element1 = array1.shift();
        
                if(element1.mediaId == undefined){
                    var tag = `✔️ Video save`;
                    var mediaId = ``;
                    var mediaId2 = ``;
                    if(element1.file_name == undefined){
                        var file_name2 = `${today2(ctx)}`;
                        if(element1.caption == undefined){
                            var caption2 =  ``;
                        }else{
                            var caption2 =  `\n\n${element1.caption}`;
                        }
                    }else{
                        var exstension2 = element1.file_name;
                        var regex2 = /\.[A-Za-z0-9]+$/gm
                        var vidtext2 = exstension2.replace(regex2, '');
            
                        var file_name2 = `${vidtext2}`;
                        if(element1.caption == undefined){
                            var caption2 =  ``;
                        }else{
                            var caption2 =  `\n\n${element1.caption}`;
                        }
                    }
                }else{
                    var tag = `✔️ Group save`;
                    var mediaId = `\n<b>Media ID</b>: ${element1.mediaId}`;
                    var mediaId2 = `\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${element1.mediaId}`;
                    if(element1.file_name == undefined){
                        var file_name2 = `${today2(ctx)}`;
                        if(element1.caption == undefined){
                            var caption2 =  ``;
                        }else{
                            var caption2 =  `\n\n${element1.caption}`;
                        }
                    }else{
                        var exstension2 = element1.file_name;
                        var regex2 = /\.[A-Za-z0-9]+$/gm
                        var vidtext2 = exstension2.replace(regex2, '');
            
                        var file_name2 = `${vidtext2}`;
                        if(element1.caption == undefined){
                            var caption2 =  ``;
                        }else{
                            var caption2 =  `\n\n${element1.caption}`;
                        }
                    }
                }
    
                await saver.checkFile(`${element1.uniqueId}`).then(async res => {
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`File already exists.`,{
                            reply_to_message_id: ctx.message.message_id
                        })
                    }else{
                        await ctx.replyWithVideo(element1.file_id, {
                            chat_id: ctx.chat.id,
                            caption: `${tag} \n<b>Name file:</b> ${file_name2}\n<b>Size:</b> ${element1.file_size} B\n<b>File ID:</b> ${element1.uniqueId} ${mediaId} \n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${element1.uniqueId} ${mediaId2}`,
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                        await ctx.replyWithVideo(element1.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `${tag} \n<b>From:</b> ${ctx.from.id}\n<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Name file:</b> ${file_name2}\n<b>Size:</b> ${element1.file_size} B\n<b>File ID:</b> ${element1.uniqueId} ${mediaId} \n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${element1.uniqueId} ${mediaId2} ${caption2}`,
                            parse_mode:'HTML'
                        })
                        const fileDetails1 = {
                            file_name: file_name2,
                            userId: ctx.from.id,
                            file_id: element1.file_id,
                            mediaId: element1.mediaId,
                            caption: element1.caption,
                            file_size: element1.file_size,
                            uniqueId: element1.uniqueId,
                            type: 'video'
                        }
                        await saver.saveFile(fileDetails1)
                    }
                })
            }
        }
    } else if (ctx.message.photo[1]) {
        if(ctx.chat.type == 'private') {
            if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2)){
                //const photo = ctx.message.photo[1]
                const array1 = [
                    {
                        file: ctx.message.file_name,
                        userId: ctx.from.id,
                        file_id: ctx.message.photo[1].file_id,
                        mediaId: ctx.message.media_group_id,
                        caption: ctx.message.caption,
                        file_size: ctx.message.photo[1].file_size,
                        uniqueId: ctx.message.photo[1].file_unique_id,
                        type: 'photo'
                    }
                ];
                const element1 = array1.shift();
    
                if(element1.mediaId == undefined){
                    var tag = `✔️ Photo save`;
                    var mediaId = ``;
                    var mediaId2 = ``;
                    if(element1.file_name == undefined){
                        var file_name2 = `${today2(ctx)}`;
                        if(element1.caption == undefined){
                            var caption2 =  ``;
                        }else{
                            var caption2 =  `\n\n${element1.caption}`;
                        }
                    }else{
                        var exstension2 = element1.file_name;
                        var regex2 = /\.[A-Za-z0-9]+$/gm
                        var photext2 = exstension2.replace(regex2, '');
                        
                        var file_name2 = `${photext2}`;
                        if(element1.caption == undefined){
                            var caption2 =  ``;
                        }else{
                            var caption2 =  `\n\n${element1.caption}`;
                        }
                    }
                }else{
                    var tag = `✔️ Group save`;
                    var mediaId = `\n<b>Media ID</b>: ${element1.mediaId}`;
                    var mediaId2 = `\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${element1.mediaId}`;
                    if(element1.file_name == undefined){
                        var file_name2 = `${today2(ctx)}`;
                        if(element1.caption == undefined){
                            var caption2 =  ``;
                        }else{
                            var caption2 =  `\n\n${element1.caption}`;
                        }
                    }else{
                        var exstension2 = element1.file_name;
                        var regex2 = /\.[A-Za-z0-9]+$/gm
                        var photext2 = exstension2.replace(regex2, '');
                        
                        var file_name2 = `${photext2}`;
                        if(element1.caption == undefined){
                            var caption2 =  ``;
                        }else{
                            var caption2 =  `\n\n${element1.caption}`;
                        }
                    }
                }
    
                await saver.checkFile(`${element1.uniqueId}`).then(async res => {
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`File already exists.`,{
                            reply_to_message_id: ctx.message.message_id
                        })
                    }else{
                        await ctx.replyWithPhoto(element1.file_id, {
                            chat_id: ctx.chat.id,
                            caption: `${tag} \n<b>Name file:</b> ${file_name2}\n<b>Size:</b> ${element1.file_size} B\n<b>File ID:</b> ${element1.uniqueId} ${mediaId} \n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${element1.uniqueId} ${mediaId2}`,
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                        await ctx.replyWithPhoto(element1.file_id, {
                            chat_id: process.env.LOG_CHANNEL,
                            caption: `${tag} \n<b>From:</b> ${ctx.from.id}\n<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Name file:</b> ${file_name2}\n<b>Size:</b> ${element1.file_size} B\n<b>File ID:</b> ${element1.uniqueId} ${mediaId} \n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${element1.uniqueId} ${mediaId2} ${caption2}`,
                            parse_mode:'HTML'
                        })
                        const fileDetails1 = {
                            file_name: file_name2,
                            userId: ctx.from.id,
                            file_id: element1.file_id,
                            mediaId: element1.mediaId,
                            caption: element1.caption,
                            file_size: element1.file_size,
                            uniqueId: element1.uniqueId,
                            type: 'photo'
                        }
                        await saver.saveFile(fileDetails1)
                    }
                })
            }
        }
    }
    return next();
})

bot.command('stats',async(ctx)=>{
    await ctx.deleteMessage(ctx.message.message_id)
    const stats1 = await saver.getUser().then(async res=>{
        if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2)){
            await ctx.reply(`📊 Total users: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
    })
    const stats2 = await saver.getMedia().then(async res=>{
        if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2)){
            await ctx.reply(`📊 Total media: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
    })
    const stats3 = await saver.getBan().then(async res=>{
        if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2)){
            await ctx.reply(`📊 Total users violate: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
    })
    const stats4 = await saver.getGroup().then(async res=>{
        if(ctx.from.id == Number(process.env.ADMIN) || ctx.from.id == Number(process.env.ADMIN1) || ctx.from.id == Number(process.env.ADMIN2)){
            await ctx.reply(`📊 Total registered groups: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
    })
})
 
//heroku config
domain = `${process.env.DOMAIN}.herokuapp.com`
bot.launch({
    webhook:{
       domain:domain,
        port:Number(process.env.PORT) 
    }
})
