import {useList, useTranslate} from "@refinedev/core";
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {AutoComplete, Image, Input, Typography as TypographyAntd} from "antd";
import {Box, FormControl, FormHelperText, IconButton, Typography} from "@mui/material";
import {Clear, PlaceOutlined} from "@mui/icons-material";
import {useDebounce} from "use-debounce";

import {INews, IOptions, PropertyProps} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {ESTABLISHMENT} from "@/config/names";
import {ChooseSavedEstablishment} from "@/components/common/search/establishment/chooseSavedEstablishment";
import {useUserInfo} from "@/hook";

const {Text} = TypographyAntd;
const renderTitle = (title: string) => {
    return (
        <Text strong style={{fontSize: "16px"}}>
            {title}
        </Text>
    );
};

const renderItem = (title: string, street: string, photo: string, _id: string, allInfo: PropertyProps) => {
    return {
        value: title,
        allInfo,
        id: _id,
        label: (
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'start',
                    width: '100%'
                }}
                key={_id + title + Math.floor(Math.random() * 1000)}
            >
                <img src={photo} style={{
                    width: '60px',
                    height: '40px',
                    borderRadius: '5px',
                    objectFit: 'cover'
                }} alt={title}/>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5
                }}>
                    <Text style={{
                        textTransform: 'capitalize',
                        fontSize: '16px'
                    }}>
                        {title}
                    </Text>
                    <Text style={{
                        fontSize: '12px'
                    }}>
                        {street}
                    </Text>
                </Box>
            </Box>
        ),
    };
};

interface IProps {
    searchEstablishment: PropertyProps,
    setSearchEstablishment: Dispatch<SetStateAction<PropertyProps | null>>,
    typeSearch: 'userEstablishments' | string,
    showEstablishmentInfo?: boolean,
    showEstablishmentInfoLabel?: boolean,
    showSearchLabel?: boolean,
    isOnlyShowInfo?: boolean,
    isCanClear?: boolean,
    isChooseFromSaved?: boolean
}

