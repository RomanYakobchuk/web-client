import {Box} from "@mui/material";

import NewSkeleton from "@/components/common/custom/NewSkeleton";

export const LoadingShowNotification = () => {



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
                <NewSkeleton
                    styles={{
                        width: {xs: '150px', sm: '200px'},
                        height: '24px',
                        borderRadius: '10px',
                    }}
                />
                <NewSkeleton
                    styles={{
                        width: {xs: '100px', sm: '150px'},
                        height: '24px',
                        borderRadius: '10px',
                    }}
                />
            </Box>
            <NewSkeleton
                styles={{
                    width: '100%',
                    maxWidth: '300px',
                    height: '24px',
                    borderRadius: '10px',
                }}
            />
            <NewSkeleton
                styles={{
                    width: '100%',
                    height: '300px',
                    borderRadius: '10px',
                }}
            />
        </Box>
    );
};

