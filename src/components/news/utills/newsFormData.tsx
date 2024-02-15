import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    MenuItem,
    Select, Switch, TextField
} from "@mui/material";
import {Add} from "@mui/icons-material";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {useTranslate} from "@refinedev/core";
import MDEditor from "@uiw/react-md-editor";

import ImageSelector from "../../establishment/utills/ImageSelector";
import {ColorModeContext} from "@/contexts";
import {IMDEditor, INewsDateEvent, IPicture} from "@/interfaces/common";
import SearchEstablishments from "../../search/searchEstablishments";
import DateTimeList from "./dateTimeList";
import {INewsDataProps} from "@/interfaces/formData";
import {ChangeLocation, CustomOpenContentBtn} from "../../index";

const NewsFormData = (props: INewsDataProps) => {
    const {
        title,
        setEstablishmentInfo,
        setStatus,
        onFinishHandler,
        status,
        pictures,
        setPictures,
        description,
        setDescription,
        handleSubmit,
        setIsDatePublished,
        isDatePublished,
        dateEvent,
        category,
        setCategory,
        establishmentInfo,
        setTitle,
        setDateEvent,
        datePublished, setDatePublished,
        defaultPictures,
        setPlace: setDataPlace,
        place: dataPlace,
    } = props;
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const maxImages = 6;

    const [isEstablishmentLocPlace, setIsEstablishmentLocPlace] = useState<boolean>(!!dataPlace?.location?.lng ?? false);
    const [location, setLocation] = useState<INewsDataProps['place']['location']>(dataPlace?.location);
    const [place, setPlace] = useState<INewsDataProps['place']['place']>(dataPlace?.place);

    useEffect(() => {
        if (location?.lng && location?.lng && place?.address && place?.city) {
            setDataPlace((prevState) => ({...prevState, location, place}))
        }

        if (location?.lng !== establishmentInfo?.location?.lng || location?.lat !== establishmentInfo?.location?.lat || place?.city !== establishmentInfo?.place?.city || place?.address !== establishmentInfo?.place?.address) {
            setIsEstablishmentLocPlace(false);
        }
    }, [location?.lng, location?.lat, place?.address, place?.city, establishmentInfo]);


    const handlePicturesChange = (e: ChangeEvent<HTMLInputElement> | any) => {
        if (pictures.length > maxImages || e.target.files?.length > maxImages) return alert(translate("home.create.pictures.max") + "6")

        let arr = [] as IPicture[] | File[];
        const items = e.target.files;
        for (let i = 0; i < items?.length; i++) {
            const item = items[i];
            if ((arr?.length + pictures?.length) < maxImages) {
                arr.push(item)
            }
        }
        setPictures((prevState) => ([...prevState, ...arr] as IPicture[] | File[]))
    }
    const handleAddWorkDays = (workSchedule: INewsDateEvent) => {
        if (workSchedule?.schedule?.from || workSchedule?.schedule?.to || workSchedule?.time?.from || workSchedule?.time?.to) {
            if (workSchedule?.schedule?.to && !workSchedule?.schedule?.from) {
                workSchedule.schedule.from = workSchedule.schedule.to
                delete workSchedule['schedule']['to']
            }
            setDateEvent((prevState) => ([...prevState, workSchedule]))
        }
    }
    const handleDeleteWorkDays = (index: number | any) => {
        setDateEvent(dateEvent.filter((_: any, i: any) => i !== index))
    }

    const gridColumn = {xs: 'span 1', sm: 'span 2'};

    const formHelperStyle = {
        fontWeight: 500,
        margin: "10px 0",
        fontSize: {xs: 14, sm: 16},
        color: 'common.white',
    }


    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setIsEstablishmentLocPlace(checked);
        if (checked) {
            setLocation(establishmentInfo?.location)
            setPlace(establishmentInfo?.place)
        } else {
            setLocation({} as INewsDataProps['place']['location']);
            setPlace({} as INewsDataProps['place']['place'])
        }
    };

    const handleClearLocation = () => {
        setIsEstablishmentLocPlace(false);
        setDataPlace({isPlace: false} as INewsDataProps['place']);
        setLocation({} as INewsDataProps['place']['location']);
        setPlace({} as INewsDataProps['place']['place'])}

    return (
        <Box>
            <Box
                sx={{
                    // p: '5px',
                    // borderRadius: '15px',
                    // bgcolor: mode === "dark" ? "#2e424d" : "#fcfcfc",
                    transition: 'all 300ms linear',
                }}
            >
                <form
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                    onSubmit={handleSubmit(onFinishHandler)}
                >
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)'},
                        gap: 2,
                        alignItems: 'start',
                        p: '10px',
                        borderRadius: '10px',
                        bgcolor: mode === 'dark' ? '#1f1f1f' : '#f6f6f6',
                    }}>
                        <FormControl fullWidth
                                     sx={{
                                         gridColumn: gridColumn
                                     }}
                        >
                            <SearchEstablishments
                                typeSearch={'userEstablishments'} searchEstablishment={establishmentInfo}
                                setSearchEstablishment={setEstablishmentInfo}/>
                        </FormControl>
                    </Box>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)'},
                        gap: 2,
                        alignItems: 'start'
                    }}>
                        <FormControl fullWidth>
                            <FormHelperText
                                sx={{
                                    ...formHelperStyle
                                }}
                            >
                                {translate("news.create.title")}
                            </FormHelperText>
                            <TextField
                                fullWidth
                                required
                                size={"small"}
                                id="outlined-basic"
                                color={"secondary"}
                                variant="outlined"
                                value={title ? title : ''}
                                onChange={(event) => setTitle(event.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormHelperText
                                sx={{
                                    ...formHelperStyle
                                }}
                            >
                                {translate("posts.fields.category.title")}
                            </FormHelperText>
                            <Select variant={"outlined"} fullWidth size="small" displayEmpty required
                                    inputProps={{'aria-label': 'Without label'}}
                                    sx={{
                                        fontSize: {xs: '12px', sm: '16px'}
                                    }}
                                    value={category ? category : ''}
                                    color={"secondary"}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }>
                                {
                                    ["general", "promotions", "events"].map((type) => (
                                        <MenuItem key={type}
                                                  value={type}>{translate(`news.sortByCategory.${type}`)}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <FormControl sx={{
                            width: '100%',
                            gridColumn: gridColumn,
                        }}>
                            <CustomOpenContentBtn
                                openComponent={dateEvent?.length > 0}
                                openText={translate('news.dateEvent.title')}
                                closeText={translate('buttons.hide')}
                            >
                                <DateTimeList
                                    dataLabel={translate("news.create.date.title")}
                                    onSubmit={handleAddWorkDays}
                                    elements={dateEvent}
                                    onDelete={handleDeleteWorkDays}
                                />
                            </CustomOpenContentBtn>
                        </FormControl>
                        <FormControl sx={{
                            width: '100%',
                            gridColumn: gridColumn,
                        }}>
                            <CustomOpenContentBtn
                                openText={translate('home.create.location.title')}
                                closeText={translate('buttons.hide')}
                            >
                                <Box>
                                    <Box sx={{
                                        color: 'common.white',
                                        fontSize: '14px',
                                        "span.css-a54nzi-MuiSwitch-track": {
                                            backgroundColor: '#a00013'
                                        }
                                    }}>
                                        <Switch
                                            color={'info'}
                                            checked={isEstablishmentLocPlace}
                                            onChange={handleChange}
                                            inputProps={{'aria-label': 'controlled'}}
                                        />
                                        Use establishment location and place
                                    </Box>
                                    <Button
                                        color={'warning'}
                                        variant={'text'}
                                        onClick={handleClearLocation}
                                        sx={{
                                            textTransform: 'inherit'
                                        }}
                                    >
                                        {translate('buttons.clear')}
                                    </Button>
                                </Box>
                                <ChangeLocation
                                    location={location}
                                    setLocation={setLocation}
                                    setPlace={setPlace}
                                    place={place}
                                />
                            </CustomOpenContentBtn>
                        </FormControl>
                        <FormControl sx={{
                            gridColumn: gridColumn
                        }}>
                            <FormHelperText
                                sx={{
                                    ...formHelperStyle
                                }}
                            >
                                {translate("news.create.description")}
                            </FormHelperText>
                            <MDEditor data-color-mode={mode === "dark" ? 'dark' : 'light'}
                                      value={description ? description : ''}
                                      onChange={setDescription as IMDEditor['set']}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <FormHelperText
                                sx={{
                                    ...formHelperStyle
                                }}
                            >
                                {translate("posts.fields.status.title")}
                            </FormHelperText>
                            <Select variant={"outlined"} fullWidth size="small" color={"secondary"} displayEmpty
                                    required
                                    inputProps={{'aria-label': 'Without label'}}
                                    sx={{
                                        fontSize: {xs: '12px', sm: '16px'}
                                    }}
                                    value={status ? status : "published"}
                                    onChange={(e) => {
                                        setStatus(e.target.value as string)
                                    }}>
                                {
                                    [
                                        {
                                            value: 'published'
                                        },
                                        {
                                            value: 'private'
                                        }
                                    ]?.map((item, index) => (
                                        <MenuItem
                                            key={index}
                                            value={item.value}>{translate(`posts.fields.status.${item.value}`)}</MenuItem>
                                    ))
                                }
                            </Select>
                            {
                                status === 'published' && (
                                    <Button
                                        sx={{
                                            my: 1
                                        }}
                                        fullWidth
                                        color={isDatePublished ? "error" : "secondary"}
                                        endIcon={isDatePublished ? '' : <Add/>}
                                        variant={"outlined"}
                                        onClick={() => setIsDatePublished(!isDatePublished)}
                                    >
                                        {translate(isDatePublished ? 'buttons.cancel' : 'news.create.addDate')}
                                    </Button>
                                )
                            }
                            {
                                status === 'published' && isDatePublished && (
                                    <TextField
                                        size={'small'}
                                        color={'secondary'}
                                        type={'datetime-local'}
                                        value={datePublished ?? ''}
                                        onChange={(event) => setDatePublished(event.target.value)}
                                    />
                                    // <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    //     <DemoContainer
                                    //         components={['DateTimePicker']}>
                                    //         <DateTimePicker
                                    //             value={datePublished ? datePublished : ''}
                                    //             onChange={(value) => {
                                    //                 setDatePublished(value)
                                    //             }}
                                    //             sx={{
                                    //                 '& .MuiInputBase-input': {
                                    //                     color: (theme) => theme.palette.secondary.main,
                                    //                 },
                                    //                 '& .MuiInputLabel-root': {
                                    //                     color: (theme) => theme.palette.secondary.main,
                                    //                 },
                                    //                 '& .MuiOutlinedInput-notchedOutline': {
                                    //                     borderColor: (theme) => theme.palette.secondary.main,
                                    //                 },
                                    //                 '&:hover .MuiOutlinedInput-notchedOutline': {
                                    //                     borderColor: (theme) => theme.palette.secondary.main,
                                    //                 },
                                    //             }}
                                    //             label={translate('news.create.publicDate')}
                                    //         />
                                    //     </DemoContainer>
                                    // </LocalizationProvider>
                                )
                            }
                        </FormControl>
                    </Box>
                    <FormControl sx={{
                        bgcolor: mode === 'dark' ? "#1a1313" : '#f4f4f4',
                        borderRadius: '10px',
                        p: '10px',
                        m: '-10px'
                    }}>
                        <FormHelperText
                            sx={{
                                ...formHelperStyle
                            }}
                        >
                            {translate("home.create.pictures.title")}
                        </FormHelperText>
                        <ImageSelector
                            defaultPictures={defaultPictures}
                            maxImages={maxImages} images={pictures}
                            setPictures={setPictures}
                            handleChange={handlePicturesChange}/>

                    </FormControl>
                </form>
            </Box>
        </Box>
    );
};
export default NewsFormData
