import {useList} from "@refinedev/core";
import {useContext, useEffect, useState} from "react";
import {AutoComplete, Input, Typography as TypographyAntd} from "antd";
import {Box, FormControl} from "@mui/material";
import {useDebounce} from "use-debounce";

import {IOptions} from "../../interfaces/common";
import {ColorModeContext} from "../../contexts";

const {Text} = TypographyAntd;
const renderTitle = (title: string) => {
    return (
        <Text strong style={{fontSize: "16px"}}>
            {title}
        </Text>
    );
};

const renderItem = (title: string, street: string, photo: string, _id: string) => {
    return {
        value: title,
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
    searchInstitution: { _id: string, title: string },
    setSearchInstitution: (value: { _id: string, title: string }) => void,
    typeSearch: string
}

const SearchInstitutions = ({typeSearch, searchInstitution, setSearchInstitution}: IProps) => {

    const {mode} = useContext(ColorModeContext);

    const [searchPlaceInput, setSearchPlaceInput] = useState<string>('');
    const [searchInputValue, setSearchInputValue] = useState<string>('');
    const [options, setOptions] = useState<IOptions[]>([]);
    const [currentInstitution, setCurrentInstitution] = useState({title: '', _id: ''});

    const [value] = useDebounce(searchPlaceInput, 500);
    const onSearch = (value: string) => {
        setSearchInputValue(value)
        setSearchPlaceInput(value)
    }
    useEffect(() => {
        if (searchInstitution?._id) {
            setCurrentInstitution({title: searchInstitution?.title, _id: searchInstitution?._id})
        }
    }, [searchInstitution]);

    const {refetch, isLoading, isError} = useList({
        resource: `institution/${typeSearch}`,
        filters: [{field: 'title', operator: 'contains', value: value}],
        queryOptions: {
            enabled: false,
            onSuccess: (data) => {
                const institutionsOptionGroup = data.data.map((item: any) => {
                        return (
                            renderItem(item.title, item.place.address, item.pictures[0].url, item._id)
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
    }, [currentInstitution]);

    return (
        <Box sx={{
            width: '100%'
        }}>
            <FormControl fullWidth>
                <AutoComplete
                    style={{
                        color: mode === "dark" ? "#fcfcfc" : "#000",
                        width: '100%'
                    }}
                    options={options}
                    value={searchPlaceInput}
                    filterOption={false}
                    onSearch={onSearch}
                    onSelect={(selectValue, option) => {
                        const {id, value} = option;
                        setSearchInstitution({title: value as string, _id: id as string})
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
        </Box>
    );
};
export default SearchInstitutions;
