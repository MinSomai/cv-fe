import React from "react";
import { useSwiper } from "swiper/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const SwiperNavButtons = () => {
  const swiper = useSwiper();

  return (
    <div className="swip-nav-btns">
      <div className="bg-gradient-to-r from-[#FAFBFE] from-50% to-transparent absolute h-full w-12 top-0 left-0 z-10" />
      <button
        className="swiper-button-custom prev hover:bg-[#F2F2F2]"
        onClick={() => swiper.slidePrev()}
      >
        <ChevronLeft size={20} />
      </button>
      <div className="bg-gradient-to-l from-[#FAFBFE] from-50% to-transparent absolute h-full w-12 top-0 right-0 z-10" />
      <button
        className="swiper-button-custom next hover:bg-[#F2F2F2]"
        onClick={() => swiper.slideNext()}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
