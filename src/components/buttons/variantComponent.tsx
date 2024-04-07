import {FormatListBulleted, GridViewOutlined} from "@mui/icons-material";
import {Button, ButtonGroup} from "@mui/material";
import React, {ReactNode, useContext, useEffect, useState} from "react";

import {VariantContext} from "@/settings/variantEstablishment";

type TProps = {
    type: "establishment" | "news",
    variant1Icon?: ReactNode | null,
    variant2Icon?: ReactNode | null
}

const VariantComponent = ({type, variant2Icon = <FormatListBulleted/>, variant1Icon = <GridViewOutlined/>}: TProps) => {

    if (!variant2Icon) {
        variant2Icon = <FormatListBulleted/>
    }
    if (!variant1Icon) {
        variant1Icon = <GridViewOutlined/>
    }

    const {setVariantShowItems, variantShowItems} = useContext(VariantContext);

    const [variant, setVariant] = useState<"variant_1" | "variant_2">("variant_1");

    useEffect(() => {
            setVariant(variantShowItems[type])
    }, [type, variantShowItems[type]]);

    return (
        <ButtonGroup variant={'contained'} sx={{
            p: '5px',
            gap: 1,
            borderRadius: '7px',
            border: `1px solid silver`,
            boxShadow: '0px 0px 2px 0px #000',
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
                },
                // "& svg":{
                //     color: 'common.black'
                // }
            }
        }}>
            {
                [
                    {
                        icon: variant1Icon,
                        variant: 'variant_1' as 'variant_1'
                    },
                    {
                        icon: variant2Icon,
                        variant: 'variant_2' as 'variant_2'
                    }
                ].map((item, index) => (
                    <Button className={'variantButton'} key={index}
                            onClick={() => {
                                // if (type === 'establishment') {
                                    setVariantShowItems({...variantShowItems, [type]: item?.variant})
                                // } else if (type === 'news') {
                                //     setNewsVariant(item.variant)
                                // }
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
