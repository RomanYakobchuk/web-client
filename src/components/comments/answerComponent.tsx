import {IComment} from "../../interfaces/common";
import {Box, IconButton} from "@mui/material";
import {Clear, ReplyRounded} from "@mui/icons-material";
import React, {Dispatch, SetStateAction} from "react";
import {useTranslate} from "@refinedev/core";

type TProps = {
    parent: IComment,
    setIsAnswer: Dispatch<SetStateAction<boolean>>,
    setParent: Dispatch<SetStateAction<IComment>>
}
const AnswerComponent = ({parent, setParent, setIsAnswer}: TProps) => {

    const translate = useTranslate();

    const handleClearAnswer = () => {
        setIsAnswer(false)
        setParent({} as IComment)
    }
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'start'
        }}>
            <Box sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'start'
            }}>
                <Box >
                    <ReplyRounded color={'info'}/>
                </Box>
                <Box sx={{
                    height: '50px',
                    bgcolor: 'silver',
                    borderRadius: '10px',
                    width: '2px'
                }}/>
                <Box sx={{
                    display: 'flex',
                    gap: 1
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}>
                        <Box sx={{
                            color: 'info.main',
                            fontWeight: 500
                        }}>
                            {translate('buttons.reply') + ' '} {parent?.createdBy?.name}
                        </Box>
                        <Box sx={{
                            fontSize: '14px',
                            whiteSpace: 'break-spaces'
                        }} color={"secondary"}>
                            {
                                parent.text?.split('\n')?.length > 2 ? parent.text?.split(`\n`)?.slice(0, 2)?.join(`\n`) + '...' : parent?.text
                            }
                        </Box>
                    </Box>
                </Box>
            </Box>
            <IconButton onClick={handleClearAnswer}>
                <Clear/>
            </IconButton>
        </Box>
    );
};
export default AnswerComponent
