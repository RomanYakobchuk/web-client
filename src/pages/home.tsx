import {useList, useTranslate} from "@refinedev/core";
import {Box, debounce, Autocomplete} from "@mui/material";
import {AutoComplete, Typography as TypographyAntd, Input} from "antd";
import {OpenInNew, OpenInNewOutlined, SearchOutlined} from "@mui/icons-material";
import {FC, useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import ScrollLock from 'react-scrolllock';


import {IOptions} from "../interfaces/common";
import {CountCities, CountType, CountViews} from "components/home";

const {Text} = TypographyAntd;
const renderTitle = (title: string) => {
    return (
        <Text strong style={{fontSize: "16px"}}>
            {title}
        </Text>
    );
};

const renderItem = (title: string, resource: string, id: string) => {
    return {
        value: title,
        id: id,
        label: (
            <Link to={`/${resource}/show/${id}`} style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: '10px'
            }}>
                <Text style={{
                    textTransform: 'capitalize'
                }}>
                    {title}
                </Text>
                <OpenInNewOutlined onClick={() => window.location.replace(`/${resource}/show/${id}`)}/>
            </Link>
        ),
    };
};
const Home: FC = () => {
    const translate = useTranslate();

    const [value, setValue] = useState<string>("");
    const [options, setOptions] = useState<IOptions[]>([]);

    const {refetch: refetchPlaces} = useList<any>({
        resource: "institution/all",
        filters: [{field: "title", operator: "contains", value}],
        queryOptions: {
            enabled: false,
            onSuccess: (data) => {
                const postOptionGroup = data.data.map((item) =>
                    renderItem(item.title, "all_institutions", item._id),
                );
                if (postOptionGroup.length > 0) {
                    setOptions((prevOptions) => [
                        ...prevOptions,
                        {
                            label: renderTitle(translate("all_institutions.all_institutions")),
                            options: postOptionGroup,
                        },
                    ]);
                }
            },
        },
    });

    const {refetch: refetchNews} = useList<any>({
        resource: "news/all",
        filters: [{field: "title", operator: "contains", value}],
        queryOptions: {
            enabled: false,
            onSuccess: (data) => {
                const categoryOptionGroup = data.data.map((item) =>
                    renderItem(item.title, "news", item._id),
                );
                if (categoryOptionGroup.length > 0) {
                    setOptions((prevOptions) => [
                        ...prevOptions,
                        {
                            label: renderTitle(translate("news.news")),
                            options: categoryOptionGroup,
                        },
                    ]);
                }
            },
        },
    });

    useEffect(() => {
        setOptions([]);
        refetchNews();
        refetchPlaces();
    }, [value]);

    return (
        <Box sx={{
            display: 'flex',
            gap: "20px",
            flexDirection: "column",
            alignItems: "center",
            margin: "auto",
            justifyContent: "center",
            width: "90%",
            mb: 2
        }}>
            <ScrollLock>
                <Box sx={{width: '100%'}}>
                    <AutoComplete
                        style={{
                            width: '100%',
                        }}
                        options={options}
                        filterOption={false}
                        onSearch={debounce((value: string) => setValue(value), 500)}
                    >
                        <Input
                            suffix={<SearchOutlined/>}
                            size={"large"}
                        />
                    </AutoComplete>
                </Box>
            </ScrollLock>
            <CountCities/>
            <CountType/>
            <CountViews/>
        </Box>
    );
};
export default Home;
