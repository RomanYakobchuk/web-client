import {FormatListBulleted, GridViewOutlined} from "@mui/icons-material";
import {Button, ButtonGroup} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";

import {VariantContext} from "../../../settings/variantEstablishment";

type TProps = {
    type: "establishment" | "news"
}

const VariantComponent = ({type}: TProps) => {

    const {variant: placeVariant, setVariant: setPlaceVariant, setNewsVariant, newsVariant} = useContext(VariantContext);

    const [variant, setVariant] = useState<"variant_1" | "variant_2">("variant_1");

    useEffect(() => {
        if (type === 'establishment') {
            setVariant(placeVariant)
        } else if (type === 'news') {
            setVariant(newsVariant)
        }
    }, [type, placeVariant, newsVariant]);

    return (
        <ButtonGroup variant={'contained'} sx={{
            p: '5px',
            gap: 1,
            bgcolor: 'common.black',
            borderRadius: '10px',
            border: `1px solid silver`,
            "& button": {
                height: '30px !important',
                borderRadius: '5px !important',
                p: '0 10px !important',
                transition: '300ms linear',
                "&:hover": {
                    bgcolor: 'common.white',
                    color: 'common.black',
                },
                "&:not(:last-of-type)": {
                    position: 'relative',
                    borderRight: 'unset !important',
                }
            }
        }}>
            {
                [
                    {
                        icon: <FormatListBulleted/>,
                        variant: 'variant_1' as 'variant_1'
                    },
                    {
                        icon: <GridViewOutlined/>,
                        variant: 'variant_2' as 'variant_2'
                    }
                ].map((item, index) => (
                    <Button key={index}
                            onClick={() => {
                                if (type === 'establishment') {
                                    setPlaceVariant(item.variant)
                                } else if (type === 'news') {
                                    setNewsVariant(item.variant)
                                }
                            }}
                            sx={{
                                bgcolor: variant === item.variant ? 'common.white' : 'transparent',
                                color: variant === item.variant ? 'common.black' : 'unset',
                            }}
                    >
                        {item.icon}
                    </Button>
                ))
            }
        </ButtonGroup>
    );
};
export default VariantComponent
