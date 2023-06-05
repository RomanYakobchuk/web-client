import {useList, useTranslate} from "@refinedev/core";
import React, {useContext, useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {AutoComplete, Input, Typography as TypographyAntd} from "antd";

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

const renderItem = (title: string, resource: string, id: number) => {
    return {
        value: title,
        label: (
            <Text style={{
                textTransform: 'capitalize'
            }}>
                {title}
            </Text>
        ),
    };
};

interface IProps {
    searchCity: string,
    setSearchCity: (value: string | any) => void,
}

const SearchCity = ({setSearchCity, searchCity}: IProps) => {

    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    const [searchCityInput, setSearchCityInput] = useState<string>("");
    const [searchInputValue, setSearchInputValue] = useState<string>("");
    const [options, setOptions] = useState<IOptions[]>([]);
    const [currentCity, setCurrentCity] = useState('');
    const [value] = useDebounce(searchCityInput, 500);

    const {refetch: refetchCities, isLoading: citiesIsLoading} = useList<any>({
        resource: 'city/all',
        filters: [{field: 'city', operator: 'contains', value: value}],
        queryOptions: {
            enabled: false,
            onSuccess: (data) => {
                const citiesOptionGroup = data.data.map((item) => {
                        if (searchCity === item.name) {
                            setCurrentCity(item.name)
                        }
                        return (
                            renderItem(item.name, translate("cities.cities"), item._id)
                        )
                    }
                )
                if (citiesOptionGroup.length > 0) {
                    setOptions((prevState) => [
                        ...prevState,
                        {
                            label: renderTitle(translate("cities.cities")),
                            options: citiesOptionGroup
                        }
                    ])
                }
            }
        }
    });

    const onSearch = (value: string) => {
        setSearchInputValue(value)
        setSearchCityInput(value)
    }

    useEffect(() => {
        setOptions([]);
        (async () => {
            await refetchCities();
        })()
    }, [value]);

    useEffect(() => {
        if (currentCity) {
            setSearchInputValue(currentCity);
            setSearchCityInput(currentCity);
        }
    }, [currentCity])

    return (
        <AutoComplete
            style={{
                width: '100%',
                color: mode === "dark" ? "#fcfcfc" : "#000"
            }}
            options={options}
            value={searchCityInput}
            filterOption={false}
            onSearch={onSearch}
            onSelect={(value) => {
                setSearchCity(value);
                setSearchCityInput(value);
                setSearchInputValue(value);
            }}
        >
            <Input
                value={searchInputValue}
                onChange={(e) => setSearchCityInput(e.target.value)}
                size={"large"}
                style={{
                    background: "transparent",
                    color: mode === "dark" ? "#fcfcfc" : "#000"
                }}
            />
        </AutoComplete>
    );
};
export default SearchCity;
