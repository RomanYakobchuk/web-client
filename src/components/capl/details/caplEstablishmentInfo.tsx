import {Box, Button, CardContent, CardHeader, Grid} from "@mui/material";
import {EastOutlined} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";
import {Image} from "antd";
import React from "react";

import {IEstablishment} from "@/interfaces/common";
import {ESTABLISHMENT} from "@/config/names";
import {useNavigate} from "react-router-dom";
import {MainHeader} from "@/components/establishment/utills/main/mainHeader";

type TProps = {
    establishment: IEstablishment
}
export const CaplEstablishmentInfo = ({establishment}: TProps) => {
    const translate = useTranslate();
    const navigate = useNavigate();

    return (
        <Grid
            sx={{
                "& *, & *.ant-typography": {
                    color: 'common.white'
                },
                my: 1,
                width: '100%'
            }}
        >
            <Grid sx={{width: '100%'}}>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <CardHeader
                        sx={{
                            p: 0
                        }}
                        title={translate('home.one')}/>
                    <Button
                        sx={{
                            fontSize: {xs: '14px', sm: '16px'},
                            width: 'fit-content',
                            textTransform: 'inherit'
                        }}
                        onClick={() => navigate(`/${ESTABLISHMENT}/show/${establishment?._id}`)}
                        color={"secondary"}
                        endIcon={<EastOutlined/>}
                        variant={"text"}>
                        {translate("buttons.details")}
                    </Button>
                </Box>
                <CardContent sx={{
                    width: '100%',
                    mt: 1,
                    padding: '16px !important',
                    bgcolor: 'common.black',
                    borderRadius: '15px',
                    "& div.ant-image": {
                        width: '100%',
                        "& img": {
                            height: {xs: '200px', sm: '250px', md: '325px', lg: '375px'},
                        }
                    }
                }}>
                    <MainHeader establishment={establishment}/>
                    <Image
                        width={'100%'}
                        src={establishment?.pictures?.length > 0 ? establishment?.pictures[0].url : ''}
                        alt={establishment?.title}
                        style={{
                            width: '100%',
                            // maxWidth: '400px',
                            borderRadius: '7px',
                            objectFit: 'cover'
                        }}
                    />
                </CardContent>
            </Grid>
        </Grid>
    );
};

