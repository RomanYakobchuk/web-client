import {useNavigate} from "react-router-dom";
import React, {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import {useGetIdentity, useTranslate} from "@refinedev/core";
import {GoogleMap, MarkerF, useJsApiLoader} from "@react-google-maps/api";
import {
    Box,
    Button,
    CardMedia, CircularProgress,
    FormControl,
    FormHelperText, IconButton, MenuItem, Select,
    SelectChangeEvent, TextField,
    Typography
} from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import {AddCircleOutline, ArrowBackIosNew, DeleteForeverOutlined, Edit} from "@mui/icons-material";

import {IGetIdentity, IPlaceFormProps, IWorkDay, ProfileProps} from "../../interfaces/common";
import {center, containerStyle, options} from "./utills/mapsOptrions";
import {CustomButton, ModalWindow, SearchManager} from "../index";
import {ColorModeContext} from "../../contexts";
import ImageSelector from "./utills/ImageSelector";
import ScheduleList from "./utills/scheduleList";
import ItemsList from "./utills/ItemsList";
import {buttonStyle, selectStyle, textFieldStyle} from "../../styles";


const DataForm = ({
                      handleSubmit,
                      formLoading,
                      onFinishHandler,
                      mainPhoto,
                      setMainPhoto,
                      otherPhoto,
                      setOtherPhoto,
                      open,
                      setOpen,
                      titleAction,
                      type,
                      setType,
                      tags,
                      setTags,
                      setWorkScheduleWeekend,
                      workScheduleWeekend,
                      setVariantForDisplay,
                      variantForDisplay,
                      workDays,
                      setWorkDays,
                      setCreatedBy,
                      createdBy,
                      setDescription,
                      description,
                      setPlace,
                      place,
                      location,
                      setLocation,
                      features,
                      setFeatures,
                      contacts,
                      setContacts,
                      title,
                      setTitle,
                      averageCheck,
                      setAverageCheck
                  }: IPlaceFormProps) => {

    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const currentUser: ProfileProps = identity?.user as ProfileProps;

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY!
    });
    const mapRef = useRef<google.maps.Map | null>(null);
    const onLoad = (map: google.maps.Map): void => {
        mapRef.current = map
    }
    const onUnmount = (): void => {
        mapRef.current = null
    }

    useEffect(() => {
        if (currentUser?.status !== 'admin') {
            setCreatedBy(currentUser?._id)
        }
    }, [currentUser])

    const handleAddWorkDays = (workSchedule: IWorkDay) => {
        setWorkDays([...workDays, workSchedule])
    }
    const handleDeleteWorkDays = (index: number | any) => {
        setWorkDays(workDays.filter((_: any, i: any) => i !== index))
    }


    useEffect(() => {
        if (location?.lat && location?.lng) {
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY!}`)
                .then((data) => data.json())
                .then((data) => {
                    setPlace({
                        address: data.results[0].formatted_address?.split(',')?.splice(0, 2)?.join(','),
                        city: `${data.results[0].address_components[4].long_name}, ${data.results[0].address_components[3].long_name}, ${data.results[0].address_components[2].long_name}`
                    })
                })
                .catch((error) => console.log(error))
        }
    }, [location])

    const onMapClick = (e: google.maps.MapMouseEvent) => {
        setLocation({lat: e.latLng?.lat(), lng: e.latLng?.lng()})
    }
    const handleChange = (event: SelectChangeEvent) => {
        setType(event.target.value);
    };

    const handleMainPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMainPhoto(e.target.files![0])
    }

    const handleOtherPhotoChange = (e: ChangeEvent<HTMLInputElement> | any) => {
        if (10 < otherPhoto.length) return alert(translate("home.create.otherPhoto.max") + "10");
        if (10 < e.target.files?.length) return alert(translate("home.create.otherPhoto.max") + '10');

        let arr = [];
        const items = e.target.files;
        for (let i = 0; i < items?.length; i++) {
            const item = items[i];
            arr.push(item)
        }
        setOtherPhoto([...arr])
    }

    const deleteImage = () => {
        setMainPhoto([])
    }

    const handleOpen = () => {
        if ((!mainPhoto && !mainPhoto?.name) || (!otherPhoto && otherPhoto?.length < 0)) return alert("Виберіть головне фото");

        if (otherPhoto.length > 10) return alert(translate("home.create.otherPhoto.max"))

        setOpen(true)
    }

    return (
        // <Box sx={{
        //     display: 'flex',
        //     flexDirection: 'row',
        //     alignItems: 'center',
        //     justifyContent: "start",
        //     gap: {xs: '10%', sm: '30%', md: '40%'}
        // }}>
        //     <Button
        //         variant={"outlined"}
        //         onClick={() => navigate(-1)}
        //         color={'secondary'}>
        //         <ArrowBackIosNew/>
        //     </Button>
        //
        //     <Typography fontSize={{xs: 18, md: 22}} fontWeight={700} textAlign={"start"}>
        //         {translate(`home.${titleAction}.title`)}
        //     </Typography>
        // </Box>
        <Box
            sx={{
                borderRadius: '15px',
                p: '15px',
                paddingBottom: '30px',
                bgcolor: (theme) => theme.palette.primary.main,
            }}
        >
            <Box
                component={"form"}
                sx={{
                    marginTop: "20px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: {xs: '10px', sm: '20px'},
                }}
                onSubmit={handleSubmit(onFinishHandler)}
            >
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: {xs: 'column', md: 'row'}
                    }}
                >
                    <FormControl sx={{
                        width: {xs: '100%', md: '48%'},
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                    }}>
                        <FormHelperText
                            sx={{
                                fontWeight: 500,
                                margin: "0",
                                fontSize: {xs: 12, sm: 16},
                                color: mode === "dark" ? "#fcfcfc" : "#11142D",
                            }}
                        >
                            {translate("home.create.mainPhoto")}
                        </FormHelperText>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: mainPhoto && (mainPhoto?.name || (typeof mainPhoto === "string" && mainPhoto?.length > 0)) ? {
                                xs: 1,
                                sm: 2
                            } : 0,
                            width: '100%'
                        }}>
                            <Box sx={{
                                width: '100%',
                                height: {xs: '190px', sm: '270px', md: '370px'},
                                borderRadius: "5px",
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                {
                                    mainPhoto?.name || (typeof mainPhoto === "string" && mainPhoto?.length > 0) ?
                                        <CardMedia
                                            component={"img"}
                                            src={typeof mainPhoto === "string" ? mainPhoto : URL.createObjectURL(mainPhoto)}
                                            alt={"image"}
                                            style={{
                                                borderRadius: '5px',
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        : <Button component={"label"} sx={
                                            {
                                                width: '100%',
                                                height: '90%',
                                                display: 'flex',
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: '5px',
                                                cursor: "pointer",
                                                transition: "300ms linear",
                                                "&:hover": {
                                                    bgcolor: 'silver',
                                                },
                                                border: `1px dashed ${mode === "dark" ? "#fcfcfc" : "#9ba5c9"}`
                                            }
                                        }>
                                            <AddCircleOutline sx={{
                                                color: mode === "dark" ? "#fcfcfc" : "#9ba5c9",
                                                fontSize: {xs: "70px", md: "160px"}
                                            }}/>
                                            <input
                                                hidden
                                                accept="image/*"
                                                type="file"
                                                onChange={(
                                                    e: ChangeEvent<HTMLInputElement>,
                                                ) => {
                                                    handleMainPhotoChange(e);
                                                }}
                                            />
                                        </Button>
                                }
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                {
                                    mainPhoto && (mainPhoto?.name || (typeof mainPhoto === "string" && mainPhoto?.length > 0))
                                        ? <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1
                                        }}>
                                            <Button
                                                component="label"
                                                color={'info'}
                                                variant={'contained'}
                                                sx={{
                                                    ...buttonStyle,
                                                    fontSize: {xs: 12, sm: 14},
                                                    width: '130px',
                                                    textTransform: 'capitalize',
                                                }}
                                                startIcon={<Edit sx={{fontSize: {xs: 16, sm: 18}}}/>}
                                            >
                                                {translate("profile.edit.change")}
                                                <input
                                                    hidden
                                                    accept="image/*"
                                                    type="file"
                                                    onChange={(
                                                        e: ChangeEvent<HTMLInputElement>,
                                                    ) => {
                                                        handleMainPhotoChange(e);
                                                    }}
                                                />
                                            </Button>
                                            <Button
                                                onClick={deleteImage}
                                                color={"error"}
                                                variant={'contained'}
                                                sx={{
                                                    ...buttonStyle,
                                                    textTransform: 'capitalize'
                                                }}
                                                startIcon={<DeleteForeverOutlined style={{color: '#fcfcfc'}}/>}
                                            >
                                                {translate("profile.edit.delete")}
                                            </Button>
                                        </Box>
                                        : <div></div>
                                }
                            </Box>
                        </Box>
                    </FormControl>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr', md: '1fr'},
                        width: {xs: '100%', md: '48%'},
                        gridTemplateRows: '80px',
                        gap: 1
                    }}>
                        <FormControl fullWidth>
                            <FormHelperText
                                sx={{
                                    fontWeight: 500,
                                    margin: "10px 0",
                                    fontSize: {xs: 12, sm: 16},
                                    color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                    lineHeight: 'normal'
                                }}
                            >
                                {translate("home.create.name")}
                            </FormHelperText>
                            <TextField
                                fullWidth
                                required
                                sx={textFieldStyle}
                                size={"small"}
                                id="outlined-basic"
                                color="secondary"
                                value={title ? title : ''}
                                onChange={(event) => setTitle(event.target.value)}
                                variant="outlined"
                            />
                        </FormControl>
                        {
                            currentUser?.status === 'admin' &&
                            <FormControl
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                <FormHelperText
                                    sx={{
                                        fontSize: {xs: '14px', sm: '16px'},
                                        m: '10px 0',
                                        color: (theme) => theme.palette.text.primary,
                                        lineHeight: 'normal'
                                    }}
                                >
                                    {/*{translate('home.create.location.title')}*/}
                                    User
                                </FormHelperText>
                                <SearchManager setCreatedBy={setCreatedBy} createdBy={createdBy}/>
                            </FormControl>
                        }
                        <FormControl fullWidth>
                            <FormHelperText
                                sx={{
                                    fontWeight: 500,
                                    margin: "10px 0",
                                    fontSize: {xs: 12, sm: 16},
                                    height: '19px',
                                    color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                }}
                            >
                                {translate("home.create.type.title")}

                            </FormHelperText>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={type ? type : ''}
                                size={"small"}
                                sx={{
                                    ...selectStyle,
                                    fontSize: {xs: 12, sm: 16},
                                }}
                                color={"secondary"}
                                onChange={handleChange}
                            >
                                {
                                    [
                                        {
                                            title: translate("home.sortByType.bar"),
                                            value: 'bar'
                                        },
                                        {
                                            title: translate("home.sortByType.cafe"),
                                            value: "cafe"
                                        },
                                        {
                                            title: translate("home.sortByType.restaurant"),
                                            value: 'restaurant'
                                        }
                                    ].map((type) => (
                                        <MenuItem sx={{
                                            fontSize: {xs: 12, sm: 16},
                                        }} key={type.value}
                                                  value={type.value}>{type.title}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <FormControl fullWidth>
                    <FormHelperText
                        sx={{
                            fontWeight: 500,
                            margin: "10px 0",
                            fontSize: {xs: 12, sm: 16},
                            color: mode === "dark" ? "#fcfcfc" : "#11142D",
                        }}
                    >
                        {translate("home.create.description")}
                    </FormHelperText>
                    <MDEditor data-color-mode={mode === "dark" ? 'dark' : 'light'}
                              value={description ? description : ''}
                              onChange={setDescription}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <FormHelperText
                        sx={{
                            fontWeight: 500,
                            margin: "10px 0",
                            fontSize: {xs: 12, sm: 16},
                            color: mode === "dark" ? "#fcfcfc" : "#11142D",
                        }}
                    >
                        {translate("home.create.location.title")}
                    </FormHelperText>
                    {
                        isLoaded ?
                            <Box sx={{
                                width: "100%",
                                height: {xs: "350px", md: "400px"},
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={center}
                                    options={options as google.maps.MapOptions}
                                    zoom={10}
                                    onLoad={onLoad}
                                    onClick={onMapClick}
                                    onUnmount={onUnmount}>
                                    {
                                        location?.lat ?
                                            <MarkerF position={location as google.maps.LatLngLiteral}/> : null
                                    }
                                </GoogleMap>
                            </Box> : <Box sx={{
                                width: "100%",
                                height: {xs: "350px", md: "400px"},
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <CircularProgress/>
                            </Box>
                    }
                    {
                        (location?.lat && location?.lng) ?
                            <>
                                <TextField
                                    fullWidth
                                    required
                                    sx={{
                                        mt: 2,
                                        ...textFieldStyle
                                    }}
                                    id="outlined-basic"
                                    color={"secondary"}
                                    disabled
                                    label={translate("home.create.location.coordinates.title")}
                                    variant="outlined"
                                    size={"small"}
                                    value={location?.lat && location?.lng ? `lat: ${location?.lat}   lng: ${location?.lng}` : `lat: 0, lng: 0`}
                                    onChange={() => {
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    required
                                    sx={{
                                        mt: 2,
                                        ...textFieldStyle
                                    }}
                                    id="outlined-basic3"
                                    color={"secondary"}
                                    size={"small"}
                                    value={place.city ? place.city : ''}
                                    label={translate("home.create.city")}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPlace({
                                        address: place.address,
                                        city: e.target.value
                                    })}
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    required
                                    id="outlined-basic3"
                                    color={"secondary"}
                                    sx={{
                                        mt: 2,
                                        ...textFieldStyle
                                    }}
                                    label={translate("home.create.address")}
                                    size={"small"}
                                    value={place.address ? place.address : ''}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPlace({
                                        address: e.target.value,
                                        city: place.city
                                    })}
                                    variant="outlined"
                                />
                            </> : ''
                    }
                </FormControl>
                {/*<ScheduleList dataLabel={translate("home.create.workSchedule.workDays.title")}*/}
                {/*              label={translate("home.create.workSchedule.weekend.title")}*/}
                {/*              onSubmit={handleAddWorkDays} onDelete={handleDeleteWorkDays}*/}
                {/*              onSubmitWeekend={setWorkScheduleWeekend} workScheduleWeekend={workScheduleWeekend}*/}
                {/*              elements={workDays ? workDays : []}/>*/}
                <Box sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', lg: 'row'},
                    width: '100%',
                    gap: {xs: 2, sm: 4}
                }}>
                    <FormControl fullWidth>
                        <ItemsList elements={contacts} label={translate('home.create.contacts')}
                                   setData={setContacts}/>
                    </FormControl>
                    <FormControl fullWidth>
                        <ItemsList elements={tags} label={translate('home.create.tags')} setData={setTags}/>
                    </FormControl>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', lg: 'row'},
                    width: '100%',
                    gap: {xs: 2, sm: 4}
                }}>
                    <FormControl fullWidth>
                        <ItemsList elements={features} label={translate('home.create.features')}
                                   setData={setFeatures}/>
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            required
                            label={translate("home.create.averageCheck")}
                            id="outlined-basic"
                            color={"secondary"}
                            size={"small"}
                            sx={textFieldStyle}
                            variant="outlined"
                            value={averageCheck ? averageCheck : ''}
                            onChange={(event) => setAverageCheck(event.target.value)}
                        />
                    </FormControl>
                </Box>
                <FormControl>
                    <FormHelperText
                        sx={{
                            fontWeight: 500,
                            margin: "10px 0",
                            fontSize: {xs: 12, sm: 16},
                            color: mode === "dark" ? "#fcfcfc" : "#11142D",
                        }}
                    >
                        {translate("home.create.otherPhoto.title")}
                    </FormHelperText>
                    <ImageSelector variantForDisplay={variantForDisplay} setVariantForDisplay={setVariantForDisplay}
                                   maxImages={12} images={otherPhoto}
                                   setOtherPhoto={setOtherPhoto}
                                   handleChange={handleOtherPhotoChange}/>

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
                            width: '32%',
                            textTransform: 'capitalize'
                        }}
                        onClick={() => navigate("/home")}
                    >
                        {translate("profile.edit.cancel")}
                    </Button>
                    <Button
                        color="info"
                        variant={'contained'}
                        sx={{
                            ...buttonStyle,
                            width: '60%'
                        }}
                        onClick={handleOpen}
                    >
                        {translate("profile.edit.save")}
                    </Button>
                    {/*<ModalWindow*/}
                    {/*    close={setOpen}*/}
                    {/*    open={open}*/}
                    {/*    handleSubmit={handleSubmit(onFinishHandler)}*/}
                    {/*    message={translate("home.create.message")}*/}
                    {/*    textButtonCancel={translate("buttons.cancel")}*/}
                    {/*    textButtonConfirm={formLoading ? '' : translate("buttons.save")}*/}
                    {/*    icon={formLoading ? <CircularProgress/> : ""}*/}
                    {/*    textTitle={translate("home.create.confirmTitle")}*/}
                    {/*/>*/}
                </FormControl>
            </Box>
        </Box>
    );
};
export default DataForm
