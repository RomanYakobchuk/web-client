import {useTranslate} from "@refinedev/core";
import {Dispatch, SetStateAction,} from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {Box} from "@mui/material";

import {IButtons} from "@/components/establishment/establishmentPropertyTabs";
import {useMobile} from "@/hook";

type TProps = {
    currentTab: string,
    setCurrentTab: Dispatch<SetStateAction<string>>
}
export const ChatTabs = ({setCurrentTab, currentTab}: TProps) => {
    const translate = useTranslate();
    const {width} = useMobile();

    const buttons: IButtons[] = [
        {
            label: translate('notifications.page.info.all'),
            link: '',
            count: 0,
            index: '1'
        },
        {
            label: translate('all-users.all-users'),
            link: 'user',
            count: 0,
            index: '2'
        },
        {
            label: translate('establishment.establishment'),
            link: 'establishment',
            count: 0,
            index: '3'
        },
        {
            label: translate('capl.reservation'),
            link: 'reservation',
            count: 0,
            index: '4'
        },
    ];

    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };


    return (
        <Box sx={{
            width: '100%',
            borderBottom: '1px solid',
            borderColor: 'silver',
            "& span.MuiTabs-indicator": {
                backgroundColor: 'info.main',
                height: '3px',
                borderRadius: '5px'
            }
        }}>
            <Tabs
                value={currentTab}
                variant={'scrollable'}
                scrollButtons={'auto'}
                onChange={handleChange}
                sx={{
                    width: '100%',
                    "& button": {
                        minWidth: '30px',
                        minHeight: '48px',
                        bgcolor: 'transparent',
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
                    buttons?.map(({label, icon, count, link, index}) => (
                        <Tab
                            key={index}
                            icon={width > 600 ? icon : <></>}
                            iconPosition={'start'}
                            value={link}
                            onClick={() => {
                                setCurrentTab(link)
                            }}
                            label={
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    flexWrap: 'no-wrap'
                                }}>
                                    <Box>
                                        {label}
                                    </Box>
                                </Box>
                            }
                        />
                    ))
                }
            </Tabs>
        </Box>
    );
};

