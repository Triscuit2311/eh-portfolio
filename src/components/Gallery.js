import React, { useState, useEffect, useMemo } from 'react';
import "@/styles/Gallery.css";

export default function Gallery({ artwork_sets }) {



    const minSize = 100;
    const maxSize = 400;
    const minSlideTime = 3000;
    const maxSlideTime = 9000;

    // Assigning sizes to each art set using useMemo
    const artSetSizes = useMemo(() => artwork_sets.map(() => ({
        width: Math.random() * (maxSize - minSize) + minSize,
        height: Math.random() * (maxSize - minSize) + minSize
    })), [artwork_sets]);



    const [currentSlides, setCurrentSlides] = useState(
        new Array(artwork_sets.length).fill(0)
    );
    const [expandedSlideshow, setExpandedSlideshow] = useState(null);

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

    // Function to determine if a slide is the next slide
    const isNextSlide = (artSetIndex, slideIndex) => {
        const nextSlideIndex = (currentSlides[artSetIndex] + 1) % artwork_sets[artSetIndex].items.length;
        return slideIndex === nextSlideIndex;
    };

    // Toggle expanded mode for a specific slideshow
    const toggleExpanded = (index) => {
        setExpandedSlideshow(expandedSlideshow === index ? null : index);
        document.body.classList.toggle('expanded-content', expandedSlideshow === index ? null : index);
    };

    return (
        <div className="gallery-container">
            {artwork_sets.map((art_set, artSetIndex) => (
                <div key={artSetIndex} className="art-set">
                    <div
                        className={`slide-container ${expandedSlideshow === artSetIndex ? 'expanded' : ''}`}
                        onClick={() => toggleExpanded(artSetIndex)}
                        style={{ 
                            width: artSetSizes[artSetIndex].width + 'px', 
                            height: artSetSizes[artSetIndex].height + 'px'
                        }}
                    >
                        {art_set.items.map((art_item, slideIndex) => (
                            <div
                                key={slideIndex}
                                className={`slide ${slideIndex === currentSlides[artSetIndex] ? 'current' : ''} ${isNextSlide(artSetIndex, slideIndex) ? 'next' : ''}`}
                            >
                                <div className="media-hover-container">
                                    <div className="media-container">
                                        <div className="overlay">
                                            <h3 className="title">{art_set.title}</h3>
                                            <p className="description">{art_item.title}: {art_item.description}</p>
                                        </div>
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
                </div>
            ))}
        </div>
    );
}
