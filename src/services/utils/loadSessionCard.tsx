import NewSkeleton from "@/components/common/custom/NewSkeleton";
import {Box} from "@mui/material";

export const LoadSessionCard = () => {
    return (
        <Box sx={{
            width: '100%',
            height: '100px',
            borderRadius: '10px',
            bgcolor: 'modern.modern_1.second',
            p: 1,
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            justifyContent: 'space-between'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 1
            }}>
                <NewSkeleton styles={{
                    width: '75px',
                    height: '90%',
                    borderRadius: '5px',
                    margin: 'auto 0'
                }}/>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    justifyContent: 'space-between'
                }}>
                    <NewSkeleton styles={{
                        width: '150px',
                        height: '20px',
                        borderRadius: '5px'
                    }}/>
                    <NewSkeleton styles={{
                        width: '150px',
                        height: '20px',
                        borderRadius: '5px'
                    }}/>
                    <NewSkeleton styles={{
                        width: '150px',
                        height: '20px',
                        borderRadius: '5px'
                    }}/>
                </Box>
            </Box>
            <Box sx={{
                height: '100%',
                width: 'fit-content',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <NewSkeleton styles={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '5px'
                }}/>
            </Box>
        </Box>
    );
};

