//saving documents to db and generating link
bot.on('document', async (ctx) => {
    document = ctx.message.document
    //console.log(ctx);
    
    if(ctx.message.media_group_id == undefined){
        if(document.file_name == undefined){
            fileDetails1 = {
                file_name: today2(ctx),
                userId:ctx.from.id,
                file_id: document.file_id,
                caption: ctx.message.caption,
                file_size: document.file_size,
                uniqueId: document.file_unique_id,
                type: 'document'
            }
        }else{
            var exstension = document.file_name;
            var regex = /\.[A-Za-z0-9]+$/gm
            var doctext = exstension.replace(regex, '');
            fileDetails2 = {
                file_name: doctext,
                userId:ctx.from.id,
                file_id: document.file_id,
                caption: ctx.message.caption,
                file_size: document.file_size,
                uniqueId: document.file_unique_id,
                type: 'document'
            }
        }
    }else{
        if(document.file_name == undefined){
            fileDetails3 = {
                file_name: today2(ctx),
                userId:ctx.from.id,
                file_id: document.file_id,
                mediaId: ctx.message.media_group_id,
                caption: ctx.message.caption,
                file_size: document.file_size,
                uniqueId: document.file_unique_id,
                type: 'document'
            }
        }else{
            var exstension2 = document.file_name;
            var regex2 = /\.[A-Za-z0-9]+$/gm
            var doctext2 = exstension2.replace(regex2, '');
            fileDetails4 = {
                file_name: doctext2,
                userId:ctx.from.id,
                file_id: document.file_id,
                mediaId: ctx.message.media_group_id,
                caption: ctx.message.caption,
                file_size: document.file_size,
                uniqueId: document.file_unique_id,
                type: 'document'
            }
        }
    }
  
    if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
        if(ctx.message.media_group_id == undefined){
            if(document.file_name == undefined){
                saver.saveFile(fileDetails1)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Document disimpan \n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(ctx.message.caption == undefined)
                    return ctx.replyWithDocument(document.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithDocument(document.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                        parse_mode:'HTML'
                    })
            }else{
                saver.saveFile(fileDetails2)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Document disimpan \n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(ctx.message.caption == undefined)
                    return ctx.replyWithDocument(document.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithDocument(document.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                        parse_mode:'HTML'
                    })
            }
        }else{
            if(document.file_name == undefined){
                saver.saveFile(fileDetails3)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(ctx.message.caption == undefined)                   
                    return ctx.replyWithDocument(document.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithDocument(document.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                        parse_mode:'HTML'
                    })
            }else{
                saver.saveFile(fileDetails4)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_unique_id}\n<b>ID grup:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(ctx.message.caption == undefined)                   
                    return ctx.replyWithDocument(document.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithDocument(document.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                        parse_mode:'HTML'
                    })
            }
        }
    }else{
        //try{
            var botStatus3 = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member3 = await bot.telegram.getChatMember(channelId, ctx.from.id)
            //console.log(member3);
            if(member3.status == 'restricted' || member3.status == 'left' || member3.status == 'kicked'){
                if(ctx.chat.type == 'private') {
                    const profile6 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
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
                }
            }else{
                await saver.checkBan(`${ctx.from.id}`).then((res) => {
                //console.log(res);
                    if(res == true) {
                        if(ctx.chat.type == 'private') {
                            ctx.reply(`${messagebanned(ctx)}`)
                        }
                    }else{
                        document = ctx.message.document
                        //console.log(ctx);
                        
                        if(ctx.message.media_group_id == undefined){
                            if(document.file_name == undefined){
                                fileDetails1 = {
                                    file_name: today2(ctx),
                                    userId:ctx.from.id,
                                    file_id: document.file_id,
                                    caption: ctx.message.caption,
                                    file_size: document.file_size,
                                    uniqueId: document.file_unique_id,
                                    type: 'document'
                                }
                            }else{
                                var exstension = document.file_name;
                                var regex = /\.[A-Za-z0-9]+$/gm
                                var doctext = exstension.replace(regex, '');
                                fileDetails2 = {
                                    file_name: doctext,
                                    userId:ctx.from.id,
                                    file_id: document.file_id,
                                    caption: ctx.message.caption,
                                    file_size: document.file_size,
                                    uniqueId: document.file_unique_id,
                                    type: 'document'
                                }
                            }
                        }else{
                            if(document.file_name == undefined){
                                fileDetails3 = {
                                    file_name: today2(ctx),
                                    userId:ctx.from.id,
                                    file_id: document.file_id,
                                    mediaId: ctx.message.media_group_id,
                                    caption: ctx.message.caption,
                                    file_size: document.file_size,
                                    uniqueId: document.file_unique_id,
                                    type: 'document'
                                }
                            }else{
                                var exstension2 = document.file_name;
                                var regex2 = /\.[A-Za-z0-9]+$/gm
                                var doctext2 = exstension2.replace(regex2, '');
                                fileDetails4 = {
                                    file_name: doctext2,
                                    userId:ctx.from.id,
                                    file_id: document.file_id,
                                    mediaId: ctx.message.media_group_id,
                                    caption: ctx.message.caption,
                                    file_size: document.file_size,
                                    uniqueId: document.file_unique_id,
                                    type: 'document'
                                }
                            }
                        }
                        if(ctx.message.media_group_id == undefined){
                            if(document.file_name == undefined){
                                saver.saveFile(fileDetails1)
                                if(ctx.chat.type == 'private') {
                                    ctx.reply(`✔️ Document disimpan \n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                }
                                if(ctx.message.caption == undefined)
                                    return ctx.replyWithDocument(document.file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                                        parse_mode:'HTML'
                                    })
                                    ctx.replyWithDocument(document.file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `${ctx.message.caption}\n\n✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                                        parse_mode:'HTML'
                                    })
                            }else{
                                saver.saveFile(fileDetails2)
                                if(ctx.chat.type == 'private') {
                                    ctx.reply(`✔️ Document disimpan \n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                }
                                if(ctx.message.caption == undefined)
                                    return ctx.replyWithDocument(document.file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                                        parse_mode:'HTML'
                                    })
                                    ctx.replyWithDocument(document.file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `${ctx.message.caption}\n\n✔️ Document disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}`,
                                        parse_mode:'HTML'
                                    })
                            }
                        }else{
                            if(document.file_name == undefined){
                                saver.saveFile(fileDetails3)
                                if(ctx.chat.type == 'private') {
                                    ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                }
                                if(ctx.message.caption == undefined)                   
                                    return ctx.replyWithDocument(document.file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                                        parse_mode:'HTML'
                                    })
                                    ctx.replyWithDocument(document.file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                                        parse_mode:'HTML'
                                    })
                            }else{
                                saver.saveFile(fileDetails4)
                                if(ctx.chat.type == 'private') {
                                    ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_unique_id}\n<b>ID grup:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                }
                                if(ctx.message.caption == undefined)                   
                                    return ctx.replyWithDocument(document.file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                                        parse_mode:'HTML'
                                    })
                                    ctx.replyWithDocument(document.file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${document.file_size} B\n<b>ID file:</b> ${document.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${document.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                                        parse_mode:'HTML'
                                    })
                            }
                        }
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
bot.on('video', async (ctx) => {
    video = ctx.message.video
    //console.log(ctx);
    
    if(ctx.message.media_group_id == undefined){
        if(video.file_name == undefined){
            fileDetails1 = {
                file_name: today2(ctx),
                userId:ctx.from.id,
                file_id: video.file_id,
                caption: ctx.message.caption,
                file_size: video.file_size,
                uniqueId: video.file_unique_id,
                type: 'video'
            }
        }else{
            var exstension = video.file_name;
            var regex = /\.[A-Za-z0-9]+$/gm
            var vidext = exstension.replace(regex, '');
            fileDetails2 = {
                file_name: vidext,
                userId:ctx.from.id,
                file_id: video.file_id,
                caption: ctx.message.caption,
                file_size: video.file_size,
                uniqueId: video.file_unique_id,
                type: 'video'
            }
        }
    }else{
        if(video.file_name == undefined){
            fileDetails3 = {
                file_name: today2(ctx),
                userId:ctx.from.id,
                file_id: video.file_id,
                mediaId: ctx.message.media_group_id,
                caption: ctx.message.caption,
                file_size: video.file_size,
                uniqueId: video.file_unique_id,
                type: 'video'
            }
        }else{
            var exstension2 = video.file_name;
            var regex2 = /\.[A-Za-z0-9]+$/gm
            var vidext2 = exstension2.replace(regex2, '');
            fileDetails4 = {
                file_name: vidext2,
                userId:ctx.from.id,
                file_id: video.file_id,
                mediaId: ctx.message.media_group_id,
                caption: ctx.message.caption,
                file_size: video.file_size,
                uniqueId: video.file_unique_id,
                type: 'video'
            }
        }
    }
  
    if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
        if(ctx.message.media_group_id == undefined){
            if(video.file_name == undefined){
                saver.saveFile(fileDetails1)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Video disimpan \n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(ctx.message.caption == undefined)
                    return ctx.replyWithVideo(video.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithVideo(video.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                        parse_mode:'HTML'
                    })
            }else{
                saver.saveFile(fileDetails2)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Video disimpan \n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(ctx.message.caption == undefined)
                    return ctx.replyWithVideo(video.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithVideo(video.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                        parse_mode:'HTML'
                    })
            }
        }else{
            if(video.file_name == undefined){
                saver.saveFile(fileDetails3)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(ctx.message.caption == undefined)                   
                    return ctx.replyWithVideo(video.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithVideo(video.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                        parse_mode:'HTML'
                    })
            }else{
                saver.saveFile(fileDetails4)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_unique_id}\n<b>ID grup:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(ctx.message.caption == undefined)                   
                    return ctx.replyWithVideo(video.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithVideo(video.file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                        parse_mode:'HTML'
                    })
            }
        }
    }else{
        //try{
            var botStatus3 = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member3 = await bot.telegram.getChatMember(channelId, ctx.from.id)
            //console.log(member3);
            if(member3.status == 'restricted' || member3.status == 'left' || member3.status == 'kicked'){
                if(ctx.chat.type == 'private') {
                    const profile6 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
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
                }
            }else{
                await saver.checkBan(`${ctx.from.id}`).then((res) => {
                //console.log(res);
                    if(res == true) {
                        if(ctx.chat.type == 'private') {
                            ctx.reply(`${messagebanned(ctx)}`)
                        }
                    }else{
                        video = ctx.message.video
                        //console.log(ctx);
                        
                        if(ctx.message.media_group_id == undefined){
                            if(video.file_name == undefined){
                                fileDetails1 = {
                                    file_name: today2(ctx),
                                    userId:ctx.from.id,
                                    file_id: video.file_id,
                                    caption: ctx.message.caption,
                                    file_size: video.file_size,
                                    uniqueId: video.file_unique_id,
                                    type: 'video'
                                }
                            }else{
                                var exstension = video.file_name;
                                var regex = /\.[A-Za-z0-9]+$/gm
                                var vidext = exstension.replace(regex, '');
                                fileDetails2 = {
                                    file_name: vidext,
                                    userId:ctx.from.id,
                                    file_id: video.file_id,
                                    caption: ctx.message.caption,
                                    file_size: video.file_size,
                                    uniqueId: video.file_unique_id,
                                    type: 'video'
                                }
                            }
                        }else{
                            if(video.file_name == undefined){
                                fileDetails3 = {
                                    file_name: today2(ctx),
                                    userId:ctx.from.id,
                                    file_id: video.file_id,
                                    mediaId: ctx.message.media_group_id,
                                    caption: ctx.message.caption,
                                    file_size: video.file_size,
                                    uniqueId: video.file_unique_id,
                                    type: 'video'
                                }
                            }else{
                                var exstension2 = video.file_name;
                                var regex2 = /\.[A-Za-z0-9]+$/gm
                                var vidext2 = exstension2.replace(regex2, '');
                                fileDetails4 = {
                                    file_name: vidext2,
                                    userId:ctx.from.id,
                                    file_id: video.file_id,
                                    mediaId: ctx.message.media_group_id,
                                    caption: ctx.message.caption,
                                    file_size: video.file_size,
                                    uniqueId: video.file_unique_id,
                                    type: 'video'
                                }
                            }
                        }
                        if(ctx.message.media_group_id == undefined){
                            if(video.file_name == undefined){
                                saver.saveFile(fileDetails1)
                                if(ctx.chat.type == 'private') {
                                    ctx.reply(`✔️ Video disimpan \n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                }
                                if(ctx.message.caption == undefined)
                                    return ctx.replyWithVideo(video.file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                                        parse_mode:'HTML'
                                    })
                                    ctx.replyWithVideo(video.file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `${ctx.message.caption}\n\n✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                                        parse_mode:'HTML'
                                    })
                            }else{
                                saver.saveFile(fileDetails2)
                                if(ctx.chat.type == 'private') {
                                    ctx.reply(`✔️ Video disimpan \n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                }
                                if(ctx.message.caption == undefined)
                                    return ctx.replyWithVideo(video.file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                                        parse_mode:'HTML'
                                    })
                                    ctx.replyWithVideo(video.file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `${ctx.message.caption}\n\n✔️ Video disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`,
                                        parse_mode:'HTML'
                                    })
                            }
                        }else{
                            if(video.file_name == undefined){
                                saver.saveFile(fileDetails3)
                                if(ctx.chat.type == 'private') {
                                    ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                }
                                if(ctx.message.caption == undefined)                   
                                    return ctx.replyWithVideo(video.file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                                        parse_mode:'HTML'
                                    })
                                    ctx.replyWithVideo(video.file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                                        parse_mode:'HTML'
                                    })
                            }else{
                                saver.saveFile(fileDetails4)
                                if(ctx.chat.type == 'private') {
                                    ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_unique_id}\n<b>ID grup:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                }
                                if(ctx.message.caption == undefined)                   
                                    return ctx.replyWithVideo(video.file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                                        parse_mode:'HTML'
                                    })
                                    ctx.replyWithVideo(video.file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${video.file_size} B\n<b>ID file:</b> ${video.file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                                        parse_mode:'HTML'
                                    })
                            }
                        }
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
bot.on('photo', async (ctx) => {
    photo = ctx.message.photo
    //console.log(ctx);
    
    if(ctx.message.media_group_id == undefined){
        if(photo[1].file_name == undefined){
            fileDetails1 = {
                file_name: today2(ctx),
                userId:ctx.from.id,
                file_id: photo[1].file_id,
                caption: ctx.message.caption,
                file_size: photo[1].file_size,
                uniqueId: photo[1].file_unique_id,
                type: 'photo'
            }
        }else{
            var exstension = photo[1].file_name;
            var regex = /\.[A-Za-z0-9]+$/gm
            var photext = exstension.replace(regex, '');
            fileDetails2 = {
                file_name: photext,
                userId:ctx.from.id,
                file_id: photo[1].file_id,
                caption: ctx.message.caption,
                file_size: photo[1].file_size,
                uniqueId: photo[1].file_unique_id,
                type: 'photo'
            }
        }
    }else{
        if(photo[1].file_name == undefined){
            fileDetails3 = {
                file_name: today2(ctx),
                userId:ctx.from.id,
                file_id: photo[1].file_id,
                mediaId: ctx.message.media_group_id,
                caption: ctx.message.caption,
                file_size: photo[1].file_size,
                uniqueId: photo[1].file_unique_id,
                type: 'photo'
            }
        }else{
            var exstension2 = photo[1].file_name;
            var regex2 = /\.[A-Za-z0-9]+$/gm
            var photext2 = exstension2.replace(regex2, '');
            fileDetails4 = {
                file_name: photext2,
                userId:ctx.from.id,
                file_id: photo[1].file_id,
                mediaId: ctx.message.media_group_id,
                caption: ctx.message.caption,
                file_size: photo[1].file_size,
                uniqueId: photo[1].file_unique_id,
                type: 'photo'
            }
        }
    }
  
    if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2){
        if(ctx.message.media_group_id == undefined){
            if(photo[1].file_name == undefined){
                saver.saveFile(fileDetails1)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Photo disimpan \n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(ctx.message.caption == undefined)
                    return ctx.replyWithPhoto(photo[1].file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithPhoto(photo[1].file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                        parse_mode:'HTML'
                    })
            }else{
                saver.saveFile(fileDetails2)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Photo disimpan \n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(ctx.message.caption == undefined)
                    return ctx.replyWithPhoto(photo[1].file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithPhoto(photo[1].file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                        parse_mode:'HTML'
                    })
            }
        }else{
            if(photo[1].file_name == undefined){
                saver.saveFile(fileDetails3)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(ctx.message.caption == undefined)                   
                    return ctx.replyWithPhoto(photo[1].file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithPhoto(photo[1].file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                        parse_mode:'HTML'
                    })
            }else{
                saver.saveFile(fileDetails4)
                if(ctx.chat.type == 'private') {
                    ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_unique_id}\n<b>ID grup:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
                }
                if(ctx.message.caption == undefined)                   
                    return ctx.replyWithPhoto(photo[1].file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                        parse_mode:'HTML'
                    })
                    ctx.replyWithPhoto(photo[1].file_id, {
                        chat_id: process.env.LOG_CHANNEL,
                        caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                        parse_mode:'HTML'
                    })
            }
        }
    }else{
        //try{
            var botStatus3 = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member3 = await bot.telegram.getChatMember(channelId, ctx.from.id)
            //console.log(member3);
            if(member3.status == 'restricted' || member3.status == 'left' || member3.status == 'kicked'){
                if(ctx.chat.type == 'private') {
                    const profile6 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
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
                }
            }else{
                await saver.checkBan(`${ctx.from.id}`).then((res) => {
                //console.log(res);
                    if(res == true) {
                        if(ctx.chat.type == 'private') {
                            ctx.reply(`${messagebanned(ctx)}`)
                        }
                    }else{
                        photo = ctx.message.photo
                            //console.log(ctx);
                            
                            if(ctx.message.media_group_id == undefined){
                                if(photo[1].file_name == undefined){
                                    fileDetails1 = {
                                        file_name: today2(ctx),
                                        userId:ctx.from.id,
                                        file_id: photo[1].file_id,
                                        caption: ctx.message.caption,
                                        file_size: photo[1].file_size,
                                        uniqueId: photo[1].file_unique_id,
                                        type: 'photo'
                                    }
                                }else{
                                    var exstension = photo[1].file_name;
                                    var regex = /\.[A-Za-z0-9]+$/gm
                                    var photext = exstension.replace(regex, '');
                                    fileDetails2 = {
                                        file_name: photext,
                                        userId:ctx.from.id,
                                        file_id: photo[1].file_id,
                                        caption: ctx.message.caption,
                                        file_size: photo[1].file_size,
                                        uniqueId: photo[1].file_unique_id,
                                        type: 'photo'
                                    }
                                }
                            }else{
                                if(photo[1].file_name == undefined){
                                    fileDetails3 = {
                                        file_name: today2(ctx),
                                        userId:ctx.from.id,
                                        file_id: photo[1].file_id,
                                        mediaId: ctx.message.media_group_id,
                                        caption: ctx.message.caption,
                                        file_size: photo[1].file_size,
                                        uniqueId: photo[1].file_unique_id,
                                        type: 'photo'
                                    }
                                }else{
                                    var exstension2 = photo[1].file_name;
                                    var regex2 = /\.[A-Za-z0-9]+$/gm
                                    var photext2 = exstension2.replace(regex2, '');
                                    fileDetails4 = {
                                        file_name: photext2,
                                        userId:ctx.from.id,
                                        file_id: photo[1].file_id,
                                        mediaId: ctx.message.media_group_id,
                                        caption: ctx.message.caption,
                                        file_size: photo[1].file_size,
                                        uniqueId: photo[1].file_unique_id,
                                        type: 'photo'
                                    }
                                }
                            }
                        if(ctx.message.media_group_id == undefined){
                            if(photo[1].file_name == undefined){
                                saver.saveFile(fileDetails1)
                                if(ctx.chat.type == 'private') {
                                    ctx.reply(`✔️ Photo disimpan \n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                }
                                if(ctx.message.caption == undefined)
                                    return ctx.replyWithPhoto(photo[1].file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                                        parse_mode:'HTML'
                                    })
                                    ctx.replyWithPhoto(photo[1].file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `${ctx.message.caption}\n\n✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails1.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                                        parse_mode:'HTML'
                                    })
                            }else{
                                saver.saveFile(fileDetails2)
                                if(ctx.chat.type == 'private') {
                                    ctx.reply(`✔️ Photo disimpan \n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_unique_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                }
                                if(ctx.message.caption == undefined)
                                    return ctx.replyWithPhoto(photo[1].file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                                        parse_mode:'HTML'
                                    })
                                    ctx.replyWithPhoto(photo[1].file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `${ctx.message.caption}\n\n✔️ Photo disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails2.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}`,
                                        parse_mode:'HTML'
                                    })
                            }
                        }else{
                            if(photo[1].file_name == undefined){
                                saver.saveFile(fileDetails3)
                                if(ctx.chat.type == 'private') {
                                    ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_unique_id}\n<b>ID group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                }
                                if(ctx.message.caption == undefined)                   
                                    return ctx.replyWithPhoto(photo[1].file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                                        parse_mode:'HTML'
                                    })
                                    ctx.replyWithPhoto(photo[1].file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails3.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                                        parse_mode:'HTML'
                                    })
                            }else{
                                saver.saveFile(fileDetails4)
                                if(ctx.chat.type == 'private') {
                                    ctx.reply(`✔️ Grup disimpan \n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_unique_id}\n<b>ID grup:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                }
                                if(ctx.message.caption == undefined)                   
                                    return ctx.replyWithPhoto(photo[1].file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                                        parse_mode:'HTML'
                                    })
                                    ctx.replyWithPhoto(photo[1].file_id, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        caption: `${ctx.message.caption}\n\n✔️ Grup disimpan \n<b>Dari:</b> ${ctx.from.id}\n<b>Nama:</b> <a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n\n<b>Nama file:</b> ${fileDetails4.file_name}\n<b>Size:</b> ${photo[1].file_size} B\n<b>ID file:</b> ${photo[1].file_id}\n<b>ID Group:</b> ${ctx.message.media_group_id}\n\nhttps://t.me/${process.env.BOTUSERNAME}?start=${photo[1].file_unique_id}\nhttps://t.me/${process.env.BOTUSERNAME}?start=grp_${ctx.message.media_group_id}`,
                                        parse_mode:'HTML'
                                    })
                            }
                        }
                    }
                })
            }
        //}
        //catch(error){
        //    ctx.reply(`${messagebotnoaddgroup(ctx)}`)
        //}
    }

})
