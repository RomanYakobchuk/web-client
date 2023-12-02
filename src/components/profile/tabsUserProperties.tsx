import {Box} from "@mui/material";
import Tab from "@mui/material/Tab";
import React, {ReactElement, ReactNode, useContext, useEffect, useState} from "react";

import {ProfileProps} from "@/interfaces/common";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {usePermissions, useTranslate} from "@refinedev/core";
import {useMobile} from "@/hook";
import {Apartment, Bookmark, MessageOutlined, ReviewsOutlined} from "@mui/icons-material";
import {FavoritePlaces, UserComments, UserInstitutions, UserReviews} from "@/components";
import {useLocation, useNavigate} from "react-router-dom";
import {ColorModeContext} from "@/contexts";

// type tabType = 'reviews' | 'saved' | 'comments' | "own_establishment";

interface IButtons {
    label: string,
    icon: ReactElement,
    count?: number | ReactNode,
    link?: string,
    index: string
}


type TProps = {
    user: ProfileProps
}
const TabsUserProperties = ({user}: TProps) => {

    const {_id} = user;

    const navigate = useNavigate();
    const {data: role} = usePermissions();
    const {hash} = useLocation();
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const {layoutWidth} = useMobile();

    const defaultButtons: IButtons[] = [
        {
            label: translate(`favorite-places.title`),
            icon: <Bookmark/>,
            link: '',
            index: '1'
            // count: showCount ?? numberOfProperties?.newsCount
        },
        {
            label: translate(`home.show.comments.title`),
            icon: <MessageOutlined/>,
            link: 'comments',
            index: '3'
            // count: showCount ?? numberOfProperties?.commentCount
        },
    ];
    const [buttons, setButtons] = useState<IButtons[]>(defaultButtons);
    const [value, setValue] = useState("1");

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    useEffect(() => {
        const currentTab = hash ? hash?.split('#')[1] : '';
        const tab = buttons.find((value) => value?.link === currentTab)?.index;
        if (tab) {
            setValue(tab)
        }
    }, [hash, buttons]);

    useEffect(() => {
        if (user?.status === 'manager' && (role === 'manager' || role === 'admin')) {
            setButtons([...defaultButtons, {
                label: translate('all_institutions.all_institutions'),
                icon: <Apartment/>,
                link: 'establishment',
                index: '4'
            }])
        }
        if (user?.status === 'user') {
            setButtons([...buttons, {
                label: translate(`home.show.reviews.title`),
                icon: <ReviewsOutlined/>,
                link: 'reviews',
                index: '2'
                // count: showCount ?? numberOfProperties?.reviewCount
            },])
        }
    }, [user?.status, role]);

    return (
        <Box sx={{
            width: '100%'
        }}>
            <TabContext value={value}>
                <Box sx={{
                    "& span.MuiTabs-indicator": {
                        backgroundColor: 'info.main',
                        height: '3px'
                    },
                    maxWidth: `calc(${layoutWidth}px - 8vw - 40px)`,
                    margin: '0 auto',
                    width: '100%',
                }}>
                    <TabList
                        onChange={handleChange}
                        variant={'scrollable'}
                        aria-label="nav tabs example"
                        scrollButtons={true}
                        sx={{
                            "& div.MuiTabs-flexContainer": {
                                pb: '5px',
                            },
                            "& button": {
                                minHeight: {xs: '26px', md: '30px'},
                                fontSize: {xs: '0.8rem', md: '0.875rem'},
                                transition: '200ms linear',
                                textTransform: 'inherit',
                                border: `2px solid ${mode === 'dark' ? '#fff' : '#000'}`,
                                color: 'common.white',
                                borderRadius: '40px',
                                m: {xs: '5px', md: '10px'},
                                p: '5px 16px',
                                "&.Mui-selected": {
                                    color: '#f1f1f1',
                                    backgroundColor: 'info.main',
                                    border: `2px solid transparent`,
                                },
                                "&:hover": {
                                    // color: '#fff',
                                    border: `2px solid transparent`,
                                    backgroundColor: 'info.main'
                                }
                            },
                        }}
                    >
                        {
                            buttons?.map(({label, icon, link, index}) => (
                                <Tab
                                    key={index}
                                    icon={icon}
                                    iconPosition={'start'}
                                    onClick={() => navigate(`#${link}`)}
                                    value={index}
                                    label={
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            flexWrap: 'wrap'
                                        }}>
                                            <span>
                                             {label}
                                            </span>
                                            {/*<span>*/}
                                            {/*{count}*/}
                                            {/*</span>*/}
                                        </Box>
                                    }
                                />
                            ))
                        }
                    </TabList>
                </Box>
                <TabPanel
                    value={'1'}
                    sx={{
                        p: '24px 0'
                    }}
                >
                    {
                        value === '1' && _id && (
                            <FavoritePlaces id={_id}/>
                        )
                    }
                </TabPanel>
                {
                    user?.status !== 'manager' && role !== 'manager' && (
                        <TabPanel
                            value={'2'}
                            sx={{
                                p: '24px 0',
                                maxWidth: '800px',
                            }}
                        >
                            {
                                value === '2' && _id && (
                                    <UserReviews id={_id}/>
                                )
                            }
                        </TabPanel>
                    )
                }
                <TabPanel
                    value={'3'}
                    sx={{
                        p: '24px 0'
                    }}
                >
                    {
                        value === '3' && _id && (
                            <UserComments id={_id}/>
                        )
                    }
                </TabPanel>

                {
                    user?.status === 'manager' && (role === 'manager' || role === 'admin') && (
                        <TabPanel
                            value={'4'}
                            sx={{
                                p: '24px 0'
                            }}
                        >
                            {
                                value === '4' && _id && (
                                    <UserInstitutions id={_id}/>
                                )
                            }
                        </TabPanel>
                    )
                }
            </TabContext>
        </Box>
    )
        ;
};
export default TabsUserProperties
