import {IConversation, IMessage} from "@/interfaces/common";
import MessageCardGroup from "../utils/message-card-group";
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";

interface IProps {
    items: IMessage[],
    scrollRef?: any,
    setReplyTo: (item: IMessage) => void,
    conversation: IConversation,
}

// const groupItems = (items: IMessage[]) => {
//     const groups: IMessage[][] = [];
//     let currentGroup: IMessage[] = [];
//
//     for (let i = 0; i < items.length; i++) {
//         const currentItem = items[i];
//         const prevItem = items[i - 1];
//
//         if (!prevItem || !shouldCombineMessages(prevItem, currentItem)) {
//             currentGroup = [currentItem];
//             groups.push(currentGroup);
//         } else {
//             currentGroup.push(currentItem);
//         }
//     }
//
//     return groups;
// };
//
// const shouldCombineMessages = (prevMessage: IMessage, currentMessage: IMessage) => {
//     if (prevMessage?.sender && currentMessage?.sender) {
//         const timeDifferenceMinutes = Math.abs(dayjs(prevMessage.createdAt).diff(dayjs(currentMessage.createdAt), 'minute'));
//         return prevMessage.sender === currentMessage.sender && timeDifferenceMinutes <= 2;
//     }
//     return false;
// };
const groupItems = (items: IMessage[]) => {
    const groups: IMessage[][] = [];
    let currentGroup: IMessage[] = [];

    for (let i = 0; i < items.length; i++) {
        const currentItem = items[i];
        const prevItem = items[i - 1];

        if (!prevItem || !shouldCombineMessages(prevItem, currentItem)) {
            currentGroup = [currentItem];
            groups.push(currentGroup);
        } else {
            currentGroup.push(currentItem);
        }
    }

    return groups;
};

const shouldCombineMessages = (prevMessage: IMessage, currentMessage: IMessage) => {
    if (prevMessage?.sender && currentMessage?.sender) {
        const timeDifferenceMinutes = Math.abs(dayjs(currentMessage.createdAt).diff(dayjs(prevMessage.createdAt), 'minute'));
        return prevMessage.sender === currentMessage.sender && timeDifferenceMinutes < 1;
    }
    return false;
};

const MessagesBoxItems = ({items, scrollRef, setReplyTo, conversation}: IProps) => {
    const [itemsGroups, setItemsGroups] = useState<IMessage[][]>([[]] as IMessage[][]);

    useEffect(() => {
        if (items) {
            const sortedItems = items.sort((a: IMessage, b: IMessage) => a.createdAt > b.createdAt ? 1 : -1);
            const groupedItems = groupItems(sortedItems);
            const mergedGroups = Object.values(groupedItems);

            setItemsGroups(mergedGroups);
        }
    }, [items]);

    return (
        <>
            {
                itemsGroups?.map((group: IMessage[], index: number) =>
                    <MessageCardGroup
                        key={index}
                        conversation={conversation}
                        group={group}
                        setReplyTo={setReplyTo}
                    />
                )
            }
        </>
    );
};
export default MessagesBoxItems
