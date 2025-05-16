import supabase from '@/lib/db';
import { RealtimeChannel } from '@supabase/supabase-js';

const chatsChannel = supabase.clientRealtime.channel('chats')
const chatRecordsChannel = supabase.clientRealtime.channel('chat_records')
const createChannel = (channelName: string): RealtimeChannel => {
    const channel = supabase.clientRealtime.channel(channelName)
    return channel;
}

const deleteChannel = (channel: RealtimeChannel) => {
    supabase.clientRealtime.removeChannel(channel);
}

export default {
    chats: chatsChannel,
    records: chatRecordsChannel,
    createChannel,
    deleteChannel
}