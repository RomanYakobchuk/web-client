import {Box, Skeleton} from "@mui/material";
import {useMobile} from "@/hook";

const DonutStatSkeleton = () => {
    const {width} = useMobile();
    return (
        <Box
            sx={{
                bgcolor: 'common.black',
                minWidth: {xs: '300px'},
                width: '100%',
                borderRadius: '15px',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}
        >
            <Skeleton
                width={200} variant={'text'}
                height={40}
                sx={{
                    bgcolor: 'silver'
                }}
            />
            <Box sx={{
                display: 'flex',
                gap: {xs: 4},
                alignItems: {xs: 'start', sm: 'center'},
                flexDirection: {xs: 'column', lg: 'row'}
            }}>
                <Skeleton
                    width={200} variant={'circular'}
                    height={200}
                    sx={{
                        bgcolor: 'silver'
                    }}
                />
                <Skeleton
                    width={250} variant={'rectangular'}
                    height={200}
                    sx={{
                        bgcolor: 'silver',
                        borderRadius: '10px'
                    }}
                />
            </Box>
        </Box>
    );
};
export default DonutStatSkeleton
