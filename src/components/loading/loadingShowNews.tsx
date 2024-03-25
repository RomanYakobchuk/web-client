import {Box} from "@mui/material";
import React, {useContext} from "react";

import NewSkeleton from "@/components/common/custom/NewSkeleton";
import {useMobile} from "@/hook";
import {ColorModeContext} from "@/contexts";


export const LoadingShowNews = () => {
    const {layoutWidth, width} = useMobile();
    const {collapsed} = useContext(ColorModeContext);

    const height = width < 600 ? '200px' : width < 900 ? '350px' : width > 1500 ? '450px' : '350px';
    const maxWidth = width > 900 ? (collapsed ? 'calc(100vw - 104px)' : 'calc(100vw - 240px)') : 'calc(100vw - 30px)';
    const changeImageWidth = 'calc(100% / 3 - 4px)';
    const changeImageHeight = '80px';

    return (
        <Box>
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: {xs: 'column', lg: 'row'},
                "@media screen and (min-width: 1100px)": {
                    flexDirection: 'row'
                },
                gap: {xs: 2, lg: 4}
            }}>
                <Box sx={{
                    width: '100%',
                    order: {xs: 1, lg: 2},
                    "@media screen and (min-width: 1100px)": {
                        order: 2
                    },
                    maxWidth: '400px'
                }}>
                    <Box sx={{
                        wdith: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        gap: 1.5,
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <NewSkeleton styles={{
                                width: '130px'
                            }}/>
                            <NewSkeleton styles={{
                                width: '130px'
                            }}/>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}>
                            <NewSkeleton styles={{
                                width: '175px'
                            }}/>
                            <NewSkeleton styles={{
                                width: '75px'
                            }}/>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            gap: 0.5,
                            alignItems: 'center',
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.5
                            }}>
                                <NewSkeleton styles={{
                                    height: '20px'
                                }}/>
                                <NewSkeleton styles={{
                                    height: '20px'
                                }}/>
                            </Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'start',
                            width: '100%',
                            justifyContent: {xs: 'space-between', lg: 'start'},
                            flexDirection: {xs: 'row', lg: 'column'}
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1
                            }}>
                                <NewSkeleton styles={{
                                    width: '120px'
                                }}/>
                                <Box sx={{
                                    marginLeft: '32px'
                                }}>
                                    {
                                        [1, 2]?.map((value) => (
                                            <Box key={value} sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                position: 'relative',
                                                color: 'common.white',
                                                gap: 0.5,
                                                "::before": {
                                                    content: '""',
                                                    position: 'absolute',
                                                    left: '-15px',
                                                    top: '5px',
                                                    width: '7px',
                                                    height: '7px',
                                                    borderRadius: '50%',
                                                    bgcolor: 'common.white'
                                                }
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '4px'
                                                }}>
                                                    <NewSkeleton styles={{
                                                        width: '80px',
                                                        height: '20px'
                                                    }}/>
                                                    {'-'}
                                                    <NewSkeleton styles={{
                                                        width: '80px',
                                                        height: '20px'
                                                    }}/>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '4px'
                                                }}>
                                                    <NewSkeleton styles={{
                                                        width: '60px',
                                                        height: '20px'
                                                    }}/>
                                                    {'-'}
                                                    <NewSkeleton styles={{
                                                        width: '60px',
                                                        height: '20px'
                                                    }}/>
                                                </div>
                                            </Box>
                                        ))
                                    }
                                </Box>
                            </Box>
                            <Box>
                                <NewSkeleton styles={{
                                    width: '100px'
                                }}/>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    order: {xs: 2, lg: 1},
                    width: '100%',
                    transition: 'max-width 300ms linear',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: {xs: 4, md: 5, lg: 6},
                    color: 'common.white',
                    maxWidth: '900px',
                    "@media screen and (min-width: 1100px)": {
                        order: 1,
                        maxWidth: {md: `calc(${layoutWidth}px - 400px)`, lg: `calc(${layoutWidth}px - 450px)`}
                    }
                }}>
                    <Box sx={{
                        width: '100%',
                        "& span": {
                            borderRadius: '7px'
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}>
                        <NewSkeleton styles={{
                            width: '100%',
                            height: height,
                        }}/>
                        <Box sx={{
                            width: '100%',
                            maxWidth: maxWidth,
                            pb: '10px',
                        }}>
                            <Box sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                                width: '100%'
                            }}>
                                {
                                    [1, 2, 3]?.map((item) => (
                                        <NewSkeleton
                                            key={item}
                                            styles={{
                                                width: changeImageWidth,
                                                height: {xs: changeImageHeight, md: '100px'},
                                                borderRadius: '12px',
                                            }}
                                        />
                                    ))
                                }
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}>
                        <NewSkeleton styles={{
                            width: '100px',
                            height: '32px'
                        }}/>
                        <NewSkeleton styles={{
                            width: '100%',
                            minHeight: '200px'
                        }}/>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

