import supabase from '@/lib/db';
import channel from '@/lib/channel';
import { Attachment, AttachmentType, Message, Response } from '../types';
import { RealtimeChannel } from '@supabase/supabase-js';

async function getAttachmentById(attachmentId: string): Response<Attachment> {
    const { data, error } = await supabase.clientTable
        .from('attachments')
        .select('*')
        .eq('id', attachmentId)
        .single();
    if (error) {
        return {
            status: 500,
            success: false,
            message: error.message || 'Failed to load attachment',
            data: null
        };
    }
    const attachment: Attachment = {
        id: data.id,
        url: data.url,
        name: data.name,
        size: data.size,
        type: mapAttachmentType(data.type)
    };
    return {
        status: 200,
        success: true,
        message: 'Attachment loaded successfully',
        data: attachment
    };
}

export async function loadChats(connectionId: string, page: number, pageSize: number, username: string): Response<Message[]> {

    const { data, error } = await supabase.clientTable
        .from('chats')
        .select('*')
        .eq('connection_id', connectionId)
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
        return {
            status: 500,
            success: false,
            message: error.message || 'Failed to load chats',
            data: null
        };
    }

    const attachmentsPromises = data.map(async (message) => {
        const attachments: Attachment[] = [];
        const attachmentPromises = message.attachments.map(async (attachmentId: string) => {
            const attachmentResponse = await getAttachmentById(attachmentId);
            if (!attachmentResponse.success) {
                console.error('Failed to load attachment:', attachmentResponse.message);
                return null;
            }
            const attachment = attachmentResponse.data!;
            attachments.push({
                id: attachment.id,
                url: attachment.url,
                name: attachment.name,
                size: attachment.size,
                type: mapAttachmentType(attachment.type)
            });
        });
        return {
            id: message.id,
            content: message.content,
            sender: message.sender === username ? 'me' : 'other',
            seen: message.seen,
            attachments: attachments,
            created_at: message.created_at,
            updated_at: message.updated_at
        } as Message;
    });

    const messagesWithAttachments: Message[] = await Promise.all(attachmentsPromises);

    return {
        status: 200,
        success: true,
        message: 'Chats loaded successfully',
        data: messagesWithAttachments
    };
}

export async function sendChat(connectionId: string, content: string, sender: string, hasAttachment: boolean) {
    const { data, error } = await supabase.clientTable
        .from('chats')
        .insert([{
            connection_id: connectionId,
            content,
            sender,
            hasAttachment,
            seen: false
        }]);

    if (error) {
        throw new Error(`Error sending chat: ${error.message}`);
    }

    return data;
}

export async function deleteChat(chatId: string): Response<void> {
    const { data, error } = await supabase.clientTable
        .from('chats')
        .delete()
        .eq('id', chatId);

    if (error) {
        return {
            status: 500,
            success: false,
            message: error.message || 'Failed to delete chat',
            data: null
        };
    }

    return {
        status: 200,
        success: true,
        message: 'Chat deleted successfully',
        data: null
    };
}

export const listenToChatEvent = (
    conversationId: string,
    onNewMessage: (message: Message) => void,
    onMessageDeleted: (messageId: string) => void,
    username: string
): RealtimeChannel => {
    const conversationChannel = channel.createChannel(`chat:${conversationId}`);
    conversationChannel
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'chats',
            filter: `connection_id=eq.${conversationId}`
        }, async (payload) => {
            const newMessage = payload.new;
            newMessage.sender = newMessage.sender === username ? 'me' : 'other';
            const processedAttachments: Attachment[] = [];
            await Promise.all(newMessage.attachments.map(async (attachmentId: string) => {
                const attachmentResponse = await getAttachmentById(attachmentId);
                if (!attachmentResponse.success) {
                    console.error('Failed to load attachment:', attachmentResponse.message);
                    return;
                }
                processedAttachments.push({
                    id: attachmentResponse.data!.id,
                    url: attachmentResponse.data!.url,
                    name: attachmentResponse.data!.name,
                    size: attachmentResponse.data!.size,
                    type: attachmentResponse.data!.type
                });
            }));
            onNewMessage({
                id: newMessage.id,
                content: newMessage.content,
                sender: newMessage.sender,
                seen: newMessage.seen,
                attachments: processedAttachments,
                created_at: newMessage.created_at,
                updated_at: newMessage.updated_at
            } as Message);
        })
        .on('postgres_changes', {
            event: 'DELETE',
            schema: 'public',
            table: 'chats',
        }, (payload) => {
            onMessageDeleted(payload.old.id);
        })
        .subscribe((status) => {
            console.log('Supabase real-time subscription status:', status);
        });
    return conversationChannel;
}

