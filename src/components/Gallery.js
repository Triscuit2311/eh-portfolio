import React, { useState, useEffect, useMemo } from 'react';
import { useSprings, animated } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import "@/styles/Gallery.css";

export default function FloatyGallery({ artwork_sets }) {

    
    const minSize = 300;
    const maxSize = 400;
    const ratio = 9 / 16;
    const minSlideTime = 3000;
    const maxSlideTime = 9000;
    const marginPercent = 5;
    const centerMarginWidthPercent = 30;
    const centerMarginHeightPercent = 10;
    const fake_width = 3840;
    const fake_height = 2160;

    const slideshow_mass = 20;
    const slideshow_tension = 170;
    const slideshow_friction = 70;


    const artSetSizes = useMemo(() => artwork_sets.map(() => {
        const width = Math.random() * (maxSize - minSize) + minSize;
        const height = width * ratio;
        return { width, height };
    }), [artwork_sets]);

    const [currentSlides, setCurrentSlides] = useState(
        new Array(artwork_sets.length).fill(0)
    );

    useEffect(() => {
        const intervals = artwork_sets.map((_, index) => {
            const timeInterval = Math.random() * (maxSlideTime - minSlideTime) + minSlideTime;
            return setInterval(() => {
                setCurrentSlides(currentSlides =>
                    currentSlides.map((slide, slideIndex) =>
                        index === slideIndex
                            ? slide === artwork_sets[index].items.length - 1 ? 0 : slide + 1
                            : slide
                    )
                );
            }, timeInterval);
        });

        return () => intervals.forEach(interval => clearInterval(interval));
    }, [artwork_sets]);


    const getRandomPosition = (size, margin, centerMarginSize, containerSize) => {
        let position;
        do {
            position = Math.random() * (containerSize - size - 2 * margin) + margin;
        } while (position + size > (containerSize - centerMarginSize) / 2 && position < (containerSize + centerMarginSize) / 2);
        return position;
    };

    // Server side initialization
    const [springs, set] = useSprings(artwork_sets.length, index => {
        const centerMarginWidth = fake_width * centerMarginWidthPercent / 100;
        const centerMarginHeight = fake_height * centerMarginHeightPercent / 100;
        const horizontalMargin = fake_width * marginPercent / 100;
        const verticalMargin = fake_height * marginPercent / 100;
        const x = getRandomPosition(artSetSizes[index].width, horizontalMargin, centerMarginWidth, fake_width);
        const y = getRandomPosition(artSetSizes[index].height, verticalMargin, centerMarginHeight, fake_height);
        return {
            xy: [x, y],
            config: { mass: slideshow_mass, tension: slideshow_tension, friction: slideshow_friction }
        };
    });

    // Client side initialization
    useEffect(() => {
        set(index => {
            const containerRect = document.querySelector('.gallery-container').getBoundingClientRect();

            const centerMarginWidth = containerRect.width * centerMarginWidthPercent / 100;
            const centerMarginHeight = containerRect.height * centerMarginHeightPercent / 100;
            // Calculate margin in pixels
            const horizontalMargin = containerRect.width * marginPercent / 100;
            const verticalMargin = containerRect.height * marginPercent / 100;

            // // // Random position within margins
             const x = getRandomPosition(artSetSizes[index].width, horizontalMargin, centerMarginWidth, containerRect.width);
             const y = getRandomPosition(artSetSizes[index].height, verticalMargin, centerMarginHeight, containerRect.height);


            // let x, y, isPositionUnique;
            // do {
            //     // Random position within margins
            //     x = getRandomPosition(artSetSizes[index].width, horizontalMargin, centerMarginWidth, containerRect.width);
            //     y = getRandomPosition(artSetSizes[index].height, verticalMargin, centerMarginHeight, containerRect.height);
            //     artSetSizes[index].x = x;
            //     artSetSizes[index].y = y;

            //     isPositionUnique = true;
            //     // Check if the position overlaps with any previous positions

            //     const thresh = 50;

            //     for (let i = 0; i < artSetSizes.length; i++) {
            //         if(i === index) continue;
                   
            //         console.log(artSetSizes[i]);

            //         if ( Math.abs(artSetSizes[i].x - x) < thresh || Math.abs(artSetSizes[i].y - y) < thresh ) {
                        
            //             isPositionUnique = false;
            //             break;
            //         }
                    
            //     }
            // } while (!isPositionUnique);

            
            return {
                xy: [x, y],
                config: { mass: slideshow_mass, tension: slideshow_tension, friction: slideshow_friction }
            };
        });
    }, [set, artwork_sets.length, artSetSizes]);



    // Gesture bindings
    const bind = useGesture({
        onDrag: ({ args: [index], movement: [mx, my], memo = springs[index].xy.get() }) => {
            const [initialX, initialY] = memo;
            const containerRect = document.querySelector('.gallery-container').getBoundingClientRect();

            // Calculate margin in pixels based on the percentage
            const horizontalMargin = containerRect.width * marginPercent / 100;
            const verticalMargin = containerRect.height * marginPercent / 100;

            // Calculate new positions with margin constraints
            const newX = Math.min(containerRect.width - artSetSizes[index].width - horizontalMargin,
                Math.max(horizontalMargin, initialX + mx));
            const newY = Math.min(containerRect.height - artSetSizes[index].height - verticalMargin,
                Math.max(verticalMargin, initialY + my));

            set(i => {
                if (index !== i) return;
                return { xy: [newX, newY] };
            });

            return memo;
        }
    });

    if (!springs.length) return null;


    //Function to determine if a slide is the next slide
    const isNextSlide = (artSetIndex, slideIndex) => {
        const nextSlideIndex = (currentSlides[artSetIndex] + 1) % artwork_sets[artSetIndex].items.length;
        return slideIndex === nextSlideIndex;
    };

    return (
        <div className="gallery-container">
            {springs.map(({ xy }, artSetIndex) => (
                <animated.div
                    key={artSetIndex}
                    className="art-set"
                    style={{ transform: xy.to((x, y) => `translate3d(${x}px,${y}px,0)`) }}
                    {...bind(artSetIndex)}
                >
                    <div
                        className={`slide-container`}
                        style={{
                            width: artSetSizes[artSetIndex].width + 'px',
                            height: artSetSizes[artSetIndex].height + 'px'
                        }}
                    >
                        {artwork_sets[artSetIndex].items.map((art_item, slideIndex) => (
                            <div
                                key={slideIndex}
                                className={`slide ${slideIndex === currentSlides[artSetIndex] ? 'current' : ''} ${isNextSlide(artSetIndex, slideIndex) ? 'next' : ''}`}
                            >
                                <div className="media-hover-container">
                                    <div className="media-container">
                                        {/* <div className="overlay"> */}
                                            {/* <h4 className="title">{artwork_sets[artSetIndex].title}</h4> */}
                                            {/* <p className="description">{art_item.title}: {art_item.description}</p> */}
                                        {/* </div> */}
                                        {art_item.type === 'image' ? (
                                            <img src={art_item.file} alt={art_item.title} className="slide-media" />
                                        ) : art_item.type === 'video' ? (
                                            <video src={art_item.file} autoPlay loop muted className="slide-media" />
                                        ) : (
                                            <p>Unsupported type</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </animated.div>
            ))}
        </div>
    );
}