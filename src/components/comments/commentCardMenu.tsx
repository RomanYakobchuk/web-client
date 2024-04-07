import {Box, IconButton, Menu, MenuItem} from "@mui/material";
import {Delete, FlagRounded, MoreVert} from "@mui/icons-material";
import {useNotification, usePermissions, useTranslate} from "@refinedev/core";
import React, {Dispatch, SetStateAction, useState} from "react";

import {useLeaveManagerCommentAs, useManagerEstablishment, useUserInfo} from "@/hook";
import {axiosInstance} from "@/authProvider";
import {IComment} from "@/interfaces/common";
import {ModalShowContent} from "@/components";

type TProps = {
    comment: IComment,
    setComments?: Dispatch<SetStateAction<IComment[]>>,
    isShowDelete?: boolean
}
export const CommentCardMenu = ({comment, setComments, isShowDelete = true}: TProps) => {

    const {user} = useUserInfo();
    const {data: role} = usePermissions();
    const translate = useTranslate();
    const {managerEstablishment} = useManagerEstablishment();
    const {selectedInfo} = useLeaveManagerCommentAs();


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const isCanDelete = comment?.createdBy?._id === selectedInfo?._id || comment?.createdBy?._id === user?._id || role === 'admin' || (role === 'manager' && managerEstablishment?.some((item) => item?._id === comment?.createdBy?._id));
    const isAllowedDelete = isShowDelete && isCanDelete && location?.pathname !== '/profile';

    return (
        <Box>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={openMenu ? 'long-menu' : undefined}
                aria-expanded={openMenu ? 'true' : undefined}
                aria-haspopup="true"
                sx={{
                    mr: '-12px',
                    mt: '-12px'
                }}
                onClick={handleClick}
            >
                <MoreVert/>
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose}
                sx={{
                    "& div.MuiPaper-root": {
                        borderRadius: '16px',
                        bgcolor: 'common.black',
                        color: 'common.white',
                        "& ul.MuiList-root": {
                            px: 2,
                            py: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.25,
                            "& li.MuiMenuItem-root": {
                                gap: 0.5,
                                borderRadius: '20px',
                                py: 1,
                                minHeight: '30px',
                                transition: '200ms linear',
                                "&:hover": {
                                    bgcolor: 'common.white',
                                    color: 'common.black',
                                }
                            }
                        }
                    }
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <MenuItem>
                    <FlagRounded/>
                    {translate('buttons.complain')}
                </MenuItem>
                {
                    isAllowedDelete &&
                    <DeleteButton
                        commentId={comment?._id}
                        setComments={setComments}
                    />
                }
            </Menu>
        </Box>
    );
};

type TDeleteButton = {
    setComments?: Dispatch<SetStateAction<IComment[]>>,
    commentId: string
}
const DeleteButton = ({setComments, commentId}: TDeleteButton) => {
    const translate = useTranslate();
    const {open} = useNotification();
    const {selectedInfo, managerRole} = useLeaveManagerCommentAs();

    const [openWindow, setOpenWindow] = useState<boolean>(false);

    const handleDelete = async () => {
        try {
            const {data} = await axiosInstance.delete(`/comment/delete/${commentId}`, {
                data: {
                    createdBy: selectedInfo?._id,
                    refFieldCreate: managerRole
                }
            });

            open?.({
                type: 'success',
                message: data?.message,
                description: 'Deleting'
            })
            if (setComments) {
                setComments(prevState => (prevState?.filter((value) => value?._id !== commentId)))
            }
        } catch (e: any) {
            open?.({
                type: 'error',
                description: e?.response?.data?.error ?? e?.response?.data?.message,
                message: 'Error'
            })
        } finally {
            setOpenWindow(false);
        }
    };
    return (
        <>
            <MenuItem
                sx={{
                    color: 'red !important'
                }}
                onClick={(event) => {
                    event.preventDefault();
                    setOpenWindow(true)
                }}
            >
                <Delete/>
                {translate("buttons.delete")}
            </MenuItem>
            <ModalShowContent
                isOpen={openWindow}
                setIsOpen={setOpenWindow}
                onClick={handleDelete}
                headerStyle={{
                    margin: '0',
                    marginBottom: 0
                }}
                onSuccessText={translate('text.yes')}
            >
                <Box sx={{
                    p: '0px 16px 16px 16px',
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '22px',
                    width: '100%',
                    fontWeight: 600,
                    color: 'common.white'
                }}>
                    {translate(`buttons.delete`)}?
                </Box>
            </ModalShowContent>
        </>
    )
}