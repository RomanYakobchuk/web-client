import {Box, Stack} from "@mui/material";

import {useMobile} from "@/hook";
import NewSkeleton from "@/components/common/custom/NewSkeleton";

const LoadingDetails = () => {

    const {width} = useMobile();

    const height = width < 600 ? '208px' : width < 900 ? '308px' : width < 1200 ? '408px' : '388px';
    const height2 = width < 600 ? '100px' : width < 900 ? '150px' : width < 1200 ? '200px' : '195px';

    return (
        <Box sx={{
            display: 'flex',
            gap: 2,
            flexDirection: {xs: 'column', xl: 'row'}
        }}>
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                width: {xl: '250px'},
                height: 'fit-content'
            }}>
                <NewSkeleton/>
                <NewSkeleton/>
                <NewSkeleton styles={{
                    width: '100px'
                }}/>
                <Box sx={{
                    width: {xs: '100%', sm: 'fit-content'},
                    display: 'flex',
                    gap: 1
                }}>
                    <NewSkeleton styles={{
                        width: {xs: '36px', sm: '100px'}
                    }}/>
                    <NewSkeleton styles={{
                        width: {xs: '36px', sm: '100px'}
                    }}/>
                </Box>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    flex: {xs: 1, lg: 7},
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    p: 0
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column',},
                    justifyContent: {xs: 'start', sm: 'space-between'}
                }}>
                    <Box>
                        <Box sx={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            "@media screen and (max-width: 800px && min-width: 600px)": {
                                alignItems: 'start'
                            },
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 1
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: {xs: 3, sm: 6},
                                alignItems: 'center',
                            }}>
                                <NewSkeleton styles={{
                                    width: '200px'
                                }}/>
                                <NewSkeleton styles={{
                                    width: '80px'
                                }}/>
                            </Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 1,
                            alignItems: 'center',
                            m: '10px 0'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.5
                            }}>
                                <NewSkeleton styles={{
                                    width: '120px',
                                    height: '24px'
                                }}/>
                                <NewSkeleton styles={{
                                    width: '210px',
                                    height: '24px'
                                }}/>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', sm: 'row'},
                        justifyContent: 'space-between',
                        gap: {xs: 2, sm: 0},
                        alignItems: {xs: 'start', sm: 'center'},
                        width: '100%',
                        mb: 2
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 1,
                            alignItems: 'center',
                        }}>
                            <NewSkeleton styles={{
                                width: '220px',
                            }}/>
                        </Box>
                        <NewSkeleton styles={{
                            width: '220px',
                        }}/>
                    </Box>
                </Box>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {xs: '1fr', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)', lg: 'repeat(8, 1fr)'},
                    gridAutoRows: 'auto',
                    width: '100%',
                    gap: {xs: 2, md: 3},
                    "& > div:nth-of-type(1)": {
                        order: 1,
                        gridColumn: {sm: 'span 3', md: 'span 6', lg: 'span 5'}
                    },
                    "& > div:nth-of-type(2)": {
                        order: {xs: 3, lg: 4},
                        gridColumn: {sm: 'span 2', md: 'span 4', lg: 'span 8'}
                    },
                    "& > div:nth-of-type(3)": {
                        order: {xs: 2, lg: 3},
                        gridColumn: {sm: 'span 1', md: 'span 2', lg: 'span 5'}
                    },
                    "& > div:nth-of-type(4)": {
                        order: {xs: 4, lg: 2},
                        height: {xs: '300px', sm: '350px', md: '400px', lg: '100%'},
                        gridRow: {lg: 'span 2'},
                        gridColumn: {sm: 'span 3', md: 'span 6', lg: 'span 3'}
                    },
                    "& > div:nth-of-type(5)": {
                        order: {xs: 5, lg: 7},
                        gridColumn: {sm: 'span 3', lg: 'span 3'}
                    },
                    "& > div:nth-of-type(6)": {
                        order: {xs: 6, lg: 6},
                        gridColumn: {sm: 'span 3', lg: 'span 5'}
                    },

                }}>
                    <Box sx={{
                        display: "grid",
                        gap: 1,
                        gridTemplateColumns: "2fr 1fr",
                        borderRadius: "20px",
                        overflow: "hidden",
                        width: '100%',
                        height,
                    }}>
                        <NewSkeleton styles={{
                            height,
                            width: '100%',
                            borderRadius: 0
                        }}/>
                        <Box sx={{
                            display: "grid",
                            gap: 1,
                            gridTemplateRows: '1fr 1fr',
                            overflow: "hidden",
                        }}>
                            <NewSkeleton styles={{
                                height: height2,
                                width: '100%',
                                borderRadius: 0
                            }}/>
                            <NewSkeleton styles={{
                                height: height2,
                                width: '100%',
                                borderRadius: 0
                            }}/>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        bgcolor: 'modern.modern_1.second',
                        p: '10px',
                        borderRadius: '15px',
                    }}>
                        <NewSkeleton styles={{
                            width: '100px'
                        }}/>
                        <NewSkeleton styles={{
                            width: '100%',
                            minHeight: '200px',
                            height: '100%'
                        }}/>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                        flexDirection: 'column',
                        p: '10px',
                        borderRadius: '15px',
                        justifyContent: 'start',
                        bgcolor: 'modern.modern_1.second',
                        alignItems: 'start',
                        gap: 1
                    }}>
                        <NewSkeleton styles={{
                            width: '130px'
                        }}/>
                        <Stack sx={{
                            gap: 1
                        }}>
                            {
                                [1, 2]?.map((v) => (
                                    <Box key={v} sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: "start",
                                        alignItems: 'start',
                                        ml: 1,
                                        gap: 1,
                                        color: 'common.white'
                                    }}>
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 0.5
                                        }}>
                                            <NewSkeleton styles={{
                                                width: {xs: '80px', md: '60px', lg: '80px'},
                                                height: '18px'
                                            }}/>
                                            {'-'}
                                            <NewSkeleton styles={{
                                                width: {xs: '80px', md: '60px', lg: '80px'},
                                                height: '18px'
                                            }}/>
                                        </Box>
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 0.5
                                        }}>
                                            <NewSkeleton styles={{
                                                width: {xs: '120px', md: '70px', lg: '120px'},
                                                height: '18px'
                                            }}/>
                                            {'-'}
                                            <NewSkeleton styles={{
                                                width: {xs: '120px', md: '70px', lg: '120px'},
                                                height: '18px'
                                            }}/>
                                        </Box>
                                    </Box>
                                ))
                            }
                        </Stack>
                        <NewSkeleton styles={{
                            width: '100px'
                        }}/>
                        <NewSkeleton styles={{
                            width: '180px',
                            height: '24px'
                        }}/>
                    </Box>
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                    }}>
                        <NewSkeleton styles={{
                            width: '100%',
                            height: '100%',
                        }}/>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        p: '15px',
                        color: 'common.white',
                        borderRadius: '15px',
                        bgcolor: 'modern.modern_1.second',
                        width: '100%'
                    }}>
                        <Box sx={{
                            width: '100%',
                            borderBottom: '1px solid silver',
                            pb: 1
                        }}>
                            <NewSkeleton styles={{
                                width: '100px'
                            }}/>
                            <Box sx={{
                                ml: 1,
                                mt: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1
                            }}>
                                {
                                    [1, 2, 3]?.map((v) => (
                                        <NewSkeleton
                                            styles={{
                                                height: '22px'
                                            }}
                                            key={v}/>
                                    ))
                                }
                            </Box>
                        </Box>
                        <Box sx={{
                            diaply: 'flex',
                            flexDirection: 'column'
                        }}>
                            <NewSkeleton styles={{
                                width: '100px'
                            }}/>
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                ml: 1,
                                mt: 1,
                                gap: 0.5,
                            }}>
                                {
                                    [2, 4, 3]?.map((v) => (
                                        <NewSkeleton
                                            key={v}
                                            styles={{
                                                borderRadius: '20px',
                                                height: '24px',
                                                width: `calc((100 / 3) * ${v}px)`
                                            }}
                                        />
                                    ))
                                }
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        p: '15px',
                        borderRadius: '15px',
                        color: 'common.white',
                        bgcolor: 'modern.modern_1.second',
                    }}>
                        <NewSkeleton styles={{
                            width: '100px'
                        }}/>
                        <Box sx={{
                            ml: 1,
                            mt: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                        }}>
                            {
                                [1, 2, 3]?.map((v) => (
                                    <NewSkeleton
                                        styles={{
                                            height: '22px'
                                        }}
                                        key={v}/>
                                ))
                            }
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
export default LoadingDetails;


