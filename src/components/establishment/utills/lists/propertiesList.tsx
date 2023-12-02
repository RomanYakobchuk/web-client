import React, {Dispatch, SetStateAction, useContext} from "react";
import {Box, Grid, SxProps} from "@mui/material";

import {PropertyProps} from "@/interfaces/common";
import {Variant1EstablishmentCard} from "../../../index";
import {VariantContext} from "@/settings/variantEstablishment";
import Variant2EstablishmentCard from "../../cards/variant2EstablishmentCard";
import {useMobile} from "@/hook";

interface IProps {
    items: PropertyProps[],
    setIsOpen?: Dispatch<SetStateAction<boolean>>,
    numberOfColumnsByWidth?: number
}

const PropertiesList = ({items, setIsOpen, numberOfColumnsByWidth}: IProps) => {

    const {width} = useMobile();
    const {variantShowItems} = useContext(VariantContext);

    const defaultNumberOfColumnsByWidth = width < 700 ? 2 : width < 1100 ? 3 : 4;

    const style: SxProps = variantShowItems?.establishment === 'variant_1'
        ? {
            display: 'grid',
            gridTemplateColumns: `repeat(${numberOfColumnsByWidth ? numberOfColumnsByWidth : defaultNumberOfColumnsByWidth}, 1fr)`,
            gap: 1,
            width: '100%',
            p: '0 8px',
            margin: '0 auto',
            justifyItems: 'center'
        } : variantShowItems?.establishment === 'variant_2'
            ? {
                display: 'flex',
                flexDirection: 'column',
                gap: {xs: 0, sm: 2},
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
                    items.map((institution: PropertyProps) => {
                            if (variantShowItems?.establishment === 'variant_2') {
                                return (
                                    <Box
                                        key={institution._id}
                                        onClick={() => {
                                            if (setIsOpen) {
                                                setIsOpen(false)
                                            }
                                        }}
                                        sx={{
                                            width: '100%',
                                            position: 'relative',
                                        }}
                                    >
                                        <Variant2EstablishmentCard establishment={institution}/>
                                    </Box>
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
                                    onClick={() => {
                                        if (setIsOpen) {
                                            setIsOpen(false)
                                        }
                                    }}
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
