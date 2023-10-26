import {ProfileProps} from "../../../interfaces/common";
import {Avatar, Box, Button, FormControl, FormHelperText, TextField} from "@mui/material";
import {ImageField} from "@refinedev/antd";
import {buttonStyle, textFieldStyle} from "../../../styles";
import {DeleteForeverOutlined, Edit} from "@mui/icons-material";
import React, {ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {CustomButton} from "../../index";
import {ColorModeContext} from "../../../contexts";
import {useTranslate} from "@refinedev/core";
import dayjs from "dayjs";

export interface INewUserData {
    avatar: string | File,
    name: string,
    phone: string | number,
    changeAva: boolean | undefined,
    currentId: string,
    dOB: Date | string
}

type TProps = {
    userInfo: INewUserData,
    setUserInfo: Dispatch<SetStateAction<INewUserData>>
}
const ProfileDataForm = ({userInfo, setUserInfo}: TProps) => {

    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    const [previousUserInfo, setPreviousUserInfo] = useState<INewUserData>(userInfo);

    useEffect(() => {
        if (userInfo) {
            setPreviousUserInfo(userInfo);
        }
    }, []);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        setUserInfo(prevState => ({...prevState, avatar: file}))
    }

    const deleteImage = () => {
        setUserInfo(prevState => ({...prevState, avatar: previousUserInfo?.avatar}))
    }

    return (
        <Box
            sx={{
                maxWidth: '550px',
                bgcolor: mode === "dark" ? "#2e424d" : "#fcfcfc",
                p: '20px',
                mt: 2.5,
                margin: 'auto',
                borderRadius: '15px'
            }}
        >
            <form
                style={{
                    marginTop: "20px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                <FormControl sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: {xs: 2, md: 5},
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {
                        userInfo?.avatar
                            ? <Box sx={{
                                width: {xs: "160px", md: "340px"},
                                height: {xs: "150px", md: "320px"},
                            }}>
                                <ImageField alt={"image"}
                                            width={"100%"}
                                            height={"100%"}
                                            preview={{zIndex: 10000}}
                                            style={{
                                                objectFit: "cover",
                                                borderRadius: '5px'
                                            }} value={userInfo?.avatar instanceof File ? URL.createObjectURL(userInfo?.avatar) : userInfo?.avatar ?? ''}/>
                            </Box>
                            : <Box sx={{
                                width: {xs: "160px", md: "340px"},
                                height: {xs: "150px", md: "320px"},
                            }}>
                                {
                                    typeof userInfo?.avatar === 'string' ?
                                        <ImageField alt={"image"}
                                                    value={userInfo?.avatar}
                                                    width={"100%"}
                                                    preview={{zIndex: 10000}}
                                                    height={"100%"}
                                                    style={{
                                                        objectFit: "cover",
                                                        borderRadius: '5px'
                                                    }}/> :
                                        <Avatar sx={{
                                            width: {xs: "200px", md: "340px"},
                                            height: {xs: "190px", md: "320px"},
                                            borderRadius: '5px'
                                        }}/>
                                }
                            </Box>
                    }

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        gap: 2
                    }}>

                        <Button
                            component="label"
                            variant={'contained'}
                            color={'info'}
                            sx={{
                                ...buttonStyle,
                                width: '130px',
                            }}
                            startIcon={
                                <Edit/>
                            }
                        >
                            {translate("profile.edit.change")}
                            <input
                                hidden
                                accept="image/*"
                                type="file"
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>,
                                ) => {
                                    handleImageChange(e);
                                }}
                            />
                        </Button>
                        {
                            userInfo?.avatar
                                ? <CustomButton handleClick={deleteImage} color={"#fcfcfc"}
                                                title={translate("profile.edit.delete")}
                                                backgroundColor={"red"}
                                                icon={<DeleteForeverOutlined style={{color: '#fcfcfc'}}/>}/>
                                : ''
                        }

                    </Box>
                </FormControl>
                <FormControl>
                    <FormHelperText
                        sx={{
                            fontWeight: 500,
                            margin: "10px 0",
                            fontSize: {xs: 12, sm: 16},
                            color: mode === "dark" ? "#fcfcfc" : "#11142D",
                        }}
                    >
                        {translate("profile.edit.name")}
                    </FormHelperText>
                    <TextField
                        fullWidth
                        required
                        size={"small"}
                        id="outlined-basic"
                        color="info"
                        sx={{
                            ...textFieldStyle
                        }}
                        value={userInfo?.name ?? ''}
                        variant="outlined"
                        onChange={(event) => setUserInfo((prevState) => ({...prevState, name: event.target.value}))}
                    />
                </FormControl>
                <FormControl>
                    <FormHelperText sx={{
                        fontWeight: 500,
                        margin: "10px 0",
                        fontSize: {xs: 12, sm: 16},
                        color: mode === "dark" ? "#fcfcfc" : "#11142D",
                    }}
                    >
                        {translate("profile.edit.dOB")}
                    </FormHelperText>
                    <TextField fullWidth
                               required
                               id="outlined-basic"
                               color="info"
                               size={"small"}
                               type={"date"}
                               sx={{
                                   ...textFieldStyle
                               }}
                               value={userInfo?.dOB ? dayjs(userInfo?.dOB).format('YYYY-MM-DD') : ''}
                               variant="outlined"
                               onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                   setUserInfo((prevState) => ({...prevState, dOB: new Date(e.target.value)}))
                               }}
                    />
                </FormControl>
                <FormControl>
                    <FormHelperText
                        sx={{
                            fontWeight: 500,
                            margin: "10px 0",
                            fontSize: {xs: 12, sm: 16},
                            color: mode === "dark" ? "#fcfcfc" : "#11142D",
                        }}
                    >
                        {translate("profile.edit.phone")}
                    </FormHelperText>
                    <TextField
                        fullWidth
                        required
                        id="outlined-basic"
                        color="info"
                        type={"text"}
                        sx={{
                            ...textFieldStyle
                        }}
                        size={"small"}
                        variant="outlined"
                        value={userInfo?.phone ?? ''}
                        onChange={(event) => setUserInfo((prevState) => ({...prevState, phone: event.target.value}))}
                    />
                </FormControl>
                {/*<FormControl sx={{*/}
                {/*    display: 'flex',*/}
                {/*    flexDirection: "row",*/}
                {/*    justifyContent: "space-between",*/}
                {/*    alignItems: 'center'*/}
                {/*}}>*/}
                {/*    <Button*/}
                {/*        color="error"*/}
                {/*        variant={'contained'}*/}
                {/*        sx={{*/}
                {/*            ...buttonStyle,*/}
                {/*            width: '38%'*/}
                {/*        }}*/}
                {/*        onClick={() => navigate("/profile")}*/}
                {/*    >*/}
                {/*        {translate("profile.edit.cancel")}*/}
                {/*    </Button>*/}
                {/*    <Button*/}
                {/*        type="submit"*/}
                {/*        variant={'contained'}*/}
                {/*        sx={{*/}
                {/*            ...buttonStyle,*/}
                {/*            width: '60%'*/}
                {/*        }}*/}
                {/*        color="info"*/}
                {/*    >*/}
                {/*        {formLoading ? <CircularProgress size={20}/> : translate("profile.edit.save")}*/}
                {/*    </Button>*/}
                {/*</FormControl>*/}
            </form>
        </Box>
    );
};
export default ProfileDataForm
