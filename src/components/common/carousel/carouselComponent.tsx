import Carousel, {ResponsiveType} from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import './carousel.css';
import {ReactNode} from "react";

type TProps = {
    children: ReactNode,
    responsive?: ResponsiveType,
    autoPlay?: boolean,
    autoPlaySpeed?: number,
    centerMode?: boolean,
    partialVisible?: boolean
}


const defaultResponsive: ResponsiveType = {
    mobile: {
        breakpoint: {max: 3000, min: 0},
        items: 1
    }
};
const CarouselComponent = ({children, responsive = defaultResponsive, partialVisible = false, centerMode = false, autoPlay = true, autoPlaySpeed = 5000}: TProps) => {


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
                centerMode={centerMode}
                swipeable
                responsive={responsive}
                infinite
                className={'carousel'}
                autoPlaySpeed={autoPlaySpeed}
                autoPlay={autoPlay}
                partialVisible={partialVisible}
            >
                {children}
            </Carousel>
        </>
    )
        ;
};
export default CarouselComponent
