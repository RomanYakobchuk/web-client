import {IReserve} from "@/interfaces/common";
import {useContext, useState} from "react";
import {Box, Button, IconButton} from "@mui/material";
import RenderTag from "@/components/common/statusTagRender";
import {axiosInstance} from "@/authProvider";
import {ModalShowContent} from "@/components";
import {useNotification, usePermissions, useTranslate} from "@refinedev/core";
import {ColorModeContext} from "@/contexts";
import {useUserInfo} from "@/hook";
import ChooseNewStatus from "@/components/common/choose/chooseNewStatus";
import {Edit} from "@mui/icons-material";

type TProps = {
    defaultValue: IReserve['userStatus']['value'],
    id: string,
    reserve: IReserve,
    fieldName?: string,
    field?: TUpdateType
}

type TUpdateType = "establishmentStatus" | "userStatus";
const UpdateReserveStatusTag = ({id, defaultValue, reserve, fieldName, field}: TProps) => {

    const {user} = useUserInfo();
    const {data: role} = usePermissions();
    const {mode} = useContext(ColorModeContext);
    const {open} = useNotification();

    const translate = useTranslate();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [value, setValue] = useState<IReserve['userStatus']['value']>(defaultValue);
    const [selectedValue, setSelectedValue] = useState(value);
    const handleUpdateStatus = async () => {
        try {
            if (field && selectedValue !== defaultValue) {
                const res = await axiosInstance.patch(`/capl/updateStatus/${id}`, {
                    newStatus: selectedValue,
                    type: field
                })
                if (res?.data?.reservation) {
                    setValue(res?.data?.reservation[field]?.value)
                }
                open?.({
                    type: 'success',
                    description: res?.data?.message,
                    message: 'Updated'
                })
            }
            setIsOpen(false)
        } catch (e: any) {
            console.log(e?.response?.data)
        }
    }

    const isAccess = reserve?.isAllowedEdit && reserve?.isActive && defaultValue !== 'accepted' && ((field === 'userStatus' && reserve?.user === user?._id) || (field === 'establishmentStatus' && reserve?.manager === user?._id)) || role === 'admin';

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: isAccess ? 1 : 0
        }}>
            <RenderTag value={value}/>
            {
                isAccess &&
                <ModalShowContent
                    openComponentStyle={{
                        order: -1
                    }}
                    openComponent={
                        <IconButton
                            onClick={() => {
                                if (isAccess) {
                                    setIsOpen(true)
                                }
                            }}
                            sx={{
                                cursor: isAccess ? 'pointer' : 'not-allowed'
                            }}
                        >
                            <Edit/>
                        </IconButton>
                    }
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    onClick={handleUpdateStatus}
                    headerStyle={{
                        margin: '0',
                        marginBottom: 0,
                        justifyContent: fieldName ? 'space-between' : 'end',
                        padding: fieldName ? '8px' : 0
                    }}
                    additionalHeaderValue={fieldName && (
                        <Box sx={{
                            p: 1,
                            color: '#fff',
                            fontSize: '18px',
                            fontWeight: 600
                        }}>
                            {fieldName}
                        </Box>
                    )}
                >
                    <Box sx={{
                        width: '100%',
                        p: 2,
                        "& *": {
                            color: '#fff'
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}>
                            {translate('text.current') + ':'}
                            <RenderTag value={defaultValue}/>
                        </Box>
                        <Box sx={{
                            width: 'fit-content',
                            minWidth: '140px'
                        }}>
                            <ChooseNewStatus
                                value={selectedValue}
                                disabled={false}
                                label={fieldName ? fieldName : ''}
                                onChange={event => setSelectedValue(event.target.value)}
                            />
                        </Box>
                    </Box>
                </ModalShowContent>
            }
        </Box>
    );
};
export default UpdateReserveStatusTag
