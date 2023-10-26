import {PropertyProps} from "../../../../interfaces/common";
import {Box, Grid, SxProps} from "@mui/material";
import {Variant1EstablishmentCard} from "../../../index";
import React, {Dispatch, SetStateAction, useContext} from "react";
import {VariantContext} from "../../../../settings/variantEstablishment";
import Variant2EstablishmentCard from "../../cards/variant2EstablishmentCard";
import {useMobile} from "../../../../hook";

interface IProps {
    items: PropertyProps[],
    setIsOpen?: Dispatch<SetStateAction<boolean>>
}

const PropertiesList = ({items, setIsOpen}: IProps) => {

    const {width} = useMobile();
    const {variant} = useContext(VariantContext);

    const numberOfColumnsByWidth = width < 700 ? 2 : width < 1100 ? 3 : 4;

    const style: SxProps = variant === 'variant_2'
        ? {
            display: 'grid',
            gridTemplateColumns: `repeat(${numberOfColumnsByWidth}, 1fr)`,
            gap: 1,
            width: '100%',
            margin: '0 auto',
            justifyItems: 'center'
        } : variant === 'variant_1'
            ? {
                display: 'flex',
                flexDirection: 'column',
                gap: {sm: 2},
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
                                            "&:not(:last-of-type)": {
                                                position: 'relative',
                                                borderRight: 'unset !important',
                                                "&::after": {
                                                    content: "''",
                                                    display: {xs: 'block', sm: 'none'},
                                                    position: 'absolute',
                                                    bottom: '0',
                                                    left: 0,
                                                    right: 0,
                                                    margin: '0 auto',
                                                    height: '1px',
                                                    width: '95%',
                                                    bgcolor: 'silver',
                                                    zIndex: 10
                                                }
                                            }
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
