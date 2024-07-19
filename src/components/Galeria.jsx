import React, { useEffect, useRef, useState } from "react";
import { data } from "../assets/data"; // Asegúrate de que la ruta es correcta

export const Galeria = () => {
  const listRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageData = data;

  useEffect(() => {
    const listNode = listRef.current;
    const imgNode = listNode.querySelectorAll("li")[currentIndex];

    if (imgNode) {
      imgNode.scrollIntoView({
        behavior: "smooth",
        inline: "center"
      });
    }
  }, [currentIndex]);

  const scrollToImage = (direction) => {
    if (direction === 'prev') {
      setCurrentIndex(curr => {
        const isFirstSlide = currentIndex === 0;
        return isFirstSlide ? 0 : curr - 1;
      });
    } else {
      const isLastSlide = currentIndex === imageData.length - 1;
      if (!isLastSlide) {
        setCurrentIndex(curr => curr + 1);
      }
    }
  }

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  }

  return (
    <div className="w-[500px] h-[280px] mx-auto">
      <div className="relative h-full">
        <div className='leftArrow absolute top-1/2 transform -translate-y-1/2 left-8 text-4xl font-bold text-white z-10 cursor-pointer' onClick={() => scrollToImage('prev')}>&#10092;</div>
        <div className='rightArrow absolute top-1/2 transform -translate-y-1/2 right-8 text-4xl font-bold text-white z-10 cursor-pointer' onClick={() => scrollToImage('next')}>&#10093;</div>
        <div className="container-images w-full h-full rounded-lg border border-gray-300 overflow-hidden">
          <ul ref={listRef} className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {
              imageData.map((item) => (
                <li key={item.id} className="flex-shrink-0 w-full">
                  <img src={item.imgUrl} alt={`Slide ${item.id}`} className="w-full h-[280px] object-cover" />
                </li>
              ))
            }
          </ul>
        </div>
        <div className="dots-container flex justify-center mt-2">
          {
            imageData.map((_, idx) => (
              <div
                key={idx}
                className={`dot-container-item mx-1 cursor-pointer text-sm text-center ${idx === currentIndex ? "bg-gray-400 w-4 h-4 rounded-full" : ""}`}
                onClick={() => goToSlide(idx)}
              >
                &#9865;
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

