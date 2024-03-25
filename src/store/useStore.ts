import {create} from "zustand";
import {IMessage} from "@/interfaces/common";

export interface IStore {
    stateMessage: {
        typeState: "edit" | "reply" | "new",
        message: IMessage & { newText?: string | null } | null,
    },
    // stateMessages: [{
    //     typeState: "edit" | "reply" | "new",
    //     message: IMessage & { newText?: string | null } | null,
    //     conversationId: string | null,
    // }],
    setStateMessage: (value: IStore['stateMessage']) => void,
    deleteStateMessage: () => void,
    chatMessages: IMessage[],
    handleUpdateMessages: (messages: IMessage[]) => void,
    chatEditMode: boolean,
    toggleChatEditMode: (value: boolean) => void

}

const useStore = create<IStore>()((set) => ({
    stateMessage: {
        typeState: 'new',
        message: null
    },
    setStateMessage: (value) =>
        set(() => ({
            stateMessage: value
        })),
    deleteStateMessage: () => {
        set(() => ({
            stateMessage: {
                typeState: 'new',
                message: null
            }
        }))
    },
    chatMessages: [],
    handleUpdateMessages: (messages) => {
        return set(() => ({
            chatMessages: messages
        }))
    },
    chatEditMode: false,
    toggleChatEditMode: (value) => set(() => ({
        chatEditMode: value
    }))
}))
interface TypingState {
    typingStatus: Record<string, Record<string, boolean>>;
    setTypingStatus: (chatId: string, userId: string, typing: boolean) => void;
    removeTypingStatus: (chatId: string, userId: string) => void;
}
const useUserTypingStore = create<TypingState>((set) => ({
    typingStatus: {},
    setTypingStatus: (chatId, userId, typing) => set((state) => ({
        typingStatus: {
            ...state.typingStatus,
            [chatId]: {
                ...(state.typingStatus[chatId] || {}),
                [userId]: typing
            }
        }
    })),
    removeTypingStatus: (chatId, userId) => set((state) => {
        const typingStatus = { ...state.typingStatus };
        if (typingStatus[chatId]) {
            delete typingStatus[chatId][userId];
        }
        return { typingStatus };
    })
}))
export {
    useStore,
    useUserTypingStore
}