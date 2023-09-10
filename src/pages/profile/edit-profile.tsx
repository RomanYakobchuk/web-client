import {useGetIdentity, useTranslate} from "@refinedev/core";
import {
    Box, Button,
    FormControl,
    FormHelperText,
    TextField,
    Avatar
} from "@mui/material";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {useForm} from "@refinedev/react-hook-form";
import {DeleteForeverOutlined, Edit} from "@mui/icons-material";
import {ImageField} from "@refinedev/antd";
import {useNavigate, useParams} from "react-router-dom";

import {CustomButton, CustomEdit} from "../../components";
import {ColorModeContext} from "../../contexts";
import {IGetIdentity, ProfileProps} from "../../interfaces/common";
import {buttonStyle, textFieldStyle} from "../../styles";

interface INewUserData {
    avatar: string | File,
    name: string,
    phone: string | number,
    changeAva: boolean | undefined,
    currentId: string,
    dOB: Date | string
}

const EditProfile = () => {
    const {id: _id} = useParams();
    const navigate = useNavigate();
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const currentUser = identity?.user as ProfileProps;
    const {mode} = useContext(ColorModeContext);

    const [userData, setUserData] = useState<INewUserData>({} as INewUserData);
    const [propertyImage, setPropertyImage] = useState<any>();
    const [userDOB, setUserDOB] = useState<string>("");
    const [userNewDOB, setUserNewDOB] = useState<Date | any>();
    const translate = useTranslate();

    useEffect(() => {
        if (currentUser?.status !== 'admin' && _id !== currentUser?._id) {
            navigate('/profile')
        }
    }, [currentUser?._id, currentUser?.status, _id])

    const {
        refineCore: {onFinish, formLoading, queryResult},
        handleSubmit,
    } = useForm({
        refineCoreProps: {
            resource: `users/userInfo`,
            id: _id as string,
            successNotification: (data: any) => {
                return {
                    type: "success",
                    message: data?.data?.message
                }
            }
        },
    },);

    const {isLoading, isError} = queryResult!;
    const [user, setUser] = useState<ProfileProps>({} as ProfileProps);

    useEffect(() => {
        if (queryResult?.data?.data) {
            const getUserData = queryResult?.data?.data as ProfileProps;
            setUserData({
                avatar: getUserData?.avatar,
                changeAva: undefined,
                currentId: getUserData?._id,
                dOB: new Date(getUserData?.dOB)?.toISOString()?.split('T')[0],
                name: getUserData?.name,
                phone: getUserData?.phone
            })
            // setUser(queryResult?.data?.data as ProfileProps)
        }
    }, [queryResult?.data?.data])

    useEffect(() => {
        if (user?.dOB) {
            const date = new Date(user?.dOB)?.toISOString()?.split('T')[0];
            setUserDOB(date)
        }
    }, [user?.dOB])

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        setPropertyImage(file)
    }

    const deleteImage = () => {
        setPropertyImage('')
    }

    const onFinishHandler = async () => {

        if ((new Date(userNewDOB)?.getFullYear() || new Date(user?.dOB)?.getFullYear()) > (new Date().getFullYear() - 18)) {
            return alert(translate("profile.edit.alert"))
        }
        const formData = new FormData();
        formData.append("avatar", propertyImage as File ?? user?.avatar);
        formData.append("changeAva", propertyImage && true);
        formData.append("name", userData?.name);
        formData.append("phone", JSON.stringify(userData?.phone));
        formData.append("dOB", userNewDOB ?? userData?.dOB);
        formData.append("currentId", userData?.currentId)

        const {data}: any = await onFinish(formData);
        if (_id === currentUser?._id) {
            if (data?.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data?.user)
                );
            } else if (data) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data)
                );
            }
        }
        navigate(`/profile`)
    }


    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error</div>


    return (
        <CustomEdit
            isLoading={isLoading}
            bgColor={'transparent'}
            style={{
                maxWidth: '700px',
                margin: '0 auto'
            }}
            onClick={onFinishHandler}
        >
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
                    onSubmit={handleSubmit(onFinishHandler)}
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
                            propertyImage
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
                                                }} value={URL.createObjectURL(propertyImage)}/>
                                </Box>
                                : <Box sx={{
                                    width: {xs: "160px", md: "340px"},
                                    height: {xs: "150px", md: "320px"},
                                }}>
                                    {
                                        user?.avatar ?
                                            <ImageField alt={"image"}
                                                        value={currentUser?.avatar}
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
                                propertyImage && propertyImage?.name
                                    ? <CustomButton handleClick={deleteImage} color={"#fcfcfc"}
                                                    title={translate("profile.edit.delete")}
                                                    backgroundColor={"red"}
                                                    icon={<DeleteForeverOutlined style={{color: '#fcfcfc'}}/>}/>
                                    : <div></div>
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
                            value={userData?.name ?? ''}
                            variant="outlined"
                            onChange={(event) => setUserData((prevState) => ({...prevState, name: event.target.value}))}
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
                                   value={userNewDOB ? userNewDOB : userDOB}
                                   variant="outlined"
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => setUserData((prevState) => ({...prevState, dOB: e.target.value}))}
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
                            value={userData?.phone ?? ''}
                            onChange={(event) => setUserData((prevState) => ({...prevState, phone: event.target.value}))}
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
        </CustomEdit>
    );
};


export default EditProfile;