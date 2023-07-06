import {useGetIdentity, useTranslate} from "@refinedev/core";
import {
    Box, Button,
    FormControl,
    FormHelperText,
    TextField,
    Typography,
    Avatar, CircularProgress
} from "@mui/material";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {useForm} from "@refinedev/react-hook-form";
import {FieldValues} from "react-hook-form";
import {ArrowBackIosNew, DeleteForeverOutlined, Edit} from "@mui/icons-material";
import {ImageField} from "@refinedev/antd";
import {useNavigate, useParams} from "react-router-dom";

import {CustomButton} from "../index";
import {ColorModeContext} from "../../contexts";
import {ProfileProps} from "../../interfaces/common";
import {buttonStyle, textFieldStyle} from "../../styles";

const EditProfile = () => {
    const {id: _id} = useParams();
    const navigate = useNavigate();
    const {data: currentUser} = useGetIdentity<ProfileProps>();
    const {mode} = useContext(ColorModeContext);

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
        register,
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
            setUser(queryResult?.data?.data as ProfileProps)
        }
    }, [queryResult])

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

    const onFinishHandler = async (newData: FieldValues) => {

        if ((new Date(userNewDOB)?.getFullYear() || new Date(user?.dOB)?.getFullYear()) > (new Date().getFullYear() - 18)) {
            return alert(translate("profile.edit.alert"))
        }
        const formData = new FormData();
        formData.append("avatar", propertyImage as File ?? user?.avatar);
        formData.append("changeAva", propertyImage && true);
        formData.append("name", newData?.name);
        formData.append("phone", newData?.phone);
        formData.append("dOB", userNewDOB ?? user?.dOB);
        formData.append("currentId", currentUser?._id)

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

        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: "start",
                gap: {xs: '10%', sm: '30%', md: '40%'}
            }}>
                {/*<CustomButton handleClick={() => navigate(-1)} width={'50px'} title={""} backgroundColor={'blue'}*/}
                {/*              color={'#fcfcfc'} icon={<ArrowBackIosNew/>}/>*/}
                <Button
                    variant={"outlined"}
                    onClick={() => navigate(-1)}
                    color={'secondary'}>
                    <ArrowBackIosNew/>
                </Button>
                <Typography fontSize={{xs: '18px', sm: '22px'}} fontWeight={700} textAlign={"center"}>
                    {translate("profile.edit.title")}
                </Typography>
            </Box>

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
                                    width: '130px',
                                    textTransform: 'capitalize',
                                    ...buttonStyle
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
                            defaultValue={user?.name}
                            variant="outlined"
                            {...register('name', {required: true})}
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
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => setUserNewDOB(e.target.value)}
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
                            defaultValue={user?.phone}
                            type={"text"}
                            sx={{
                                ...textFieldStyle
                            }}
                            size={"small"}
                            variant="outlined"
                            {...register('phone', {required: true})}
                        />
                    </FormControl>
                    <FormControl sx={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: 'center'
                    }}>
                        <Button
                            color="error"
                            variant={'contained'}
                            sx={{
                                ...buttonStyle,
                                width: '38%'
                            }}
                            onClick={() => navigate("/profile")}
                        >
                            {translate("profile.edit.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            variant={'contained'}
                            sx={{
                                ...buttonStyle,
                                width: '60%'
                            }}
                            color="info"
                        >
                            {formLoading ? <CircularProgress size={20}/> : translate("profile.edit.save")}
                        </Button>
                    </FormControl>
                </form>
            </Box>
        </Box>
    );
};


export default EditProfile;