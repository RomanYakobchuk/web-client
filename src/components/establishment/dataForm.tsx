import React, {ChangeEvent, useContext, useEffect, useRef} from "react";
import {useGetIdentity, useTranslate} from "@refinedev/core";
import {GoogleMap, MarkerF, useJsApiLoader} from "@react-google-maps/api";
import {
    Box, CircularProgress,
    FormControl,
    FormHelperText, MenuItem, Select,
    SelectChangeEvent, TextField, Typography,
} from "@mui/material";
import MDEditor from "@uiw/react-md-editor";

import {IGetIdentity, IPlaceFormProps, IWorkDay, ProfileProps} from "../../interfaces/common";
import {center, containerStyle, options} from "./utills/mapsOptrions";
import {SearchManager} from "../index";
import {ColorModeContext} from "../../contexts";
import ImageSelector from "./utills/ImageSelector";
import ScheduleList from "./utills/lists/scheduleList";
import ItemsList from "./utills/lists/dataPropertyList";
import {selectStyle, textFieldStyle} from "../../styles";
import {Switch} from "antd";


const DataForm = (props: IPlaceFormProps) => {
    const {
        handleSubmit,
        onFinishHandler,
        pictures,
        setPictures,
        type,
        setType,
        tags,
        setTags,
        setWorkScheduleWeekend,
        workScheduleWeekend,
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
        defaultPictures,
        setAverageCheck,
        setSendNotifications,
        sendNotifications
    } = props;
    const maxImages = 10;
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const currentUser: ProfileProps = identity?.user as ProfileProps;

    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_KEY!
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
    }, [currentUser]);

    const handleAddWorkDays = (workSchedule: IWorkDay) => {
        setWorkDays([...workDays, workSchedule])
    }
    const handleDeleteWorkDays = (index: number | any) => {
        setWorkDays(workDays.filter((_: any, i: any) => i !== index))
    }


    useEffect(() => {
        if (location?.lat && location?.lng) {
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${import.meta.env.VITE_APP_GOOGLE_MAPS_KEY!}`)
                .then((data) => data.json())
                .then((data) => {
                    if (!place.address || !place.city) {
                        setPlace({
                            address: data.results[0]?.formatted_address?.split(',')?.splice(0, 2)?.join(','),
                            city: `${data.results[0]?.address_components[4].long_name}, ${data.results[0]?.address_components[3]?.long_name}, ${data.results[0]?.address_components[2]?.long_name}`
                        })
                    }
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


    const handlePicturesChange = (e: ChangeEvent<HTMLInputElement> | any) => {
        if (pictures.length > maxImages || e.target.files?.length > maxImages) return alert(translate("home.create.pictures.max") + maxImages);

        let arr = [];
        const items = e.target.files;
        for (let i = 0; i < items?.length; i++) {
            const item = items[i];
            if ((arr?.length + pictures?.length) < maxImages) {
                arr.push(item)
            }
        }
        setPictures([...pictures, ...arr]);
    }

    return (
        <Box
            sx={{
                borderRadius: '15px',
                p: '15px',
                paddingBottom: '30px',
                bgcolor: 'primary.main',
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
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr',},
                        width: {xs: '100%'},
                        // gridTemplateRows: '80px',
                        gap: 1,
                        alignItems: 'end'
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
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {xs: '1fr', md: 'repeat(2, 1fr)'},
                                    gap: {xs: 1, md: 2}
                                }}>
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
                                        value={place.city ?? ''}
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
                                </Box>
                            </> : ''
                    }
                </FormControl>
                <ScheduleList dataLabel={translate("home.create.workSchedule.workDays.title")}
                              label={translate("home.create.workSchedule.weekend.title")}
                              onSubmit={handleAddWorkDays} onDelete={handleDeleteWorkDays}
                              onSubmitWeekend={setWorkScheduleWeekend} workScheduleWeekend={workScheduleWeekend}
                              elements={workDays ? workDays : []}/>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {xs: '1fr', md: 'repeat(2, 1fr)'},
                    width: '100%',
                    alignItems: 'start',
                    gap: 2
                }}>
                    <FormControl fullWidth>
                        <ItemsList elements={contacts} label={translate('home.create.contacts')}
                                   setData={setContacts}/>
                    </FormControl>
                    <FormControl fullWidth>
                        <ItemsList elements={tags} label={translate('home.create.tags')} setData={setTags}/>
                    </FormControl>
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
                <FormControl sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center'
                }}>
                    <Switch
                        style={{
                            width: 'fit-content'
                        }}
                        checked={sendNotifications ?? false}
                        onChange={(checked) => setSendNotifications(checked)}
                    />
                    <Typography
                        sx={{
                            color: 'common.white'
                        }}
                    >
                        {translate('notification.send')}
                    </Typography>
                </FormControl>
                <FormControl sx={{
                    bgcolor: mode === 'dark' ? "#1a1313" : '#f4f4f4',
                    borderRadius: '10px',
                    p: '10px'
                }}>
                    <FormHelperText
                        sx={{
                            fontWeight: 500,
                            margin: "10px 0",
                            fontSize: {xs: 12, sm: 16},
                            color: mode === "dark" ? "#fcfcfc" : "#11142D",
                        }}
                    >
                        {translate("home.create.pictures.title")}
                    </FormHelperText>
                    <ImageSelector
                        maxImages={maxImages} images={pictures}
                        defaultPictures={defaultPictures}
                        setPictures={setPictures}
                        handleChange={handlePicturesChange}/>

                </FormControl>
            </Box>
        </Box>
    );
};
export default DataForm;
