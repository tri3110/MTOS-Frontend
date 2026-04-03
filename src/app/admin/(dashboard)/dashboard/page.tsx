'use client'

import { useDataStore } from '@/utils/store';

export default function Home() {

  const data = useDataStore((state:any) => state.data?.movies);

  if (data == null){
    return (
      <div>
        Loading....
      </div>
    );
  }
  
  return (
    <>
    </>
  );
}