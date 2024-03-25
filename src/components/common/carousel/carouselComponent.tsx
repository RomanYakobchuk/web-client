import Carousel, {ResponsiveType} from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import './carousel.css';
import {ReactNode} from "react";

type TProps = {
    children: ReactNode,
    responsive?: {
        [key: string]:{
            breakpoint: {max: number, min: number},
            items: number
        }
    },
    autoPlay?: boolean,
    autoPlaySpeed?: number
}


const defaultResponsive: ResponsiveType = {
    // superLargeDesktop: {
    //     breakpoint: {max: 4000, min: 3000},
    //     items: 1
    // },
    // desktop: {
    //     breakpoint: {max: 3000, min: 1300},
    //     items: 1
    // },
    // tablet: {
    //     breakpoint: {max: 1300, min: 600},
    //     items: 1
    // },
    mobile: {
        breakpoint: {max: 3000, min: 0},
        items: 1
    }
};
const CarouselComponent = ({children, responsive = defaultResponsive, autoPlay = true, autoPlaySpeed = 5000}: TProps) => {


    if (!children) {
        return null;
    }

    return (
        <>
            <Carousel
                ssr={false}
                partialVisbile={false}
                showDots
                draggable
                swipeable
                responsive={responsive}
                infinite
                className={'carousel'}
                autoPlaySpeed={autoPlaySpeed}
                autoPlay={autoPlay}
            >
                {children}
            </Carousel>
        </>
    )
        ;
};
export default CarouselComponent
