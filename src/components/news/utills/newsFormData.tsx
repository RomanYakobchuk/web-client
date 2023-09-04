import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    MenuItem,
    Select, TextareaAutosize, TextField,
} from "@mui/material";
import {Add} from "@mui/icons-material";
import React, {ChangeEvent, useContext} from "react";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {useTranslate} from "@refinedev/core";

import ImageSelector from "../../establishment/utills/ImageSelector";
import {ColorModeContext} from "../../../contexts";
import {INewsDataProps, IPicture} from "interfaces/common";
import SearchInstitutions from "../../search/searchInstitutions";
import DateTimeList from "./dateTimeList";
import dayjs from "dayjs";

const NewsFormData = (props: INewsDataProps) => {
    const {
        title,
        setInstitutionId,
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
        institutionId,
        setTitle,
        setDateEvent,
        datePublished, setDatePublished,
        defaultPictures
    } = props;
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const maxImages = 6;
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
    const handleAddWorkDays = (workSchedule: any) => {
        setDateEvent((prevState) => ([...prevState, workSchedule]))
    }
    const handleDeleteWorkDays = (index: number | any) => {
        setDateEvent(dateEvent.filter((_: any, i: any) => i !== index))
    }

    return (
        <Box>
            <Box borderRadius="15px" padding="20px" bgcolor={mode === "dark" ? "#2e424d" : "#fcfcfc"}>
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
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)'},
                        gap: 2,
                        alignItems: 'start'
                    }}>
                        <FormControl fullWidth>
                            <FormHelperText
                                sx={{
                                    fontWeight: 500,
                                    margin: "10px 0",
                                    fontSize: {xs: 12, sm: 16},
                                    color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                }}
                            >
                                {translate("home.one")}
                            </FormHelperText>
                            <SearchInstitutions
                                typeSearch={'userInstitutions'} searchInstitution={institutionId}
                                setSearchInstitution={setInstitutionId}/>
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
                                    fontWeight: 500,
                                    margin: "10px 0",
                                    fontSize: {xs: 12, sm: 16},
                                    color: mode === "dark" ? "#fcfcfc" : "#11142D",
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
                        {/*<DateTimeList dataLabel={translate("news.create.date.title")} onSubmit={handleAddWorkDays}*/}
                        {/*              elements={workDays} onDelete={handleDeleteWorkDays}/>*/}
                        <FormControl>
                            <FormHelperText
                                sx={{
                                    fontWeight: 500,
                                    margin: "10px 0",
                                    fontSize: {xs: 12, sm: 16},
                                    color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                }}
                            >
                                {translate("news.create.description")}
                            </FormHelperText>
                            <TextareaAutosize
                                minRows={5}
                                required
                                style={{
                                    width: "100%",
                                    background: "transparent",
                                    fontSize: "16px",
                                    resize: 'vertical',
                                    minHeight: '100px',
                                    maxHeight: '200px',
                                    height: '100px',
                                    borderRadius: 6,
                                    padding: 10,
                                    color: mode === "dark" ? "#fcfcfc" : "#000",
                                }}
                                id="outlined-basic"
                                color={"secondary"}
                                value={description ? description : ''}
                                onChange={(event) => setDescription(event.target.value)}
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
