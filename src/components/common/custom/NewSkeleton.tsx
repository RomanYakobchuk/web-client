import React, {useContext} from "react";
import {ColorModeContext} from "@/contexts";
import {Skeleton, SkeletonOwnProps, SxProps} from "@mui/material";

type TNewSkeleton = {
    variant?: SkeletonOwnProps['variant'],
    styles?: SxProps
}
const NewSkeleton = ({variant = 'rectangular', styles}: TNewSkeleton) => {
    const {mode} = useContext(ColorModeContext);
    return (
        <Skeleton
            sx={{
                width: {xs: '150px', sm: '200px'},
                height: '28px',
                borderRadius: '10px',
                bgcolor: mode === 'light' ? 'rgba(15, 15, 15, 0.3)' : 'rgba(220, 220, 220, 0.3)',
                ...styles
            }}
            animation={"wave"}
            variant={variant}
        />
    )
}
export default NewSkeleton;
//boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)'