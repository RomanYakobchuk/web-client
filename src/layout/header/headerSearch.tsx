import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {ClearOutlined, SearchOutlined} from "@mui/icons-material";
import {useList, useTranslate} from "@refinedev/core";
import {Box, IconButton} from "@mui/material";
import {useDebounce} from "use-debounce";
import {Input} from "antd";

import {INews, IOptions, IEstablishment} from "@/interfaces/common";
import {renderItem, renderTitle} from "@/components/render";
import {Loading, ModalWindow} from "@/components";
import {ColorModeContext} from "@/contexts";
import {antdInputStyle} from "@/styles";
import {useUserInfo} from "@/hook";
import {Link, useNavigate} from "react-router-dom";
import {ESTABLISHMENT, NEWS, SHOW} from "@/config/names";

type SearchResult = { establishment: IEstablishment[], news: INews[] };

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


    const {
        data,
        isLoading,
        isFetching,
        refetch,
    } = useList<any>({
        resource: 'search/fullText',
        filters: [{field: "search", operator: "eq", value: value}],
        queryOptions: {
            enabled: false,
        },
        pagination: {
            pageSize: 20,
        }
    })

    useEffect(() => {
        if (openModal && user?._id) {
            setOptions([]);
            refetch();
        }
    }, [debounceValue, openModal, user?._id]);

    useEffect(() => {
        if (data?.data && openModal) {
            const p: SearchResult = data?.data as any;
            const establishmentOptionGroup = p?.establishment?.map((item, index) =>
                renderItem(item, item?.type, index, setOpenModal, p?.establishment.length, translate, `/${ESTABLISHMENT}/${SHOW}/${item?._id}`),
            );
            const newsOptionGroup = p?.news?.map((item, index) =>
                renderItem(item, undefined, index, setOpenModal, p?.news?.length, `/news/show/${item?._id}`),
            );
            if (establishmentOptionGroup?.length > 0) {
                setOptions((prevOptions) => [
                    ...prevOptions,
                    {
                        label: renderTitle(translate(`${ESTABLISHMENT}.${ESTABLISHMENT}`), () => {
                            setOpenModal(false);
                            navigate(`/${ESTABLISHMENT}`);
                        }),
                        options: establishmentOptionGroup,
                    },
                ] as IOptions[]);
            }
            if (newsOptionGroup?.length > 0) {
                setOptions((prevOptions) => [
                    ...prevOptions,
                    {
                        label: renderTitle(translate("news.news"), () => {
                            setOpenModal(false);
                            navigate(`/${NEWS}`);
                        }),
                        options: newsOptionGroup,
                    },
                ] as IOptions[]);
            }
        }
    }, [data]);
    return (
        <ModalWindow
            open={openModal}
            timeOut={400}
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
                py: 1,
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