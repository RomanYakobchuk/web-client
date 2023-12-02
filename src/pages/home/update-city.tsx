import {useGetLocale, useList, useNotification, useTranslate} from "@refinedev/core";
import {Box, Button, IconButton, TextField} from "@mui/material";
import React, {ChangeEvent, useEffect, useState} from "react";
import {Edit, Replay} from "@mui/icons-material";
import {Image} from "antd";

import {ICity} from "@/components/home/countCities";
import {Loading} from "@/components";
import {axiosInstance} from "@/authProvider";


const UpdateCity = () => {
    const locale = useGetLocale();
    const currentLocale = locale();

    const [allCities, setAllCities] = useState<ICity[]>([] as ICity[]);

    const {data, isLoading} = useList<ICity>({
        resource: "city/allCountCity",
    });

    useEffect(() => {
        if (data?.data) {
            setAllCities(data?.data)
        }
    }, [data]);

    return (
        <Box sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: {xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)'},
            gap: {xs: 2, md: 3},
            // flexWrap: 'wrap',
            maxWidth: '90%',
            margin: '20px auto',

        }}>
            {
                isLoading
                    ? <Loading height={'200px'}/>
                    : (
                        allCities?.length > 0 && allCities?.sort((a, b) => currentLocale === 'ua' ? (a?.name_ua < b?.name_ua ? -1 : 1) : (a?.name_en < b?.name_en ? -1 : 1))?.map((oneCity) => (
                            <OneCityUpdate city={oneCity} key={oneCity?._id}/>
                        ))
                    )
            }
        </Box>
    );
};
export default UpdateCity;

type TPropsOneCity = {
    city: ICity
}
const OneCityUpdate = ({city}: TPropsOneCity) => {

    const {open} = useNotification();

    const translate = useTranslate();

    const [currentCity, setCurrentCity] = useState<ICity>(city);
    const [newNameUa, setNewNameUa] = useState<string>(currentCity?.name_ua || '');
    const [newNameEn, setNewNameEn] = useState<string>(currentCity?.name_en || '');
    const [image, setImage] = useState<File | string>(currentCity?.url || "");

    const handlePictureChange = (e: ChangeEvent<HTMLInputElement> | any) => {
        setImage(e.target.files[0]);
    };

    const reloadImage = () => setImage(currentCity?.url);

    const isNewData = currentCity?.name_ua !== newNameUa || currentCity?.name_en !== newNameEn || image !== currentCity?.url;

    const updateCity = async () => {
        if (isNewData) {
            const formData = new FormData();
            formData.append('name_ua', newNameUa);
            formData.append('name_en', newNameEn);
            formData.append('url', image);

            try {
                const response = await axiosInstance.patch(`/city/updateCityForCount/${city?._id}`, formData);
                if (response?.data) {
                    open?.({
                        type: "success",
                        description: response?.data?.message,
                        message: 'Success'
                    });
                    setCurrentCity(response?.data?.city)
                }
            } catch (e: any) {
                open?.({
                    type: 'error',
                    description: e?.response?.data?.message || e?.response?.data?.error,
                    message: 'Error'
                })
                console.log(e.response)
            }
        }
    }

    const reloadAllData = () => {
        setCurrentCity(city);
        reloadImage();
        setNewNameEn(currentCity?.name_en);
        setNewNameUa(currentCity?.name_ua);
    }

    return (
        <Box sx={{
            // flex: '1 0 200px',
            width: '100%',
            minHeight: {xs: '200px', sm: '250px'},
            display: 'flex',
            height: 'fit-content',
            flexDirection: 'column',
            gap: 1,
            alignItems: 'start',
            bgcolor: 'common.black',
            borderRadius: '25px 25px 10px 10px',
            p: 2
            // aspectRatio: '1.5 / 1',
        }}>
            <Box sx={{
                position: 'relative',
                width: '100%',
                height: '70%',
                "& > div": {
                    width: '100%'
                }
            }}>
                <Image
                    src={image instanceof File ? URL.createObjectURL(image) : image}
                    alt={city?.name_en}
                    id={city?._id}
                    style={{
                        borderRadius: '10px',
                        width: '100%',
                        aspectRatio: '1.5 / 1',
                        // height: '100%',
                        objectFit: 'cover'
                    }}
                />
                <Box sx={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'end',
                    justifyContent: 'end'
                }}>
                    <Button
                        component="label"
                        variant={'contained'}
                        color={'secondary'}
                        sx={{
                            minWidth: '10px'
                        }}
                    >
                        <input
                            hidden
                            accept="image/*"
                            type="file"
                            onChange={handlePictureChange}
                        />
                        <Edit color={'info'}/>
                    </Button>
                    {
                        image !== city?.url && (
                            <IconButton
                                onClick={reloadImage}
                                color={'warning'}
                            >
                                <Replay/>
                            </IconButton>
                        )
                    }
                </Box>
            </Box>
            <TextField
                size={'small'}
                variant={'standard'}
                placeholder={'name_ua'}
                label={'name_ua'}
                value={newNameUa}
                onChange={(e) => setNewNameUa(e.target.value)}
                sx={{
                    width: '100%'
                }}
            />
            <TextField
                size={'small'}
                variant={'standard'}
                placeholder={'name_en'}
                label={'name_en'}
                value={newNameEn}
                onChange={(e) => setNewNameEn(e.target.value)}
                sx={{
                    width: '100%'
                }}
            />
            {
                isNewData && (
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        mt: '20px',
                        justifyContent: 'end',
                        "& button": {
                            textTransform: 'inherit'
                        }
                    }}>
                        <Button
                            onClick={reloadAllData}
                            variant={'contained'}
                            color={'error'}
                        >
                            {translate('buttons.cancel')}
                        </Button>
                        <Button
                            onClick={updateCity}
                            variant={'contained'}
                            color={'info'}
                        >
                            {translate('buttons.save')}
                        </Button>
                    </Box>
                )
            }
        </Box>
    );
};

