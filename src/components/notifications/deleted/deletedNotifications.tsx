import {Dispatch, SetStateAction, useContext} from "react";
import {Box} from "@mui/material";

import DeletedNotificationList from "@/components/notifications/deleted/deletedNotificationList";
import {INotification} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {CustomDrawer} from "@/components";
import {useMobile} from "@/hook";
import {useTranslate} from "@refinedev/core";

type TProps = {
    userId: string,
    openDeleted: boolean,
    setOpenDeleted: Dispatch<SetStateAction<boolean>>,
    setNotifications: Dispatch<SetStateAction<INotification[]>>
}
const DeletedNotifications = ({setOpenDeleted, openDeleted, userId, setNotifications}: TProps) => {

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const {width, device} = useMobile();

    return (
        <>
            {
                width < 1200
                    ? <CustomDrawer
                        anchor={(device && width < 600) ? 'bottom' : 'right'}
                        open={openDeleted}
                        isScaleRoot={true}
                        toggleDrawer={setOpenDeleted}
                        title={
                            <Box sx={{
                                height: '50px',
                                fontSize: '22px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {translate('notifications.page.deleted.title')}
                            </Box>
                        }
                        contentStyle={{
                            mt: '25px'
                        }}
                        maxWidth={'600px'}
                    >
                        {
                            openDeleted && (
                                <DeletedNotificationList setNotifications={setNotifications} userId={userId}/>
                            )
                        }
                    </CustomDrawer>
                    : (
                        openDeleted && (
                            <Box sx={{
                                p: 1,
                                width: '100%',
                                height: 'fit-content',
                                borderRadius: '15px',
                                boxShadow: `0px 0px 3px 0px ${mode === 'dark' ? '#fff' : '#000'}`
                            }}>
                                <DeletedNotificationList setNotifications={setNotifications} userId={userId}/>
                            </Box>
                        )
                    )
            }
        </>
    );
};
export default DeletedNotifications;


