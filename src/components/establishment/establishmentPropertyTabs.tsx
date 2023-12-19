import * as React from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import Box from '@mui/material/Box';
import {MessageOutlined, NewspaperOutlined, ReviewsOutlined} from "@mui/icons-material";
import {useOne, useTranslate} from "@refinedev/core";
import {ReactElement, ReactNode, useEffect, useState} from "react";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import Tab from "@mui/material/Tab";

import EstablishmentReviews from "./utills/establishment-reviews";
import EstablishmentNews from "./utills/establishment-news";
import {useMobile} from "@/hook";
import EstablishmentComments from "./utills/establishment-comments";
import {PropertyProps} from "@/interfaces/common";
import {CircularProgress} from "@mui/material";

type tabType = 'reviews' | 'news' | 'comments';

interface IButtons {
    label: tabType,
    icon: ReactElement,
    count: number | ReactNode,
    link: string,
    index: string
}

type TNumberOfProperties = {
    newsCount: number,
    reviewCount: number,
    commentCount: number
}

type TProps = {
    institution: PropertyProps
}
const EstablishmentPropertyTabs = ({institution}: TProps) => {
    const {width} = useMobile();
    const {id} = useParams();
    const {hash} = useLocation();
    const navigate = useNavigate();
    const translate = useTranslate();

    const [value, setValue] = useState('2');

    const [numberOfProperties, setNumberOfProperties] = useState<TNumberOfProperties>({
        commentCount: 0, newsCount: 0, reviewCount: 0
    });

    const {isError, isLoading, data} = useOne<TNumberOfProperties>({
        resource: 'institution/getNumberOfEstablishmentProperties',
        id: id as string
    })
    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (data?.data) {
            setNumberOfProperties({
                ...data?.data
            })
        }
    }, [data?.data]);

    const showCount = isLoading ? <CircularProgress size={20}/> : isError ? <span>0</span> : null

    const buttons: IButtons[] = [
        {
            label: 'reviews',
            link: 'reviews',
            icon: <ReviewsOutlined/>,
            count: showCount ?? numberOfProperties?.reviewCount,
            index: '1'
        },
        {
            label: 'news',
            link: '',
            icon: <NewspaperOutlined/>,
            count: showCount ?? numberOfProperties?.newsCount,
            index: '2'
        },
        {
            label: 'comments',
            link: 'comments',
            icon: <MessageOutlined/>,
            count: showCount ?? numberOfProperties?.commentCount,
            index: '3'
        },
    ];

    useEffect(() => {
        const currentTab = hash ? hash?.split('#')[1] : '';
        const tab = buttons.find((value) => value?.link === currentTab)?.index;
        if (tab) {
            setValue(tab)
        }
    }, [hash, buttons]);

    return (
        <Box sx={{
            width: '100%',
            "& div.MuiTabPanel-root": {
                p: {xs: '20px 0px', sm: '30px 0px', md: '40px 0px'}
            }
        }}>
            <TabContext value={value}>
                <Box sx={{
                    "& span.MuiTabs-indicator": {
                        backgroundColor: 'info.main',
                        height: '3px'
                    }
                }}>
                    <TabList
                        onChange={handleChange}
                        variant={'fullWidth'}
                        aria-label="nav tabs example"
                        sx={{
                            maxWidth: '800px',
                            margin: '0 auto',
                            "& button": {
                                minHeight: {xs: '36px', md: '48px'},
                                bgcolor: 'silver',
                                fontSize: {xs: '0.8rem', md: '0.875rem'},
                                transition: '200ms linear',
                                textTransform: 'inherit',
                                color: 'black',
                                borderRadius: '40px',
                                m: {xs: '5px', md: '10px'},
                                p: '0',
                                "&.Mui-selected": {
                                    color: '#f1f1f1',
                                    bgcolor: 'info.main',
                                },
                                "&:hover": {
                                    color: '#fff',
                                    backgroundColor: 'info.main'
                                }
                            },
                        }}
                    >
                        {
                            buttons?.map(({label, icon, count, link, index}) => (
                                <Tab
                                    key={index}
                                    icon={width > 600 ? icon : <></>}
                                    iconPosition={'start'}
                                    value={index}
                                    onClick={() => navigate(`#${link}`)}
                                    label={
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            flexWrap: 'wrap'
                                        }}>
                                            <span>
                                            {translate(`home.show.${label}.title`)}
                                            </span>
                                            <span>
                                            {count}
                                            </span>
                                        </Box>
                                    }
                                />
                            ))
                        }
                    </TabList>
                </Box>
                <Box sx={{
                    width: '100%',
                    margin: '0 auto',
                    maxWidth: '750px',
                }}>
                    <TabPanel value={'1'}>
                        {
                            value === '1' && id && institution?._id && (
                                <EstablishmentReviews id={id}/>
                            )
                        }
                    </TabPanel>
                    <TabPanel
                        value={'2'}
                        sx={{
                            // margin: '0 auto',
                            // maxWidth: '800px',
                        }}
                    >
                        {
                            value === '2' && id && institution?._id && (
                                <EstablishmentNews id={id}/>
                            )
                        }
                    </TabPanel>
                    <TabPanel value={'3'}>
                        {
                            value === '3' && id && institution?._id && (
                                <EstablishmentComments institution={institution}/>
                            )
                        }
                    </TabPanel>
                </Box>
            </TabContext>
        </Box>
    );
};
export default EstablishmentPropertyTabs
