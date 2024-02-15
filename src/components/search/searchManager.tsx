import {AutoComplete, Input, Typography as TypographyAntd} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {useGetIdentity, useList, useTranslate} from "@refinedev/core";

import {ColorModeContext} from "../../contexts";
import {IOptionGroup, IOptions, ProfileProps} from "../../interfaces/common";
import {debounce} from "@mui/material";
import {useDebounce} from "use-debounce";


const {Text} = TypographyAntd;
const renderTitle = (title: string) => {
    return (
        <Text strong style={{fontSize: "16px"}}>
            {title}
        </Text>
    );
};

const renderItem = (name: string, resource: string, id: string, userId: string) => {
    return {
        userId: userId,
        value: name,
        label: (
            <Text style={{
                textTransform: 'capitalize'
            }}>
                {name}
            </Text>
        ),
    };
};

interface IProps {
    createdBy: string,
    setCreatedBy: (item: string) => void
}

const SearchManager = ({setCreatedBy, createdBy}: IProps) => {
    const {mode} = useContext(ColorModeContext);
    const {data: currentUser} = useGetIdentity<ProfileProps>();
    const translate = useTranslate();

    const [options, setOptions] = useState<IOptions[]>([]);
    const [searchManagerInput, setSearchManagerInput] = useState<string>("");
    const [searchInputValue, setSearchInputValue] = useState<string>("");

    const [value] = useDebounce(searchManagerInput, 500);
    const [currentUserName, setCurrentUserName] = useState('');
    useEffect(() => {
        if (currentUser?.status !== 'admin') {
            setCreatedBy(currentUser?._id as string)
        }
    }, [currentUser]);

    const onSearch = (value: string) => {
        setSearchInputValue(value)
        setSearchManagerInput(value)
    }

    const {refetch: refetchManagers} = useList<any>({
        resource: 'managers/all',
        config: {
            filters: [{field: 'manager', operator: 'contains', value: value}]
        },
        queryOptions: {
            enabled: false,
            onSuccess: (data) => {
                const managersOptionGroup: IOptionGroup[] = data.data.map((item) => {
                        if (createdBy === item?.user?._id) {
                            setCurrentUserName(item?.user?.name)
                        }
                        return (
                            renderItem(item.user.name, translate("cities.cities"), item._id, item.user._id)
                        )
                    }
                )
                if (managersOptionGroup.length > 0) {
                    setOptions((prevState) => [
                        ...prevState,
                        {
                            label: renderTitle(translate("cities.cities")),
                            options: managersOptionGroup,
                        }
                    ])
                }
            }
        }
    });

    useEffect(() => {
        if (currentUser?.status === 'admin') {
            setOptions([]);
            (async () => {
                await refetchManagers();
            })();
        }
    }, [currentUser?.status, value])

    useEffect(() => {
        if (currentUserName) {
            setSearchInputValue(currentUserName)
            setSearchManagerInput(currentUserName)
        }
    }, [currentUserName])
    return (
        <div>
            <AutoComplete
                style={{
                    width: '100%',
                    color: mode === "dark" ? "#fcfcfc" : "#000"
                }}
                options={options}
                value={searchManagerInput ? searchManagerInput : ""}
                filterOption={false}
                onSearch={onSearch}
                onSelect={(value, option) => {
                    if (option?.userId) {
                        setCreatedBy(option?.userId)
                    }
                    setSearchManagerInput(value);
                    setSearchInputValue(value);
                }}
            >
                <Input
                    color={"secondary"}
                    value={searchInputValue ? searchInputValue : ""}
                    onChange={(e) => setSearchManagerInput(e.target.value)}
                    size={"large"}
                    style={{
                        background: "transparent",
                        color: mode === "dark" ? "#fcfcfc" : "#000"
                    }}
                />
            </AutoComplete>
        </div>
    );
};
export default SearchManager
