import dayjs from "dayjs";

import {IConversation, IMessage, ProfileProps} from "@/interfaces/common";
import MessageCardGroup from "../utils/message-card-group";
import {For} from "million/react";
import {useUserInfo} from "@/hook";

interface IProps {
    items: IMessage[],
    conversation?: IConversation,
}

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

const MessagesBoxItems = ({items, conversation}: IProps) => {
    const {user} = useUserInfo();

    const groups = Object.values(groupItems(items.sort((a: IMessage, b: IMessage) => a.createdAt > b.createdAt ? 1 : -1)))

    return (
        <>
            {/*<For each={groups || []}>*/}
            {
                groups?.length > 0 && groups?.map((group: IMessage[], index: number) => {
                        const receiver = conversation?.members?.find((member) => {
                            // const memberUser = member?.user as ProfileProps;
                            return member?.userId === group[0]?.sender as string
                        });
                        const theSameUser = user?._id === receiver?.userId;
                        return (
                            <MessageCardGroup
                                key={index}
                                receiver={receiver?.user as ProfileProps}
                                theSameUser={theSameUser}
                                group={group}
                            />
                        )
                    }
                )
            }
            {/*</For>*/}
        </>
    );
};
export default MessagesBoxItems
