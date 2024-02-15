import {Box} from "@mui/material";

import React from "react";
import NewSkeleton from "@/components/common/custom/NewSkeleton";
import {useMobile} from "@/hook";

const LoadingCaplDetails = () => {
    const {width} = useMobile();

    const gridItemWidth = `calc(${(width < 500 || (width >= 900 && width < 1100)) ? '100% / 2 - 8px' : (width < 900 || (width > 1100 && width <= 1300)) ? 'calc(100% / 3)' : 'calc(100% / 5)'})`

    return (
        <Box>
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'end'
                }}>
                   <NewSkeleton styles={{
                       width: '150px',
                       height: '40px'
                   }}/>
                </div>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        // display: 'grid',
                        // gridTemplateColumns: `repeat(auto-fit, minmax(${gridItemWidth}, 1fr))`,
                        gap: 1,
                        width: '100%',
                        // gridAutoRows: 'minmax(80px, max-content)',
                    }}
                >
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                            <NewSkeleton
                                key={item}
                                styles={{
                                width: '100%',
                                height: '100px'
                            }}/>
                            )
                        )
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default LoadingCaplDetails;