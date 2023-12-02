import Carousel from 'react-multi-carousel';
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
    }
}


const defaultResponsive = {
    superLargeDesktop: {
        breakpoint: {max: 4000, min: 3000},
        items: 5
    },
    desktop: {
        breakpoint: {max: 3000, min: 1300},
        items: 3
    },
    tablet: {
        breakpoint: {max: 1300, min: 600},
        items: 2
    },
    mobile: {
        breakpoint: {max: 600, min: 0},
        items: 1
    }
};
const CarouselComponent = ({children, responsive = defaultResponsive}: TProps) => {


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
            >
                {children}
            </Carousel>
        </>
    )
        ;
};
export default CarouselComponent
