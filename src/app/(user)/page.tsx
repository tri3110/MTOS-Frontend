'use client'

import AppSlider from "@/components/user/user.slider";
import { useTranslation } from "react-i18next";
import { fetcherSWR} from "@/lib/helpers";
import { useTheme } from "@/context/ThemeContext";
import useSWR from "swr";
import ProductPage from "@/components/common/ProductProvider";
import { API_BASE_URLS } from "@/lib/constants";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserGroupIcon, StarIcon, SparklesIcon } from "@heroicons/react/24/solid";

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
  const router = useRouter();
  const { data: data, isLoading: loading } = useSWR(
    API_BASE_URLS.GUEST + "home/get/",
    fetcherSWR
  );

  const { data: categoriesData } = useSWR(
    API_BASE_URLS.GUEST + "home/categories/get/",
    fetcherSWR
  );

  const dataSliders: SliderType[] = data?.sliders || [];
  const dataTopProduct: ProductType[] = data?.products || [];
  const dataCategories: CategoryType[] = categoriesData?.categories || [];
  const total_customers = data?.total_customers || 0;
  const total_drinks = data?.total_drinks || 0;

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-300 rounded-xl mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-300 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{background: theme["bg-home"]}}>
      <div className= {`px-4 max-w-screen-xl mx-auto`}>
        <AppSlider sliders={dataSliders} themeStyle={themeStyle.Dark}/>
        <section className="px-1 pb-2 mt-10">
          <h3 className="text-xl text-center font-semibold mb-4 text-pink-600">🔥 {t("Best Sellers")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            {dataTopProduct.map((p) => (
              <div key={p.id}>
                <ProductPage product={p}/>
              </div>
            ))}
          </div>
        </section>

        {/* Hero Section */}
        <section className="hero-section bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-3xl p-8 md:p-12 my-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="hero-content flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {t("Trà sữa & Cà phê")}
                <br />
                <span className="text-yellow-300">{t("Ngon tuyệt vời")}</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                🚚 {t("Giao hàng tận nơi trong 30 phút")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button onClick={() => {
                  router.push(`/menu/`)
                }}
                  className="bg-white cursor-pointer text-pink-600 px-8 py-4 rounded-full font-semibold 
                  text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  📋 {t("Xem menu")}
                </button>
                <button className="flex justify-center items-center gap-2 border-2 cursor-pointer border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-pink-600 transition-all duration-300">
                  <ShoppingCart size={18} /> {t("Đặt hàng")}
                </button>
              </div>
            </div>
            <div className="hero-image flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl"></div>
                <img
                  src="/combo-55k.png"
                  alt="Trà sữa và cà phê ngon"
                  className="relative w-80 h-80 md:w-96 md:h-96 object-contain shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-4 right-4 bg-white/90 text-pink-600 px-4 py-2 rounded-full font-semibold shadow-lg animate-bounce">
            ⭐ Hot
          </div>
          {/* <div className="absolute bottom-4 left-4 bg-white/90 text-green-600 px-4 py-2 rounded-full font-semibold shadow-lg">
            ✅ 1000+ {t("đơn hàng")}
          </div> */}
        </section>

        {/* Categories Section */}
        <section className="categories-section px-1 pb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🥤 {t("Các loại đồ uống")}
            </h2>
            <p className="text-gray-600 text-lg">
              {t("Khám phá các loại trà sữa, cà phê thơm ngon")}
            </p>
          </div>

          <div className="categories-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {dataCategories.slice(0, 12).map((category, index) => {
              const categoryIcons = [
                "🥤", "☕", "🧊", "🍵", "🫖", "🥥",
                "🍯", "🌿", "🍓", "🍌", "🍊", "🍇"
              ];

              return (
                <div
                  key={category.id}
                  className="category-card bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group border border-gray-100"
                >
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {categoryIcons[index % categoryIcons.length]}
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base group-hover:text-pink-600 transition-colors">
                      {category.name}
                    </h3>
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs text-pink-500 font-medium">
                        {t("Xem ngay")} →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {dataCategories.length > 12 && (
            <div className="text-center mt-8">
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300">
                {t("Xem tất cả loại")}
              </button>
            </div>
          )}
        </section>

        {/* Promotions Section */}
        <section className="promotions-section px-1 pb-16">
          <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("Khuyến mãi hấp dẫn")}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {t("Giảm giá đặc biệt cho trà sữa và cà phê")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-2xl font-bold">BUY 1 GET 1</div>
                  <div className="text-sm opacity-80">{t("Trà sữa size L")}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-2xl font-bold">FREE TOPPING</div>
                  <div className="text-sm opacity-80">{t("Đơn từ 50k")}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-2xl font-bold">COMBO</div>
                  <div className="text-sm opacity-80">{t("Tiết kiệm 20k")}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section px-1 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="stat-card bg-white rounded-3xl p-6 text-center shadow-xl border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-pink-600 shadow-sm">
                <UserGroupIcon className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-pink-600">{total_customers.toLocaleString()}</div>
              <div className="text-gray-600 mt-2">{t("Khách hàng")}</div>
            </div>
            <div className="stat-card bg-white rounded-3xl p-6 text-center shadow-xl border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm">
                <SparklesIcon className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-blue-600">{total_drinks.toLocaleString()}</div>
              <div className="text-gray-600 mt-2">{t("Ly đã bán")}</div>
            </div>
            <div className="stat-card bg-white rounded-3xl p-6 text-center shadow-xl border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 shadow-sm">
                <StarIcon className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold text-yellow-600">4.8/5</div>
              <div className="text-gray-600 mt-2">{t("Đánh giá")}</div>
            </div>
            <div className="stat-card bg-white rounded-3xl p-6 text-center shadow-xl border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-sm text-3xl">
                🚚
              </div>
              <div className="text-3xl font-bold text-green-600">30min</div>
              <div className="text-gray-600 mt-2">{t("Giao hàng")}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}