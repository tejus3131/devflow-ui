import { Response } from '@/lib/types'
import channel from '@/lib/channel'

export async function manageUserState(username: string): Response<() => void> {
    try {
        channel.chats.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.chats.track({ online_at: new Date().toISOString(), username })
            }
        })

        return {
            status: 200,
            success: true,
            message: 'User state management started',
            data: () => {
                channel.chats.unsubscribe()
            }
        }
    } catch (error: any) {
        return {
            status: 500,
            success: false,
            message: error.message || 'Failed to manage user state',
            data: null
        }
    }
}

export function getOnlineUsersLive(onChange: null | ((users: string[]) => void)): void {
    channel.chats.on('presence', { event: 'sync' }, () => {
        const users: string[] = []
        const data = channel.chats.presenceState()

        Object.values(data).forEach((item: any) => {
            users.push(item[0].username)
        })

        if (onChange) {
            onChange(Array.from(new Set(users)))
        }
    })
}

export async function broadcastEvent(event: string, payload: any): Promise<void> {
    await channel.chats
        .send({
            type: 'broadcast',
            event: event,
            payload: payload,
        })
}

export function listenToEvent(event: string, callback: (payload: any) => void): void {
    channel.chats.on("broadcast", { event }, (payload) => {
        callback(payload)
    })
}