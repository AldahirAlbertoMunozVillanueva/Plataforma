import React, { useEffect, useRef, useState } from "react";

export const Carrusel = () => {
  const listRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageData, setImageData] = useState([]);

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
      setCurrentIndex(curr => (curr === 0 ? 0 : curr - 1));
    } else {
      setCurrentIndex(curr => (curr === imageData.length - 1 ? curr : curr + 1));
    }
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    const newImageData = Array.from(files).map(file => ({
      imgUrl: URL.createObjectURL(file)
    }));
    setImageData(newImageData);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
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
              imageData.map((item, index) => (
                <li key={index} className="flex-shrink-0 w-full relative">
                  <img src={item.imgUrl} alt={`Slide ${index}`} className="w-full h-full object-cover" />
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
