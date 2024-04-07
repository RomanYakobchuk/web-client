import {MouseEvent, useContext, useEffect, useState} from "react";
import {Box, Button, ButtonGroup, IconButton, Popover} from "@mui/material";
import {Apartment, ModeSharp, PersonSharp, RadioButtonChecked, RadioButtonUnchecked} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";

import {ColorModeContext} from "@/contexts";
import {useLeaveManagerCommentAs, useManagerEstablishment, useUserInfo} from "@/hook";
import { TSelectOption } from "@/contexts/CommentCreatorDataContext";

export type TChooseManagerRoleProps = {
    currentEstablishment: string
}
const buttonGroupOptions = [
    {
        value: "user",
        icon: <PersonSharp/>
    },
    {
        value: "establishment",
        icon: <Apartment/>
    },
]

const ChooseManagerRole = ({currentEstablishment}: TChooseManagerRoleProps) => {

    const {user} = useUserInfo();
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const {setManagerRole, managerRole, setSelectedInfo, selectedInfo} = useLeaveManagerCommentAs();
    const {managerEstablishment, getData} = useManagerEstablishment();

    const [selectOptions, setSelectOptions] = useState<TSelectOption[]>([]);

    const userSelect = {
        picture: user?.avatar,
        _id: user?._id,
        title: user?.name,
        type: ''
    } as TSelectOption;

    const currentEstablishmentData = managerEstablishment?.find((value) => value?._id === currentEstablishment)

    const currentEstablishmentSelect = (currentEstablishmentData && currentEstablishmentData?.pictures) ? {
        _id: currentEstablishmentData?._id,
        type: currentEstablishmentData?.type,
        title: currentEstablishmentData?.title,
        picture: currentEstablishmentData?.pictures?.length > 0 ? currentEstablishmentData?.pictures[0]?.url : ''
    } as TSelectOption : managerEstablishment?.length > 0 ? {
        _id: managerEstablishment[0]?._id,
        type: managerEstablishment[0]?.type,
        title: managerEstablishment[0]?.title,
        picture: managerEstablishment[0]?.pictures?.length > 0 && managerEstablishment[0]?.pictures[0]?.url
    } as TSelectOption : {} as TSelectOption;
    const [anchorElPopover, setAnchorElPopover] = useState<HTMLButtonElement | null>(null);
    const handleClickPopover = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorElPopover(event.currentTarget);
        getUserEstablishments();
    }
    const getUserEstablishments = () => {
        getData();
    }
    const handleClosePopover = () => {
        setAnchorElPopover(null);
    }


    useEffect(() => {
        if (user?._id) {
            setSelectOptions((prevState) => ([...new Set([userSelect, ...prevState]?.map((value) => JSON.stringify(value)))]?.map((value) => JSON.parse(value))));
        }
        if (managerEstablishment?.length > 0) {
            const selectEstablishmentsOptions = managerEstablishment?.map((value) => ({
                type: value?.type,
                title: value?.title,
                _id: value?._id,
                picture: value?.pictures?.length > 0 ? value?.pictures[0]?.url : ''
            } as TSelectOption))
            setSelectOptions((prevState) => ([...new Set([...prevState, ...selectEstablishmentsOptions]?.map((value) => JSON.stringify(value)))]?.map((value) => JSON.parse(value))))
        }
    }, [managerEstablishment, user?._id]);

    const handleSelectInfo = (option: TSelectOption) => {
        if (selectedInfo?._id !== option?._id) {
            setSelectedInfo(option)
            setManagerRole(option?._id === user?._id ? 'user' : 'establishment')
        }
        handleClosePopover();
    }
    const handleCurrentUserOrEstablishment = () => {
        if (managerRole === 'user') {
            setManagerRole('establishment')
            handleSelectInfo(currentEstablishmentSelect)
        } else {
            setManagerRole('user')
            handleSelectInfo(userSelect)
        }
    }

    const openPopover = Boolean(anchorElPopover);
    const popoverId = openPopover ? 'establishment_popover' : undefined;

    if (user?.status !== 'manager') {
        return  null;
    }
    return (
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <ButtonGroup
                    variant={'outlined'}
                    color={'info'}
                >
                    {
                        buttonGroupOptions?.map((value, index) => (
                            <Button
                                onClick={handleCurrentUserOrEstablishment}
                                id={`chooseManagerRole`}
                                variant={managerRole === value?.value ? 'contained' : 'outlined'}
                                key={index}
                                sx={{
                                    // bgcolor: managerRole === value?.value ? 'info.main' : 'info.contrastText',
                                    // "&.Mui-disabled": {
                                    //     color: managerRole === value?.value ? '#fff' : '#010101',
                                    //     bgcolor: managerRole === value?.value ? 'info.main' : 'info.contrastText'
                                    // }
                                }}
                            >
                                {value?.icon}
                            </Button>
                        ))
                    }
                </ButtonGroup>
                <IconButton onClick={handleClickPopover}>
                    <ModeSharp/>
                </IconButton>
            </Box>
            <Popover
                id={popoverId}
                open={openPopover}
                anchorEl={anchorElPopover}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                sx={{
                    "& div.MuiPaper-root": {
                        backgroundColor: 'background.default',
                        boxShadow: `0px 0px 10px 0px ${mode === 'dark' ? '#f1f1f1' : '#424242'}`,
                        borderRadius: '7px'
                    },
                }}
            >
                <Box sx={{
                    width: '300px',
                    height: '100%',
                    maxHeight: {xs: '400px', md: '600px', lg: '700px'},
                    overflowY: 'auto',
                    display: 'flex',
                    p: 2,
                    flexDirection: 'column',
                    gap: 1
                }}>
                    {
                        selectOptions?.length > 0 && selectOptions?.map((option, index) => (
                            <Box
                                onClick={() => handleSelectInfo(option)}
                                key={index}
                                sx={{
                                    width: '100%',
                                    margin: '0 auto',
                                    p: '7px',
                                    borderRadius: '7px',
                                    border: `2px solid ${selectedInfo?._id === option?._id ? '#2874CB' : 'silver'}`,
                                    display: 'flex',
                                    alignItems: 'start',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    "&:hover": {
                                        border: '2px solid #2874CB',
                                        "& svg": {
                                            color: '#2874CB'
                                        }
                                    }
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    <img
                                        src={option?.picture}
                                        alt={option?.title}
                                        style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '5px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: option?.type ? 0.5 : 0,
                                        alignItems: 'start',
                                        color: 'common.white'
                                    }}>
                                        <div style={{
                                            fontSize: '18px',
                                            fontWeight: 500
                                        }}>
                                            {option?.title}
                                        </div>
                                        {
                                            option?.type && (
                                                <div style={{
                                                    fontSize: '14px',
                                                    padding: '3px 7px',
                                                    borderRadius: '20px',
                                                    backgroundColor: 'silver'
                                                }}>
                                                    {translate(`home.sortByType.${option?.type}`)}
                                                </div>
                                            )
                                        }
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        "& svg": {
                                            color: selectedInfo?._id === option?._id ? 'info.main' : 'silver'
                                        }
                                    }}
                                >
                                    {
                                        selectedInfo?._id === option?._id
                                            ? <RadioButtonChecked/>
                                            : <RadioButtonUnchecked/>
                                    }
                                </Box>
                            </Box>
                        ))
                    }
                </Box>
            </Popover>
        </>
    );
};
export default ChooseManagerRole
