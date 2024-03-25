import {Box, IconButton} from "@mui/material";
import {Clear} from "@mui/icons-material";
import CryptoJS from "crypto-js";

import {IConvMembers, IUser, ProfileProps, IConversation} from "@/interfaces/common";
import {secretKeyCryptMessage} from "@/config/const";
import {TruncateSingleText, formatText} from "@/utils";
import parse from "html-react-parser";
import {useStore} from "@/store";
import {useContext} from "react";
import {ColorModeContext} from "@/contexts";

type TProps = {
    conversation: IConversation
}
export const ReplyContainer = ({conversation}: TProps) => {
    const {mode} = useContext(ColorModeContext);

    const {stateMessage, deleteStateMessage} = useStore(state => state);

    // const encryptedText = stateMessage && stateMessage?.text?.length > 5 ? JSON?.parse(CryptoJS.AES.decrypt(stateMessage?.text, secretKeyCryptMessage)?.toString(CryptoJS.enc.Utf8)) : "";

    const repliedUser = conversation?.members?.find((member) => {
        return member?.userId === stateMessage?.message?.sender;
    }) as IConvMembers & { user: ProfileProps };
    const repliedUserName = repliedUser?.user?.name;

    return (
        <>
            {
                stateMessage && conversation?._id === stateMessage?.message?.conversationId && (
                    <Box sx={{
                        width: '100%',
                        bgcolor: mode === 'dark' ? '#2f2d3d' : '#d1efed',
                        p: 0.5,
                        height: '60px',
                        borderRadius: '14px',
                        mb: 0.5
                    }}>
                        <Box sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                        }}>
                            <Box sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                pl: '5px',
                            }}>
                                <Box sx={{
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: 'info.main'
                                }}>
                                    {
                                        repliedUserName
                                    }
                                </Box>
                                <TruncateSingleText
                                    styles={{
                                        width: {xs: '200px', sm: '300px', lg: '400px', xl: '600px'},
                                        fontSize: '14px',
                                        color: 'common.white',
                                        "& a": {
                                            color: 'common.white',
                                        }
                                    }}
                                    width={'200px'}
                                    str={parse(formatText({text: stateMessage?.message?.text}))}
                                />
                            </Box>
                            <IconButton onClick={deleteStateMessage}>
                                <Clear/>
                            </IconButton>
                        </Box>
                    </Box>
                )
            }
        </>
    );
};

