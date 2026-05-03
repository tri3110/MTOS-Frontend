
import { API_BASE_URLS } from "@/lib/constants";
import HomeClient from "./home.client";

export default async function HomePage() {
  const res = await fetch(
    API_BASE_URLS.GUEST + "home/get/",
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();

  const res2 = await fetch(
    API_BASE_URLS.GUEST + "home/categories/get/",
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const categories = await res2.json();

  return <HomeClient data={data} categories={categories} />;
}