export function unsubscribeFromChatEvent(conversationChannel: RealtimeChannel) {
    channel.deleteChannel(conversationChannel);
}

export async function markMessageAsSeen(messageId: string) {
    const { data, error } = await supabase.clientTable
        .from('chats')
        .update({ seen: true })
        .eq('id', messageId);

    if (error) {
        throw new Error(`Error marking message as seen: ${error.message}`);
    }

    return data;
}

async function uploadAttachment(file: File): Response<string> {
    const randomId = Math.random().toString(36).substring(2, 15);
    const { error } = await supabase.clientStorage
        .from("attachments")
        .upload(randomId, file, {
            cacheControl: "3600",
            upsert: true,
        });
    if (error) return { status: 400, success: false, message: error.message, data: null };
    return { status: 200, success: true, message: "Public URL fetched successfully", data: randomId };
}

export const getAttachmentUrl = async (attachment_id: string): Response<string> => {
    const { data } = supabase
        .clientStorage
        .from("attachments")
        .getPublicUrl(attachment_id);
    return { status: 200, success: true, message: "Public URL fetched successfully", data: data.publicUrl };
}

function mapAttachmentType(type: string): AttachmentType {
    switch (type) {
        case 'image/png':
        case 'image/jpeg':
        case 'image/gif':
            return 'image';
        case 'application/pdf':
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return 'document';
        case 'text/plain':
        case 'text/csv':
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'video/mp4':
        case 'video/mpeg':
        case 'audio/mpeg':
        case 'audio/wav':
        default:
            return 'file';
    }
}

export async function addNewAttachment(attachmentFile: File): Response<Attachment> {

    const uploadResponse = await uploadAttachment(attachmentFile);
    if (!uploadResponse.success) {
        return {
            status: uploadResponse.status,
            success: uploadResponse.success,
            message: uploadResponse.message,
            data: null
        };
    }

    const urlResponse = await getAttachmentUrl(uploadResponse.data!);
    if (!urlResponse.success) {
        return {
            status: urlResponse.status,
            success: urlResponse.success,
            message: urlResponse.message,
            data: null
        };
    }

    const attachmentType = mapAttachmentType(attachmentFile.type);
    console.log('Attachment type:', attachmentType);

    const attachment: Attachment = {
        id: "",
        url: urlResponse.data!,
        name: attachmentFile.name,
        size: attachmentFile.size,
        type: attachmentType
    };

    const { data, error } = await supabase.clientTable
        .from('attachments')
        .insert([{
            url: attachment.url,
            name: attachment.name,
            size: attachment.size,
            type: attachment.type
        }])
        .select('id');

    if (error) {
        return {
            status: 500,
            success: false,
            message: error.message || 'Failed to add attachment',
            data: null
        };
    }

    attachment.id = data[0].id;

    return {
        status: 200,
        success: true,
        message: 'Attachment added successfully',
        data: attachment
    };
}

export async function addNewMessage(
    connectionId: string,
    content: string,
    username: string,
    attachments: File[],
): Response<Message> {

    const processedAttachments: Attachment[] = [];

    if (attachments.length > 0) {
        const attachmentPromises = attachments.map(file => addNewAttachment(file));
        const attachmentResults = await Promise.all(attachmentPromises);
        const failedAttachments = attachmentResults.filter(result => !result.success);
        if (failedAttachments.length > 0) {
            return {
                status: 500,
                success: false,
                message: 'Failed to add some attachments',
                data: null
            };
        }
        processedAttachments.push(...attachmentResults.map(result => result.data!));
    }

    const { data, error } = await supabase.clientTable
        .from('chats')
        .insert([{
            connection_id: connectionId,
            content,
            sender: username,
            attachments: processedAttachments.map(att => att.id),
        }])
        .select('id');

    if (error) {
        return {
            status: 500,
            success: false,
            message: error.message || 'Failed to add message',
            data: null
        };
    }
    const newMessage: Message = {
        id: data[0].id,
        content,
        sender: "me",
        seen: false,
        attachments: processedAttachments,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    return {
        status: 200,
        success: true,
        message: 'Message added successfully',
        data: newMessage
    };
}