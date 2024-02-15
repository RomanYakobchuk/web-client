import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {ClearOutlined, SearchOutlined} from "@mui/icons-material";
import {useList, useTranslate} from "@refinedev/core";
import {Box, IconButton} from "@mui/material";
import {useDebounce} from "use-debounce";
import {Input} from "antd";

import {INews, IOptions, PropertyProps} from "@/interfaces/common";
import {renderItem, renderTitle} from "@/components/render";
import {Loading, ModalWindow} from "@/components";
import {ColorModeContext} from "@/contexts";
import {antdInputStyle} from "@/styles";
import {useUserInfo} from "@/hook";
import {Link, useNavigate} from "react-router-dom";
import {ESTABLISHMENT, NEWS, SHOW} from "@/config/names";

type TProps = {
    openModal: boolean,
    setOpenModal: Dispatch<SetStateAction<boolean>>,
}
const HeaderSearch = ({openModal, setOpenModal}: TProps) => {
    const {user} = useUserInfo();
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const navigate = useNavigate();

    const [value, setValue] = useState<string>("");
    const [options, setOptions] = useState<IOptions[]>([]);
    const [debounceValue, _] = useDebounce(value ?? '', 500);


    const {refetch: refetchPlaces, isRefetching: isRefetchPlace, isLoading: isLoadPlace} = useList<PropertyProps>({
        resource: `${ESTABLISHMENT}/all`,
        filters: [{field: "title", operator: "contains", value: value}],
        queryOptions: {
            enabled: false,
            onSuccess: (data) => {
                const establishmentOptionGroup = data?.data.map((item, index) =>
                    renderItem(item, `${ESTABLISHMENT}`, index, mode, setOpenModal, data?.data.length, translate, `/${ESTABLISHMENT}/${SHOW}/${item?._id}`),
                );
                if (establishmentOptionGroup?.length > 0) {
                    setOptions((prevOptions) => [
                        ...prevOptions,
                        {
                            label: renderTitle(translate(`${ESTABLISHMENT}.${ESTABLISHMENT}`), mode, () => {
                                setOpenModal(false);
                                navigate(`/${ESTABLISHMENT}`);
                            }),
                            options: establishmentOptionGroup,
                        },
                    ] as IOptions[]);
                }
            },
        },
    });

    const {refetch: refetchNews, isRefetching: isRefetchNews, isLoading: isLoadNews} = useList<INews>({
        resource: `${NEWS}/all`,
        filters: [{field: "title", operator: "contains", value: value}],
        queryOptions: {
            enabled: false,
            onSuccess: (data) => {
                const newsOptionGroup = data.data.map((item, index) =>
                    renderItem(item, `${NEWS}`, index, mode, setOpenModal, data.data.length, translate, `/news/show/${item?._id}`),
                );
                if (newsOptionGroup.length > 0) {
                    setOptions((prevOptions) => [
                        ...prevOptions,
                        {
                            label: renderTitle(translate("news.news"), mode, () => {
                                setOpenModal(false);
                                navigate(`/${NEWS}`);
                            }),
                            options: newsOptionGroup,
                        },
                    ] as IOptions[]);
                }
            },
        },
    });

    useEffect(() => {
        if (openModal && user?._id) {
            (async () => {
                setOptions([]);
                await Promise.all([refetchNews(), refetchPlaces()]);
            })()
        }
    }, [debounceValue, openModal, user]);

    const isLoading = isLoadNews || isLoadPlace || isRefetchNews || isRefetchPlace;

    return (
        <ModalWindow
            open={openModal}
            setOpen={setOpenModal}
            title={
                <Box sx={{
                    width: '80%',
                    ml: '20px',
                    ...antdInputStyle
                }}>
                    <Input
                        style={{
                            width: '100%',
                            fontSize: '20px',
                            gap: 2,
                            color: mode === 'dark' ? 'white' : 'black',
                            background: 'transparent',
                        }}
                        value={value ?? ''}
                        onChange={(e) => setValue(e.target.value)}
                        suffix={
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: value?.length > 0 ? 1 : 0
                            }}>
                                <SearchOutlined/>
                                {
                                    value?.length > 0 && (
                                        <IconButton size={"small"} onClick={() => setValue('')}>
                                            <ClearOutlined/>
                                        </IconButton>
                                    )
                                }
                            </Box>
                        }
                        size={'middle'}
                        placeholder={`${translate('buttons.search')}...`}
                    />
                </Box>
            }
        >
            <Box sx={{
                p: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 3
            }}>
                {
                    isLoading ?
                        <Box sx={{
                            width: '100%',
                            height: '200px'
                        }}>
                            <Loading/>
                        </Box>
                        :
                        options?.length > 0 ? (
                            options?.map((option, index) => (
                                <Box key={index} sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1
                                }}>
                                    <Box>
                                        <Link
                                            to={''}
                                        >
                                            {option.label}
                                        </Link>
                                    </Box>
                                    {
                                        option?.options?.map((item) => (
                                            <Box key={item.key} sx={{
                                                pl: '10px',
                                                height: '70px'
                                            }}>
                                                {item.label}
                                            </Box>
                                        ))
                                    }
                                </Box>
                            ))
                        ) : <Box sx={{
                            height: '150px',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '22px',
                            color: (theme) => theme.palette.common.white
                        }}>
                            {translate('text.notResult')}
                        </Box>
                }
            </Box>
        </ModalWindow>
    );
};

export default HeaderSearch;