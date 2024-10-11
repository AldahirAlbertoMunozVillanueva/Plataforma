import React, { useEffect, useRef, useState } from "react";

export const Carrusel = () => {
  const listRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Datos de las imágenes para el carrusel
  const imageData = [
    {
      id: 1,
      imgUrl: "https://tecdn.b-cdn.net/img/Photos/Slides/img%20(15).jpg",
      label: "First slide label",
      description: "Some representative placeholder content for the first slide."
    },
    {
      id: 2,
      imgUrl: "https://tecdn.b-cdn.net/img/Photos/Slides/img%20(22).jpg",
      label: "Second slide label",
      description: "Some representative placeholder content for the second slide."
    },
    {
      id: 3,
      imgUrl: "https://tecdn.b-cdn.net/img/Photos/Slides/img%20(23).jpg",
      label: "Third slide label",
      description: "Some representative placeholder content for the third slide."
    }
  ];

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
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative h-64">
        <div 
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-4xl font-bold text-white cursor-pointer z-10" 
          onClick={() => scrollToImage('prev')}
        >
          &#10092;
        </div>
        <div 
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-4xl font-bold text-white cursor-pointer z-10" 
          onClick={() => scrollToImage('next')}
        >
          &#10093;
        </div>
        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-300">
          <ul ref={listRef} className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {
              imageData.map((item) => (
                <li key={item.id} className="flex-shrink-0 w-full relative">
                  <img src={item.imgUrl} alt={`Slide ${item.id}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-5 text-center text-white bg-black bg-opacity-50 py-2">
                    <h5 className="text-xl">{item.label}</h5>
                    <p>{item.description}</p>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="flex justify-center mt-2">
          {
            imageData.map((_, idx) => (
              <div
                key={idx}
                className={`mx-1 cursor-pointer text-sm ${idx === currentIndex ? "bg-gray-400 w-4 h-4 rounded-full" : "bg-gray-200 w-3 h-3 rounded-full"}`}
                onClick={() => goToSlide(idx)}
              />
            ))
          }
        </div>
      </div>
    </div>
  );
};
