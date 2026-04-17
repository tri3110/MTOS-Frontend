"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
// import MovieDialog from "./app.movie.dialog";
import { useRouter } from "next/navigation";

interface themeStyle {
    text: string;
}

interface Props {
    sliders: SliderType[];
    themeStyle: themeStyle;
}

export default function AppSlider(props: Props) {
    const router = useRouter();
    const {sliders, themeStyle} = props;

    const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        slides: {
            perView: 1,
            spacing: 1,
        },
        breakpoints: {
            "(max-width: 768px)": {
                slides: {
                    perView: 1,
                    spacing: 1,
                },
            },
        },
    });

    useEffect(() => {
        const slider = instanceRef.current;
        if (!slider) return;

        let interval: NodeJS.Timeout;

        const start = () => {
            interval = setInterval(() => {
                slider.next();
            }, 4000);
        };

        const stop = () => {
            clearInterval(interval);
        };

        start();

        slider.container.addEventListener("mouseenter", stop);
        slider.container.addEventListener("mouseleave", start);

        return () => {
            stop();
            slider.container.removeEventListener("mouseenter", stop);
            slider.container.removeEventListener("mouseleave", start);
        };
    }, [instanceRef]);

    return (
        <div ref={sliderRef} className="keen-slider py-4">
            {sliders.map((slider, index) => (
                <div key={index} className="keen-slider__slide">
                    <div className="rounded-lg overflow-hidden ">
                        <div className="relative">
                            <img
                                src={process.env.NEXT_PUBLIC_HTTP_ADMIN_MEDIA + (slider.image ?? "")}
                                alt={slider.title}
                                className="w-full h-72 object-contain cursor-pointer"
                                onClick={()=>router.push("/detail/" + slider.id)}
                            />
                            {/* <div className={`w-full absolute px-2 top-1 left-1 bg-blue-700 text-xl truncate py-2 text-sm font-medium 
                                    ${themeStyle.text} group-hover:text-pink-400 `
                                }>
                                {slider.title}
                            </div> */}
                        </div>
                    </div>
                </div>
            ))}
            <button
                onClick={() => instanceRef.current?.prev()}
                className="absolute left-1 top-1/2 -translate-y-1/2 bg-white dark:bg-blue-700 border-[2px] border-gray-300
                text-black dark:text-white px-1 py-3 rounded-full shadow-md hover:bg-blue-400 hover:text-white z-10"
            >
                <ChevronLeftIcon className="h-5 w-5" />
            </button>

            <button
                onClick={() => instanceRef.current?.next()}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-white dark:bg-blue-700 border-[2px] border-gray-300
                text-black dark:text-white px-1 py-3 rounded-full shadow-md hover:bg-blue-400 hover:text-white z-10"
            >
                <ChevronRightIcon className="h-5 w-5" />
            </button>
        </div>
    );
}