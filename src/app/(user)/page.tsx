'use client'

import AppSlider from "@/components/user/user.slider";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const themeStyle = {
    Dark : {
        text: "text-white"
    },
    Light: {
        text: "text-gray-800"
    }
}

export default function HomePage() {
  const { t } = useTranslation();
  const [dataSliders, setDataSliders] = useState<SliderType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_HTTP_GUEST + "sliders/home/get/",
          {
              method: "GET",
              credentials: "include",
          }
        )
        const data = await response.json();
        setDataSliders(data.data);

      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      }
    };
    fetchData();
  }, []);

  if (!dataSliders || dataSliders.length === 0){
    return (
      <div>
        Loading....
      </div>
    );
  }

  return (
    <>
      <div className='bg-pink-50'>
        <div className="px-4 max-w-screen-xl mx-auto bg-white">
          <AppSlider sliders={dataSliders} themeStyle={themeStyle.Dark}/>
        </div>
      </div>
    </>
  );
}