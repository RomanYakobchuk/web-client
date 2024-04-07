import React, {ChangeEvent, useContext, useEffect} from "react";
import {useGetIdentity, useTranslate} from "@refinedev/core";
import {
    Box,
    FormControl,
    FormHelperText, TextField, Typography,
} from "@mui/material";
import {Switch} from "antd";

import {ChooseCuisine} from "@/components/common/search/establishment/chooseCuisine";
import {IGetIdentity, IPicture, IWorkDay, ProfileProps} from "@/interfaces/common";
import {CustomMDEditor} from "@/components/common/textEditor/CustomMDEditor";
import {HeadlessSelect} from "@/components/headlessUI/headlessSelect";
import ChangeLocation from "@/components/google/changeLocation";
import {IEstablishmentFormProps} from "@/interfaces/formData";
import ItemsList from "./utills/lists/dataPropertyList";
import ScheduleList from "./utills/lists/scheduleList";
import ImageSelector from "./utills/ImageSelector";
import {ColorModeContext} from "@/contexts";
import {textFieldStyle} from "@/styles";
import {SearchManager} from "../index";


const DataForm = (props: IEstablishmentFormProps) => {
    const {
        handleSubmit,
        onFinishHandler,
        state,
        // searchInputValue,
        // setSearchInputValue,
        // searchManagerInput,
        // setSearchManagerInput,
        defaultPictures,
        handleChange,
    } = props;
    const {
        cuisine,
        workScheduleWeekend,
        workDays,
        type,
        title,
        createdBy,
        tags,
        place,
        location,
        averageCheck,
        pictures,
        features,
        sendNotifications,
        description,
        contacts
    } = state;
    const maxImages = 10;
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const currentUser: ProfileProps = identity?.user as ProfileProps;

    useEffect(() => {
        if (currentUser?.status !== 'admin') {
            handleChange("createdBy", currentUser?._id)
        }
    }, [currentUser]);

    const handleAddWorkDays = (workSchedule: IWorkDay) => {
        handleChange("workDays", [...workDays, workSchedule])
    }
    const handleDeleteWorkDays = (index: number | any) => {
        handleChange("workDays", workDays.filter((_: any, i: any) => i !== index))
    }

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
        handleChange("pictures", [...pictures, ...arr]);
    }

    const typeOptions = [
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
    ];
    const currentTypeValue = typeOptions?.find((value) => value?.value === type);


    return (
        <Box
            sx={{
                p: {sm: 1},
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
                    "& p.MuiFormHelperText-root": {
                        fontSize: 16,
                        fontWeight: 500,
                        margin: "10px 0",
                        color: 'common.white',
                    }
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
                        gap: 1,
                        alignItems: 'start'
                    }}>
                        <FormControl fullWidth>
                            <FormHelperText
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
                                onChange={(event) => handleChange("title", event.target.value)}
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
                                        m: '10px 0',
                                        lineHeight: 'normal'
                                    }}
                                >
                                    {/*{translate('home.create.location.title')}*/}
                                    User
                                </FormHelperText>
                                <SearchManager setCreatedBy={(item) => handleChange("createdBy", item)}
                                               createdBy={createdBy}/>
                            </FormControl>
                        }
                        <FormControl fullWidth>
                            <FormHelperText
                            >
                                {translate("home.create.type.title")}
                            </FormHelperText>
                            <HeadlessSelect
                                btnWidth={'100%'}
                                options={typeOptions}
                                setSortBy={(value) => handleChange("type", value)}
                                current={currentTypeValue}
                            />
                            {
                                type === 'restaurant' && (
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        width: '100%',
                                        mt: 1,
                                        justifyContent: 'space-between'
                                    }}>
                                        <FormHelperText
                                            sx={{
                                                fontWeight: 500,
                                                width: 'fit-content',
                                                margin: "10px 0",
                                                fontSize: 16,
                                                height: '19px',
                                                color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                            }}
                                        >
                                            {translate("cuisine.title")}
                                        </FormHelperText>
                                        <ChooseCuisine
                                            current={cuisine}
                                            setCurrent={(value) => handleChange("cuisine", value)}
                                            position={'right'}
                                            styles={{width: '200px'}}
                                        />
                                    </Box>
                                )
                            }
                        </FormControl>
                    </Box>
                </Box>
                <FormControl fullWidth>
                    <FormHelperText
                        sx={{
                            margin: "10px 0",
                        }}
                    >
                        {translate("home.create.description")}
                    </FormHelperText>
                    <CustomMDEditor
                        isDefaultStyles={false}
                        value={description}
                        setValue={(value) => handleChange("description", value)}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <FormHelperText
                        sx={{
                            margin: "10px 0",
                        }}
                    >
                        {translate("home.create.location.title")}
                    </FormHelperText>
                    <ChangeLocation
                        location={location}
                        setLocation={(value) => handleChange("location", value)}
                        setPlace={(item) => handleChange("place", item)}
                        place={place}/>
                </FormControl>
                <ScheduleList
                    dataLabel={translate("home.create.workSchedule.workDays.title")}
                    label={translate("home.create.workSchedule.weekend.title")}
                    onSubmit={handleAddWorkDays}
                    onDelete={handleDeleteWorkDays}
                    onSubmitWeekend={(item) => handleChange("workScheduleWeekend", item)}
                    workScheduleWeekend={workScheduleWeekend}
                    elements={workDays ? workDays : []}
                />
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {xs: '1fr', md: 'repeat(2, 1fr)'},
                    width: '100%',
                    alignItems: 'start',
                    gap: 1,
                    "& > div.MuiFormControl-root": {
                        p: 2,
                        bgcolor: 'modern.modern_4.main',
                        borderRadius: '16px'
                    }
                }}>
                    <FormControl fullWidth>
                        <ItemsList
                            elements={contacts}
                            label={translate('home.create.contacts')}
                            setData={(value) => handleChange("contacts", value)}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <ItemsList
                            elements={tags}
                            label={translate('home.create.tags')}
                            setData={(value) => handleChange("tags", value)}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <ItemsList
                            elements={features}
                            label={translate('home.create.features')}
                            setData={(value) => handleChange("features", value)}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            fullWidth
                            required
                            label={translate("home.create.averageCheck")}
                            id="outlined-basic"
                            color={"secondary"}
                            type={"number"}
                            size={"small"}
                            sx={textFieldStyle}
                            inputProps={{
                                min: 0
                            }}
                            variant="outlined"
                            value={averageCheck ? averageCheck : ''}
                            onChange={(event) => handleChange("averageCheck", event.target.value)}
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
                        onChange={(checked) => handleChange("sendNotifications", checked)}
                    />
                    <Typography
                        sx={{
                            color: 'common.white'
                        }}
                    >
                        {translate('notification.send')}
                    </Typography>
                </FormControl>
                <FormControl>
                    <FormHelperText
                        sx={{
                            margin: "10px 0",
                        }}
                    >
                        {translate("home.create.pictures.title")}
                    </FormHelperText>
                    <ImageSelector
                        maxImages={maxImages} images={pictures as [IPicture | File]}
                        defaultPictures={defaultPictures}
                        setPictures={(value) => handleChange("pictures", value)}
                        handleChange={handlePicturesChange}/>

                </FormControl>
            </Box>
        </Box>
    );
};
export default DataForm;
