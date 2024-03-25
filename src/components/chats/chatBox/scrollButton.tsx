import {useInView} from "react-intersection-observer";
import {useEffect, useLayoutEffect, useRef} from "react";
import {Box, Button} from "@mui/material";
import {SouthRounded} from "@mui/icons-material";

type TProps = {
    isShowBtn?: boolean,
    dependency?: string
}
export const ScrollButton = ({isShowBtn, dependency}: TProps) => {

    const scrollRef = useRef<HTMLDivElement | null>(null);

    const {inView, ref: inViewRef} = useInView({
        threshold: 0.5
    });

    const scrollToBottom = (behavior: 'auto' | 'smooth') => {
        if (scrollRef.current) {
            scrollRef.current?.scrollIntoView({behavior: behavior})
        }
    }

    // useLayoutEffect(() => {
    //     if (isShowBtn) {
    //         const timer = setTimeout(() => {
    //             scrollToBottom('smooth');
    //         }, 300)
    //         return () => {
    //             clearTimeout(timer)
    //         }
    //     }
    // }, [isShowBtn, dependency]);

    return (
        <>
            <Box sx={{
                mt: '-10px',
                mb: '10px'
            }}>
                <div ref={inViewRef}/>
                <div ref={scrollRef}/>
            </Box>
            {
                isShowBtn && !inView && (
                    <Button
                        onClick={() => scrollToBottom('smooth')}
                        variant={'contained'}
                        // color={'secondary'}
                        sx={{
                            position: 'fixed',
                            bottom: '10px',
                            zIndex: 100,
                            right: {xs: '10px', lg: '20px'},
                            width: '36px',
                            minWidth: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            bgcolor: '#f9f9f9',
                            // bgcolor: '#e0e3e5 !important',
                            boxShadow: '0px 4px 8px 0px rgba(125, 125, 125, 0.6)'
                        }}>
                        <SouthRounded sx={{
                            color: 'black'
                        }}/>
                    </Button>
                )
            }
        </>
    );
};

