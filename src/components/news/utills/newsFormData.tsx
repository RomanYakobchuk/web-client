import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    MenuItem,
    Select, TextareaAutosize, TextField,
    Typography
} from "@mui/material";
import {Add, ArrowBackIosNew,} from "@mui/icons-material";
import React, {ChangeEvent, useContext} from "react";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {useTranslate} from "@refinedev/core";
import {useNavigate} from "react-router-dom";

import {CustomButton} from "../../index";
import ImageSelector from "../../establishment/utills/ImageSelector";
import {ColorModeContext} from "../../../contexts";
import {useMobile} from "../../../utils";
import {INewsDataProps} from "interfaces/common";
import SearchInstitutions from "../../search/searchInstitutions";

const NewsFormData = ({
                          title,
                          setCurrentInstitutionId,
                          formLoading,
                          currentInstitutionId,
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
                          workDays,
                          category,
                          setCategory,
                          setTitle,
                          setWorkDays,
                          datePublished, setDatePublished
                      }: INewsDataProps) => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const {mode} = useContext(ColorModeContext);
    const {device, width} = useMobile();

    const handlePicturesChange = (e: ChangeEvent<HTMLInputElement> | any) => {
        if (6 < pictures.length) return alert(translate("home.create.pictures.max") + "6")
        if (6 < e.target.files?.length) return alert(translate("home.create.pictures.max") + "6");

        let arr = [];
        const items = e.target.files;
        for (let i = 0; i < items?.length; i++) {
            const item = items[i];
            arr.push(item)
        }
        setPictures([...arr])
    }

    const handleAddWorkDays = (workSchedule: any) => {
        setWorkDays([...workDays, workSchedule])
    }
    const handleDeleteWorkDays = (index: number | any) => {
        setWorkDays(workDays.filter((_: any, i: any) => i !== index))
    }

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: "start",
                gap: {xs: '10%', sm: '30%', md: '40%'}
            }}>
                <Button
                    variant={"outlined"}
                    onClick={() => navigate(-1)}
                    color={'secondary'}>
                    <ArrowBackIosNew/>
                </Button>
                <Typography fontSize={{xs: '18px', sm: '22px'}} fontWeight={700} textAlign={"center"}>
                    {translate("news.button")}
                </Typography>
            </Box>

            <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor={mode === "dark" ? "#2e424d" : "#fcfcfc"}>
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
                        display: 'flex',
                        flexDirection: {xs: 'column', sm: 'row'},
                        alignItems: "end",
                        gap: {xs: 3, sm: 2}
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'start',
                            width: '100%',
                            gap: 2,
                        }}>
                            <FormControl fullWidth>
                                <SearchInstitutions typeSearch={'userInstitutions'} searchPlace={currentInstitutionId}
                                                    setSearchPlace={setCurrentInstitutionId}/>
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    label={translate("news.create.title")}
                                    required
                                    size={"small"}
                                    id="outlined-basic"
                                    color={"secondary"}
                                    variant="outlined"
                                    value={title ? title : ''}
                                    onChange={(event) => setTitle(event.target.value)}
                                />
                            </FormControl>
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
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', sm: 'row'},
                        gap: 2,
                        justifyContent: {sm: 'space-between'}
                    }}>
                        {/*<DateTimeList dataLabel={translate("news.create.date.title")} onSubmit={handleAddWorkDays}*/}
                        {/*              elements={workDays} onDelete={handleDeleteWorkDays}/>*/}
                        <FormControl sx={{
                            width: {xs: '100%', sm: '50%'}
                        }}>
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
                            {translate("posts.fields.status.title")}
                        </FormHelperText>
                        <Select variant={"outlined"} fullWidth size="small" color={"secondary"} displayEmpty required
                                inputProps={{'aria-label': 'Without label'}}
                                sx={{
                                    fontSize: {xs: '12px', sm: '16px'}
                                }}
                                value={status ? status : ""}
                                onChange={(e) => {
                                    setStatus(e.target.value)
                                }}>
                            <MenuItem value={"published"}>{translate(`posts.fields.status.published`)}</MenuItem>
                            <MenuItem value={"private"}>{translate(`posts.fields.status.private`)}</MenuItem>
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
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={['DateTimePicker']}>
                                        <DateTimePicker
                                            value={datePublished ? datePublished : ''}
                                            onChange={(value) => {
                                                setDatePublished(value)
                                            }}
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    color: (theme) => theme.palette.secondary.main,
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: (theme) => theme.palette.secondary.main,
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: (theme) => theme.palette.secondary.main,
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: (theme) => theme.palette.secondary.main,
                                                },
                                            }}
                                            label={translate('news.create.publicDate')}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            )
                        }
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
                            {translate("home.create.pictures.title")}
                        </FormHelperText>
                        <ImageSelector
                            defaultPictures={[]}
                            maxImages={8} images={pictures}
                            setPictures={setPictures}
                            handleChange={handlePicturesChange}/>

                    </FormControl>
                    <FormControl sx={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: 'center'
                    }}>
                        <CustomButton
                            width={"38%"}
                            title={translate("profile.edit.cancel")}
                            backgroundColor="red"
                            color="#fcfcfc"
                            handleClick={() => navigate("/news")}
                        />
                        <CustomButton
                            type="submit"
                            width={"60%"}
                            title={formLoading ? <CircularProgress/> : translate("profile.edit.save")}
                            backgroundColor="#475be8"
                            color="#fcfcfc"
                        />
                    </FormControl>
                </form>
            </Box>
        </Box>
    );
};
export default NewsFormData
