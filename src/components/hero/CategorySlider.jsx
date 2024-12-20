import { categorylists } from "../../utils/data";
import { CategoryCard, Container, Heading } from "../../router";
import React, { useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

export const CategorySlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerSlide = 5;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? Math.floor((categorylists.length - 1) / itemsPerSlide) * itemsPerSlide : prevIndex - itemsPerSlide));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerSlide >= categorylists.length ? 0 : prevIndex + itemsPerSlide));
  };

  const showPrevButton = currentIndex > 0;
  const showNextButton = currentIndex + itemsPerSlide < categorylists.length;

  return (
    <>
    <section className="category-slider pb-16">
      <Container>
        <Heading title="Browse the categories" subtitle="Most viewed and all-time top-selling categories" />

        <br />
        <div className="relative flex justify-center items-center">
          {showPrevButton && (
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none px-5"
              onClick={handlePrev}
            >
              <BsChevronLeft size={24} />
            </button>
          )}

          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {categorylists
              .slice(currentIndex, currentIndex + itemsPerSlide)
              .map((item) => (
                <CategoryCard key={item.id} item={item} />
              ))}
          </div>
          {showNextButton && (
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none px-5"
              onClick={handleNext}
            >
              <BsChevronRight size={24} />
            </button>
          )}
        </div>
      </Container>
    </section>
    </>
  );
};
