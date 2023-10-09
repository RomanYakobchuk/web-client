import {useNavigate, useParams} from "react-router-dom";
import {useGetIdentity, useMenu, useOne, useTranslate} from "@refinedev/core";
import {Add, ArrowBackIosNew, Edit, ListAlt, MenuBookOutlined} from "@mui/icons-material";
import {Box, Button, IconButton, Typography} from "@mui/material";
import {Document, Page, pdfjs} from 'react-pdf';

import {CustomButton, Loading} from "../../../index";
import {IGetIdentity, IMenu, IMenuItem, ProfileProps} from "../../../../interfaces/common";
import React, {useContext, useEffect, useState} from "react";
import {ColorModeContext} from "../../../../contexts";
import {useMobile} from "../../../../hook";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const Menu = () => {
    const {width} = useMobile();
    const {id} = useParams();
    const navigate = useNavigate();
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;

    const {data, isError, isLoading} = useOne({
        resource: `menu/one_menu`,
        id: id
    });

    const menu: IMenu['menu'] = data?.data?.menu ?? [];
    const category: any = data?.data?.category ?? [];
    const [pdf, setPdf] = useState<string>(menu?.fileMenu ?? '');
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [isFile, setIsFile] = useState(true);

    function onDocumentLoadSuccess({numPages}: { numPages: number }) {
        setNumPages(numPages);
    }

    useEffect(() => {
        if (menu?.fileMenu !== '') {
            setIsFile(true)
        } else if (menu?.items?.length! > 0) {
            setIsFile(false)
        } else {
            setIsFile(false)
        }
    }, [menu])

    const isSomeMenu = menu?.fileMenu !== '' || menu?.items?.length! > 0;

    if (isLoading) return <Loading/>
    if (isError) return <div>Error</div>
    return (
        <Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: isSomeMenu ? "space-between" : 'start',
            }}>
                <CustomButton handleClick={() => navigate(-1)} width={'50px'} title={""} backgroundColor={'blue'}
                              color={'#fcfcfc'} icon={<ArrowBackIosNew/>}/>

                <Typography sx={{
                    fontSize: {xs: '18px', sm: '22px'},
                    fontWeight: 700,
                    textAlign: 'center',
                    width: '100%',
                    m: 'auto'
                }} >
                    {translate("profile.edit.title")}
                </Typography>
                {
                    (user?._id === menu?.createdBy && user?.status === 'manager') || user?.status === 'admin'
                        ? <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            {
                                menu?.fileMenu === '' && menu?.items?.length === 0 ?
                                    width > 600 ?
                                        <Button
                                            onClick={() => navigate(`/all_institutions/menu/create/${id}`)}
                                            variant={"contained"}
                                            color={'success'}
                                            startIcon={<Add/>}
                                        >
                                            {translate('buttons.create')}
                                        </Button>
                                        : <IconButton
                                            onClick={() => navigate(`/all_institutions/menu/create/${id}`)}
                                            sx={{
                                            p: 0
                                        }}>
                                            <Add sx={{
                                                fontSize: '40px',
                                            }}/>
                                        </IconButton>
                                    : ''
                            }
                            {
                                menu?.fileMenu !== '' || menu?.items?.length! > 0 ?
                                    width > 600 ?
                                        <Button
                                            onClick={() => navigate(`/all_institutions/menu/edit/${id}`)}
                                            variant={"contained"}
                                            color={'success'}
                                            startIcon={<Edit/>}
                                        >
                                            {translate('buttons.edit')}
                                        </Button>
                                        : <IconButton
                                            onClick={() => navigate(`/all_institutions/menu/edit/${id}`)}
                                            sx={{
                                            p: 0
                                        }}>
                                            <Edit sx={{
                                                fontSize: '40px',
                                            }}/>
                                        </IconButton>
                                    : ''
                            }
                        </Box>
                        : ''
                }
            </Box>
            {
                menu?.fileMenu !== '' || menu?.items?.length! > 0 ?
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    {
                        menu?.fileMenu !== ''
                            ?
                        <MenuBookOutlined sx={{
                            color: isFile ? '#2547b3' : 'silver',
                            fontSize: '40px',
                            cursor: 'pointer',
                            transition: '300ms linear',
                            "&:hover": {
                                color: '#2547b3'
                            }
                        }} onClick={() => setIsFile(true)}/>
                        : ''
                    }
                    {
                        menu?.items?.length! > 0
                            ?
                        <ListAlt sx={{
                            color: isFile ? 'silver' : '#2547b3',
                            fontSize: '40px',
                            cursor: 'pointer',
                            transition: '300ms linear',
                            "&:hover": {
                                color: '#2547b3'
                            }
                        }} onClick={() => setIsFile(false)}/>
                        : ''
                    }
                </Box>
                : <Box>
                     схоже що меню не додано
                 </Box>
            }
            {
                menu?.fileMenu !== '' || menu?.items?.length! > 0
                    ?
                <>
                    <Box>
                        {
                            isFile
                                ? <Box>
                                    <Box sx={{
                                        width: '100%'
                                    }}>
                                        <Document file={menu?.fileMenu} onLoadSuccess={onDocumentLoadSuccess}>
                                            <Page pageNumber={pageNumber}/>
                                        </Document>
                                        <p>Page {pageNumber} of {numPages}</p>
                                    </Box>
                                </Box>
                                : <Box>
                                    {
                                        menu?.items?.map((item: IMenuItem, index: number) => (
                                            <Box key={index}>
                                                {index}
                                            </Box>
                                        ))
                                    }
                                </Box>
                        }
                    </Box>
                    <Box>
                        {

                        }
                    </Box>
                </>
                : ''
            }
        </Box>
    );
};
export default Menu;
