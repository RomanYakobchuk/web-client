import React, {Dispatch, MouseEvent, SetStateAction, useContext, useEffect, useState} from "react";
import {Box, IconButton} from "@mui/material";
import {useTranslate} from "@refinedev/core";
import {Close} from "@mui/icons-material";
import ReactDOM from "react-dom";

import CommentInput from "@/components/comments/comment-input";
import {INewComment} from "@/components/cards/commentCard";
import {IComment, ProfileProps} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";

type TShowCommentInput = {
    handleCloseIsAnswer: () => void,
    isAnswer: boolean,
    setIsAnswer: Dispatch<SetStateAction<boolean>>,
    setParent: Dispatch<SetStateAction<TShowCommentInput['parent']>>,
    parent: IComment | null,
    currentComment: IComment,
    setNewCurrentComment: Dispatch<SetStateAction<INewComment | null>>,
    setNewComment?: Dispatch<SetStateAction<INewComment | null>>,
}
export const ShowCommentInput = ({
                                     handleCloseIsAnswer,
                                     setIsAnswer,
                                     isAnswer,
                                     setParent,
                                     currentComment,
                                     setNewCurrentComment,
                                     setNewComment,
                                     parent
                                 }: TShowCommentInput) => {
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const [scale, setScale] = useState<number>(0);

    const createdBy = parent?.createdBy as ProfileProps;

    useEffect(() => {
        setScale(isAnswer ? 1 : 0);
    }, [isAnswer]);
    const handleClose = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();
    }

    return ReactDOM.createPortal(
        <Box sx={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            zIndex: 2000,
            inset: 0,
            bgcolor: mode === 'dark' ? 'rgba(100, 100, 100, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            transform: `scale(${scale})`,
            overflow: 'auto',
            transition: 'all 0.3s linear'
        }}
             onClick={() => setIsAnswer(false)}
        >
            <Box sx={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                zIndex: 1200,
                transform: `translate(-50%, -50%)`,
                width: '100%',
                p: 2,
                maxWidth: '550px',
            }}
                 onClick={handleClose}
            >
                <Box>
                    <Box sx={{
                        margin: '10px 0',
                        // p: 1,
                        // borderRadius: '7px',
                        // border: '2px solid cornflowerblue',
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'column',
                        alignItems: 'end',
                        gap: 1
                    }}>
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            gap: 2,
                            p: 1,
                            bgcolor: 'modern.modern_1.main',
                            borderRadius: '15px',
                            border: `2px solid ${mode === 'dark' ? '#d3e930' : 'cornflowerblue'}`
                        }}>
                            {
                                parent?._id && (
                                    <Box>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'baseline',
                                            gap: 1,
                                            fontSize: {xs: '16px', md: '18px'},
                                            fontWeight: 600
                                        }}>
                                            <Box>
                                                {translate('buttons.reply')}:
                                            </Box>
                                            <Box sx={{
                                                color: 'cornflowerblue'
                                            }}>
                                                {createdBy?.name}
                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            fontSize: '14px'
                                        }}>
                                            {parent?.text?.substring(0, 40)}
                                        </Box>
                                    </Box>
                                )
                            }
                            <IconButton
                                sx={{
                                    p: 0,
                                    color: 'common.white'
                                }}
                                onClick={handleCloseIsAnswer}
                            >
                                <Close/>
                            </IconButton>
                        </Box>
                        <CommentInput
                            parent={parent}
                            isAnswer={isAnswer}
                            setIsAnswer={setIsAnswer}
                            setParent={setParent}
                            establishmentId={currentComment?.establishmentId as string}
                            setNewComment={setNewComment || setNewCurrentComment}
                            textButton={translate('buttons.reply')}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>, document.body
    );
};


export default ShowCommentInput;