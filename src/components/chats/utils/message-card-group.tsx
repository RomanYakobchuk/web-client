import {MouseEvent} from "react";
import {Box} from "@mui/material";
import {AnimatePresence, motion} from 'framer-motion';

import {IMessage, ProfileProps} from "@/interfaces/common";
import MessagesCard from "./messages-card";
import {For} from "million/react";

interface IProps {
    receiver: ProfileProps,
    theSameUser: boolean,
    group: IMessage[]
}

const MessageCardGroup = ({receiver, theSameUser, group}: IProps) => {
    const onContextMenu = (event: MouseEvent) => {
        event.preventDefault();
    };

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                gap: '8px',
                alignItems: 'end',
                height: 'fit-content',
                justifyContent: theSameUser ? 'end' : 'start',
            }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: !theSameUser ? 'start' : 'end',
                flexDirection: !theSameUser ? 'row' : 'row-reverse',
                order: !theSameUser ? 1 : 2,
                // gap: 1,
                width: '100%'
            }}
                 onContextMenu={onContextMenu}
            >
                {
                    !theSameUser && (
                        <Box sx={{
                            width: {xs: '32px', sm: '38px', lg: '42px'},
                            height: {xs: '32px', sm: '38px', lg: '42px'},
                            overflow: 'hidden',
                        }}>
                            <img
                                src={receiver?.avatar}
                                alt={group[0]?._id}
                                style={{
                                    overflow: 'hidden',
                                    width: '100%',
                                    height: '100%',
                                    minWidth: '32px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />
                        </Box>
                    )
                }
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: {xs: 'calc(100% - 32px)', sm: 'calc(100% - 38px)', lg: 'calc(100% - 42px)'},
                    alignItems: !theSameUser ? 'start' : 'end',
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        maxWidth: '90%',
                        position: 'relative',
                        alignItems: theSameUser ? 'end' : 'start'
                    }}>
                        {
                            !theSameUser && (
                                <Box sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    display: 'flex',
                                    ml: 1,
                                    // px: 1,
                                    // bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                                    backdropFilter: 'blur(4px)',
                                    borderRadius: '10px',
                                    justifyContent: theSameUser ? 'end' : 'start',
                                    color: 'common.white'
                                }}>
                                    {
                                        receiver?.name
                                    }
                                </Box>
                            )
                        }
                        {/*<For each={group}>*/}
                        {
                            group?.length > 0 && group?.map((item: IMessage, index: number) => (
                                    <MessagesCard
                                        index={index}
                                        lengthGroup={group?.length}
                                        item={item} key={index}
                                        theSameUser={theSameUser}
                                    />
                                )
                            )
                        }
                        {/*</For>*/}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
export default MessageCardGroup;
