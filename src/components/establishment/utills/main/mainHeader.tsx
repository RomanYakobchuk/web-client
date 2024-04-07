import {Box, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {Place} from "@mui/icons-material";
import React, {useContext} from "react";

import {ESTABLISHMENT} from "@/config/names";
import {IEstablishment} from "@/interfaces/common";
import {useTranslate} from "@refinedev/core";
import {ColorModeContext} from "@/contexts";
import {AnimatedText} from "@/animation/animatedText";

type TProps = {
    establishment: IEstablishment
}

export const MainHeader = ({establishment}: TProps) => {
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                "@media screen and (max-width: 800px && min-width: 600px)": {
                    alignItems: 'start'
                },
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: {xs: 3, sm: 6},
                    alignItems: 'center',
                    "& a": {
                        fontSize: {xs: 14, sm: 16},
                    },
                    "& h1": {
                        m: 0,
                        color: 'common.white',
                        fontSize: {xs: '24px', sm: '30px'},
                        fontWeight: 700,
                    }
                }}>
                    <AnimatedText
                        el={"h1"}
                        key={establishment?._id + establishment?.title}
                        text={establishment.title}
                    />
                    <Link
                        to={`/${ESTABLISHMENT}?pageSize=10&current=1&sorters[0][field]=createdAt_asc&sorters[0][order]=desc&filters[0][field]=propertyType&filters[0][operator]=eq&filters[0][value]=${establishment.type}`}
                        style={{
                            textDecoration: 'none',
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'center',
                            color: '#fff',
                            padding: '5px',
                            backgroundColor: '#5e49c3',
                            borderRadius: '5px',
                        }}>
                        {
                            translate(`home.create.type.${establishment.type}`)
                        }
                    </Link>
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 1,
                alignItems: 'center',
                m: '10px 0'
            }}>
                <Place color={'secondary'} sx={{
                    fontSize: '24px'
                }}/>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Link
                        to={`/${ESTABLISHMENT}?pageSize=10&current=1&sorters[0][field]=&sorters[0][order]=asc&filters[0][field]=averageCheck&filters[0][operator]=lte&filters[0][value]=100000&filters[1][field]=averageCheck&filters[1][operator]=gte&filters[1][value]=20&filters[2][field]=tag&filters[2][value]=&filters[2][operator]=contains&filters[3][field]=title&filters[3][value]=&filters[3][operator]=contains&filters[4][field]=propertyType&filters[4][operator]=eq&filters[4][value]=&filters[5][field]=city&filters[5][operator]=contains&filters[5][value]=${establishment?.place?.city}`}
                        style={{
                            fontSize: '14px',
                            width: 'fit-content',
                            color: mode === 'dark' ? 'silver' : 'blueviolet',
                            borderBottom: `1px solid ${mode === 'dark' ? 'silver' : 'blueviolet'}`
                        }}>
                        {establishment?.place?.city}
                    </Link>
                    <Typography sx={{
                        fontSize: '13px',
                        color: 'common.white',
                    }}>
                        {establishment?.place?.address}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