const SearchEstablishments = ({
                                  typeSearch,
                                  searchEstablishment,
                                  setSearchEstablishment,
                                  showEstablishmentInfo = true,
                                  showEstablishmentInfoLabel = true,
                                  showSearchLabel = true,
                                  isOnlyShowInfo = false,
                                  isCanClear = false,
                                  isChooseFromSaved = false
                              }: IProps) => {

    const {mode} = useContext(ColorModeContext);
    const {user} = useUserInfo();
    const translate = useTranslate();

    const [searchPlaceInput, setSearchPlaceInput] = useState<string>('');
    const [data, setData] = useState<PropertyProps[]>([] as PropertyProps[]);
    const [searchInputValue, setSearchInputValue] = useState<string>('');
    const [options, setOptions] = useState<IOptions[]>([]);
    const [currentEstablishment, setCurrentEstablishment] = useState<{ title: string, _id: string } | null>(null);

    const [value] = useDebounce(searchPlaceInput, 500);
    const onSearch = (value: string) => {
        setSearchInputValue(value)
        setSearchPlaceInput(value)
    }
    useEffect(() => {
        if (searchEstablishment?._id !== currentEstablishment?._id || !currentEstablishment?.title) {
            setCurrentEstablishment(searchEstablishment)
        }
    }, [searchEstablishment]);
    const {refetch,} = useList<PropertyProps>({
        resource: `${ESTABLISHMENT}/${typeSearch}`,
        filters: [{field: 'title', operator: 'eq', value: value}],
        queryOptions: {
            enabled: false,
            onSuccess: (data) => {
                const establishmentsOptionGroup = data.data.map((item) => {
                        setData(data?.data)
                        return (
                            renderItem(item.title, item.place.address, item.pictures[0].url, item._id, item)
                        )
                    }
                )
                if (establishmentsOptionGroup.length > 0) {
                    setOptions((prevState) => [
                        ...prevState,
                        {
                            label: renderTitle(translate('establishment.establishment')),
                            options: establishmentsOptionGroup
                        }
                    ])
                }
            }
        }
    });
    useEffect(() => {
        if (data?.length > 0) {
            for (const item of data) {
                if (item?._id === searchEstablishment?._id) {
                    setSearchEstablishment(item)
                }
            }
        }
    }, [data, searchEstablishment]);

    useEffect(() => {
        setOptions([]);
        const fetchData = async () => {
            await refetch();
        };
        fetchData();
    }, [value]);

    useEffect(() => {
        if (currentEstablishment?.title) {
            setSearchInputValue(currentEstablishment.title);
            setSearchPlaceInput(currentEstablishment.title)
        }
    }, [currentEstablishment?.title]);

    const handleClear = () => {
        if (isCanClear) {
            setCurrentEstablishment(null);
            setSearchEstablishment(null);
            setSearchPlaceInput("");
            setSearchInputValue("");
        }
    }

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: {xs: 'column', sm: 'row'},
            gap: showEstablishmentInfo ? 2 : 0,

        }}>
            {
                !isOnlyShowInfo && (
                    <FormControl
                        id={'searchEstablishmentFromControl'}
                        fullWidth
                    >
                        {
                            showSearchLabel && (
                                <FormHelperText
                                    sx={{
                                        fontWeight: 500,
                                        margin: "10px 0",
                                        fontSize: {xs: 14, sm: 16},
                                        color: 'common.white',
                                    }}
                                >
                                    {translate("home.one")}
                                </FormHelperText>
                            )
                        }
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                gap: isCanClear ? 1 : 0,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <AutoComplete
                                style={{
                                    color: mode === "dark" ? "#fcfcfc" : "#000",
                                    width: '100%'
                                }}
                                options={options}
                                value={searchPlaceInput}
                                disabled={isOnlyShowInfo}
                                filterOption={false}
                                onSearch={onSearch}
                                onSelect={(selectValue, option) => {
                                    const {allInfo} = option;
                                    setSearchEstablishment((prev) => ({...prev as PropertyProps, ...allInfo}))
                                    setSearchPlaceInput(selectValue);
                                    setSearchInputValue(selectValue)
                                }}
                            >
                                <Input
                                    value={searchInputValue}
                                    onChange={(e) => {
                                        setSearchPlaceInput(e.target.value)
                                    }}
                                    size={'large'}
                                    style={{
                                        background: "transparent",
                                        color: mode === "dark" ? "#fcfcfc" : "#000"
                                    }}
                                />
                            </AutoComplete>
                            {
                                isCanClear && (
                                    <IconButton
                                        onClick={handleClear}
                                    >
                                        <Clear/>
                                    </IconButton>
                                )
                            }
                        </Box>
                        {
                            isChooseFromSaved && (
                                <Box sx={{
                                    width: '100%',
                                    mt: 1
                                }}>
                                    <ChooseSavedEstablishment
                                        parentQuerySelectorForSetWidth={'#searchEstablishmentFromControl'}
                                        checkedItem={searchEstablishment}
                                        setCheckedItem={setSearchEstablishment as Dispatch<SetStateAction<PropertyProps | null | INews>>}
                                        userId={user?._id}
                                    />
                                </Box>
                            )
                        }
                    </FormControl>
                )
            }
            {
                showEstablishmentInfo && (
                    <FormControl fullWidth>
                        {
                            showEstablishmentInfoLabel && (
                                <FormHelperText
                                    sx={{
                                        fontWeight: 500,
                                        margin: "10px 0",
                                        fontSize: {xs: 14, sm: 16},
                                        color: 'common.white',
                                    }}
                                >
                                    {translate("buttons.details")}
                                </FormHelperText>
                            )
                        }
                        {
                            searchEstablishment?._id && (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1
                                }}>
                                    <Box sx={{
                                        width: '100%',
                                        maxWidth: '350px',
                                        height: {xs: '200px', sm: '250px', md: '300px'},
                                        "& img": {
                                            borderRadius: '10px',
                                            objectFit: 'cover'
                                        }
                                    }}>
                                        {
                                            searchEstablishment?.pictures?.length > 0 && (
                                                <Image
                                                    src={searchEstablishment?.pictures[0]?.url}
                                                    width={'100%'}
                                                    height={'100%'}
                                                />
                                            )
                                        }
                                    </Box>
                                    <Box sx={{
                                        color: 'common.white',
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2
                                    }}>
                                        <Typography
                                            sx={{
                                                fontSize: {xs: '18px', md: '20px'},
                                                fontWeight: 600
                                            }}
                                        >
                                            {searchEstablishment?.title}
                                        </Typography>
                                        <span>
                                            {translate(`home.sortByType.${searchEstablishment?.type}`)}
                                        </span>
                                    </Box>
                                    <Box sx={{
                                        color: 'common.white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <PlaceOutlined
                                            sx={{
                                                fontSize: '30px'
                                            }}
                                        />
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 0.5
                                        }}>
                                    <span>
                                        {searchEstablishment?.place?.city}
                                    </span>
                                            <span>
                                        {searchEstablishment?.place?.address}
                                    </span>
                                        </Box>
                                    </Box>
                                </Box>
                            )
                        }
                    </FormControl>
                )
            }
        </Box>
    );
};
export default SearchEstablishments;
