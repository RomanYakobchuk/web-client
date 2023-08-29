import { PropertyProps} from "../../../../interfaces/common";
import {Box, Grid, SxProps} from "@mui/material";
import {Variant1EstablishmentCard} from "../../../index";
import React, {useContext} from "react";
import {VariantContext} from "../../../../settings/variantEstablishment";
import Variant2EstablishmentCard from "../variant2EstablishmentCard";

interface IProps {
    items: PropertyProps[]
}

const PropertiesList = ({items}: IProps) => {

    const {variant} = useContext(VariantContext);

    const style: SxProps = variant === 'variant_2'
        ? {
            display: 'grid',
            gridTemplateColumns: {xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)'},
            gap: 2,
            width: '100%',
            margin: '0 auto',
            justifyItems: 'center'
        } : variant === 'variant_1'
            ? {
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                justifyContent: 'start',
                alignItems: 'start'
            } : {}

    return (
        <Box sx={{
            width: '100%'
        }}>
            <Box sx={{
                ...style
            }}>
                {
                    items.map((institution: PropertyProps | any) => {
                            if (variant === 'variant_1') {
                                return (
                                    <Variant2EstablishmentCard establishment={institution} key={institution._id}/>
                                )
                            }

                            return (
                                <Grid
                                    sx={{
                                        display: 'grid',
                                        maxWidth: {xs: '350px'},
                                        minWidth: {xs: '40%', md: '30%', lg: '22%', xl: '18%'},
                                        width: '100%'
                                    }}
                                    item
                                    key={institution?._id}
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    xl={3}
                                >
                                    <Variant1EstablishmentCard
                                        institution={institution}
                                    />
                                </Grid>
                            )
                        }
                    )
                }
            </Box>
        </Box>
    );
};
export default PropertiesList
