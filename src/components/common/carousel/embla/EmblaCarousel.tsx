import React, {useCallback} from 'react'
import {EmblaOptionsType, EmblaCarouselType} from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import {DotButton, useDotButton} from './EmblaCarouselDotButton'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import "./embla.css"
import {Box} from "@mui/material";

type PropType = {
    options?: EmblaOptionsType,
    images: string[]
}
const defaultOptions: EmblaOptionsType = {
    dragFree: true,
    loop: true
}
const EmblaCarousel: React.FC<PropType> = ({options = defaultOptions, images}) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])

    const onButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
        const {autoplay} = emblaApi.plugins()
        if (!autoplay) return
        if (autoplay.options.stopOnInteraction !== false) autoplay.stop()
    }, [])

    const {selectedIndex, scrollSnaps, onDotButtonClick} = useDotButton(
        emblaApi,
        onButtonClick
    )

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi, onButtonClick)

    const imageByIndex = (index: number) => {
        return images[index % images?.length]
    }
    const slides = Array.from(Array(images?.length).keys());
    return (
        <Box className='sandbox__carousel theme-light'>
            <div className="embla">
                <div className="embla__viewport" ref={emblaRef}>
                    <div className="embla__container">
                        {slides.map((index) => (
                            <div className="embla__slide" key={index}>
                                {/*<div className="embla__slide__number">*/}
                                {/*    <span>{index + 1}</span>*/}
                                {/*</div>*/}
                                <img
                                    className="embla__slide__img"
                                    src={imageByIndex(index)}
                                    alt="Your alt text"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}/>
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled}/>
                </div>

                <div className="embla__dots">
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={'embla__dot'.concat(
                                index === selectedIndex ? ' embla__dot--selected' : ''
                            )}
                        />
                    ))}
                </div>
            </div>
        </Box>
    )
}

export default EmblaCarousel
