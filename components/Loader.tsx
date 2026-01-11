'use client';

import { PuffLoader, } from "react-spinners";



const Loader = () => {
  return (
    <div
      className="
      h-screen
      flex 
      flex-col 
      justify-center 
      items-center 
      bg-slate-50
    "
    >
      <div className=" relative">
        <PuffLoader
          size={100}
          color="#4f39f6"
        />
      </div>
    </div>
  );
}

export default Loader;