import {useList, useTranslate} from "@refinedev/core";
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {AutoComplete, Image, Input, Typography as TypographyAntd} from "antd";
import {Box, FormControl, FormHelperText, Typography} from "@mui/material";
import {useDebounce} from "use-debounce";
import {PlaceOutlined} from "@mui/icons-material";

import {IOptions, PropertyProps} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";

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
            <Box sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'start',
                width: '100%'
            }}>
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
    searchInstitution: PropertyProps,
    setSearchInstitution: Dispatch<SetStateAction<PropertyProps>>,
    typeSearch: 'userInstitutions' | string,
    showEstablishmentInfo?: boolean,
    showEstablishmentInfoLabel?: boolean,
    showSearchLabel?: boolean,
    isOnlyShowInfo?: boolean
}

const SearchInstitutions = ({
                                typeSearch,
                                searchInstitution,
                                setSearchInstitution,
                                showEstablishmentInfo = true,
                                showEstablishmentInfoLabel = true,
                                showSearchLabel = true,
                                isOnlyShowInfo = false
                            }: IProps) => {

    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    const [searchPlaceInput, setSearchPlaceInput] = useState<string>('');
    const [data, setData] = useState<PropertyProps[]>([] as PropertyProps[]);
    const [searchInputValue, setSearchInputValue] = useState<string>('');
    const [options, setOptions] = useState<IOptions[]>([]);
    const [currentInstitution, setCurrentInstitution] = useState({title: '', _id: ''});

    const [value] = useDebounce(searchPlaceInput, 500);
    const onSearch = (value: string) => {
        setSearchInputValue(value)
        setSearchPlaceInput(value)
    }
    useEffect(() => {
        if (searchInstitution?._id !== currentInstitution?._id || !currentInstitution?.title) {
            setCurrentInstitution(searchInstitution)
        }
    }, [searchInstitution]);
    const {refetch,} = useList<PropertyProps>({
        resource: `institution/${typeSearch}`,
        filters: [{field: 'title', operator: 'contains', value: value}],
        queryOptions: {
            enabled: false,
            onSuccess: (data) => {
                const institutionsOptionGroup = data.data.map((item) => {
                        setData(data?.data)
                        return (
                            renderItem(item.title, item.place.address, item.pictures[0].url, item._id, item)
                        )
                    }
                )
                if (institutionsOptionGroup.length > 0) {
                    setOptions((prevState) => [
                        ...prevState,
                        {
                            label: renderTitle('Institutions'),
                            options: institutionsOptionGroup
                        }
                    ])
                }
            }
        }
    });
    useEffect(() => {
        if (data?.length > 0) {
            for (const item of data) {
                if (item?._id === searchInstitution?._id) {
                    setSearchInstitution(item)
                }
            }
        }
    }, [data, searchInstitution]);

    useEffect(() => {
        setOptions([]);
        const fetchData = async () => {
            await refetch();
        };
        fetchData();
    }, [value]);

    useEffect(() => {
        if (currentInstitution?.title) {
            setSearchInputValue(currentInstitution.title);
            setSearchPlaceInput(currentInstitution.title)
        }
    }, [currentInstitution?.title]);

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: {xs: 'column', sm: 'row'},
            gap: showEstablishmentInfo ? 2 : 0
        }}>
            {
                !isOnlyShowInfo && (
                    <FormControl fullWidth>
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
                                setSearchInstitution((prev) => ({...prev, ...allInfo}))
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
                            searchInstitution?._id && (
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
                                            searchInstitution?.pictures?.length > 0 && (
                                                <Image
                                                    src={searchInstitution?.pictures[0]?.url}
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
                                            {searchInstitution?.title}
                                        </Typography>
                                        <span>
                                            {translate(`home.sortByType.${searchInstitution?.type}`)}
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
                                        {searchInstitution?.place?.city}
                                    </span>
                                            <span>
                                        {searchInstitution?.place?.address}
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
export default SearchInstitutions;
