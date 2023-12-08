import {Box, Skeleton, SxProps} from "@mui/material";
import {useContext} from "react";
import {ColorModeContext} from "@/contexts";

export const DetailsSkeleton = () => {

    const {mode} = useContext(ColorModeContext);

    const sameStyles: SxProps = {
        bgcolor: mode === 'dark' ? '#6b6b6b' : 'rgba(192, 192, 192, 0.8)'
    }

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Skeleton
                    sx={{
                        width: {xs: '150px', sm: '200px'},
                        height: '24px',
                        borderRadius: '10px',
                        ...sameStyles
                    }}
                    animation={"wave"}
                    variant={"rectangular"}
                />
                <Skeleton
                    sx={{
                        width: {xs: '100px', sm: '150px'},
                        height: '24px',
                        borderRadius: '10px',
                        ...sameStyles
                    }}
                    animation={"wave"}
                    variant={"rectangular"}
                />
            </Box>
            <Skeleton
                sx={{
                    width: '100%',
                    maxWidth: '300px',
                    height: '24px',
                    borderRadius: '10px',
                    ...sameStyles
                }}
                animation={"wave"}
                variant={"rectangular"}
            />
            <Skeleton
                sx={{
                    width: '100%',
                    height: '300px',
                    borderRadius: '10px',
                    ...sameStyles
                }}
                animation={"wave"}
                variant={"rectangular"}
            />
        </Box>
    );
};

