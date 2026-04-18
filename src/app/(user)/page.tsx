'use client'

import AppSlider from "@/components/user/user.slider";
import { useTranslation } from "react-i18next";
import { fetcherSWR} from "@/lib/helpers";
import { useTheme } from "@/context/ThemeContext";
import useSWR from "swr";
import ProductPage from "@/components/common/ProductProvider";
import { API_BASE_URLS } from "@/lib/constants";

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
  const { theme } = useTheme();
  const { data: data, isLoading: loading } = useSWR(
    API_BASE_URLS.GUEST + "home/get/",
    fetcherSWR
  );

  const dataSliders: SliderType[] = data?.sliders || [];
  const dataTopProduct: ProductType[] = data?.products || [];

  if (loading) {
    return <div>{t("Loading...")}</div>;
  }

  return (
    <div style={{background: theme["bg-home"]}}>
      <div className= {`px-4 max-w-screen-xl mx-auto`}>
        <AppSlider sliders={dataSliders} themeStyle={themeStyle.Dark}/>
        <section className="px-1 pb-10 mt-10">
          <h3 className="text-xl text-center font-semibold mb-4 text-pink-600">🔥 {t("Best Sellers")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {dataTopProduct.map((p) => (
              <div key={p.id}>
                <ProductPage product={p}/>
              </div>
            ))}
          </div>
        </section>

        {/* <section className="px-1 mb-10">
          <img
              src="combo-55k.png"
              alt="Combo 2 ly 55k"
              className="w-fullrounded-xl object-cover h-full"
            />
        </section> */}
      </div>
    </div>
  );
}