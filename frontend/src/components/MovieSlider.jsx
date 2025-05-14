import { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { Link } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

// MovieSlider component displays a horizontal slider of movies or TV shows for a given category
const MovieSlider = ({ category }) => {
    // Get the current content type (movie or tv) from the global store
    const { contentType } = useContentStore();
    // State to hold the fetched content for the slider
    const [content, setContent] = useState([]);
    // State to control the visibility of navigation arrows
    const [showArrows, setShowArrows] = useState(false);

    // Ref to access the slider DOM element for scrolling
    const sliderRef = useRef(null);

    // Format the category name for display (e.g., "top_rated" -> "Top rated")
    const formattedCategoryName =
        category.replaceAll("_", " ")[0].toUpperCase() + category.replaceAll("_", " ").slice(1);
    // Format the content type for display ("Movies" or "TV Shows")
    const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";

    // Fetch content from the backend API whenever contentType or category changes
    useEffect(() => {
        const getContent = async () => {
            const res = await axios.get(`/api/v1/${contentType}/${category}`);
            setContent(res.data.content);
        };

        getContent();
    }, [contentType, category]);

    // Scroll the slider to the left by its own width
    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
        }
    };
    // Scroll the slider to the right by its own width
    const scrollRight = () => {
        sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
    };

    return (
        // Main container with mouse events to show/hide arrows
        <div
            className='bg-black text-white relative px-5 md:px-20'
            onMouseEnter={() => setShowArrows(true)}
            onMouseLeave={() => setShowArrows(false)}
        >
            {/* Slider title */}
            <h2 className='mb-4 text-2xl font-bold'>
                {formattedCategoryName} {formattedContentType}
            </h2>

            {/* Horizontal scrollable slider */}
            <div className='flex space-x-4 overflow-x-scroll scrollbar-hide' ref={sliderRef}>
                {content.map((item) => (
                    // Each movie/TV show links to its watch page
                    <Link to={`/watch/${item.id}`} className='min-w-[250px] relative group' key={item.id}>
                        <div className='rounded-lg overflow-hidden'>
                            <img
                                src={SMALL_IMG_BASE_URL + item.backdrop_path}
                                alt='Movie image'
                                className='transition-transform duration-300 ease-in-out group-hover:scale-125'
                            />
                        </div>
                        <p className='mt-2 text-center'>{item.title || item.name}</p>
                    </Link>
                ))}
            </div>

            {/* Navigation arrows, shown on hover */}
            {showArrows && (
                <>
                    <button
                        className='absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            '
                        onClick={scrollLeft}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        className='absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            '
                        onClick={scrollRight}
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}
        </div>
    );
};
export default MovieSlider;