import * as React from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import Box from '@mui/material/Box';
import {MessageOutlined, NewspaperOutlined, ReviewsOutlined} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";
import {ReactElement, ReactNode, useEffect, useState} from "react";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import Tab from "@mui/material/Tab";

import EstablishmentReviews from "./utills/establishmentReviews/establishment-reviews";
import EstablishmentNews from "./utills/establishment-news";
import {useMobile} from "@/hook";
import EstablishmentComments from "./utills/establishment-comments";
import {IEstablishment} from "@/interfaces/common";

export type tabType = 'reviews' | 'news' | 'comments';

export interface IButtons {
    label: tabType | string,
    icon?: ReactElement,
    count?: number | ReactNode,
    link: string,
    index: string
}

type TProps = {
    establishment: IEstablishment
}
const EstablishmentPropertyTabs = ({establishment}: TProps) => {
    const {width} = useMobile();
    const {id} = useParams();
    const {hash} = useLocation();
    const navigate = useNavigate();
    const translate = useTranslate();

    const [value, setValue] = useState('2');

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };


    const buttons: IButtons[] = [
        {
            label: 'reviews',
            link: 'reviews',
            icon: <ReviewsOutlined/>,
            index: '1'
        },
        {
            label: 'news',
            link: 'news',
            icon: <NewspaperOutlined/>,
            index: '2'
        },
        {
            label: 'comments',
            link: 'comments',
            icon: <MessageOutlined/>,
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
            maxWidth: '1000px',
            margin: '0 auto',
        }}>
            <TabContext value={value}>
                <Box sx={{
                    borderBottom: '1px solid',
                    borderColor: 'silver',
                    "& span.MuiTabs-indicator": {
                        backgroundColor: 'info.main',
                        height: '3px',
                        borderRadius: '5px'
                    }
                }}>
                    <TabList
                        onChange={handleChange}
                        aria-label="nav tabs example"
                        sx={{
                            height: '64px',
                            "& button": {
                                bgcolor: 'transparent',
                                fontSize: {xs: '0.8rem', md: '0.875rem'},
                                transition: '200ms linear',
                                textTransform: 'inherit',
                                color: 'common.white',
                                py: 0,
                                "&.Mui-selected": {
                                    color: 'info.main',
                                },
                                "&:hover": {
                                    color: 'info.main',
                                }
                            },
                        }}
                    >
                        {
                            buttons?.map(({label, icon, link, index}) => (
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
                                            flexWrap: 'no-wrap'
                                        }}>
                                            <Box>
                                                {translate(`home.show.${label}.title`)}
                                            </Box>
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
                    // maxWidth: '950px',
                    "& > div":{
                        px: 0
                    }
                }}>
                    <TabPanel value={'1'}>
                        {
                            value === '1' && id && establishment?._id && (
                                <EstablishmentReviews establishment={establishment}/>
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
                            value === '2' && id && (
                                <EstablishmentNews id={id}/>
                            )
                        }
                    </TabPanel>
                    <TabPanel
                        value={'3'}
                        sx={{
                            px: 0
                        }}
                    >
                        {
                            value === '3' && id && establishment?._id && (
                                <EstablishmentComments establishment={establishment}/>
                            )
                        }
                    </TabPanel>
                </Box>
            </TabContext>
        </Box>
    );
};
export default EstablishmentPropertyTabs
