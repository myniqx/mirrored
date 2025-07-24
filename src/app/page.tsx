"use client"
import { MainMenu } from "@/components/MainPage/MainMenu"
import { MainSearchBox } from "@/components/MainPage/MainSearchBox"
import Image from "next/image"
import common from "../constants/common.json"

const Home = () => {
  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <div className="w-[95%] h-full mx-auto relative">
        <div className="absolute left-0 top-0 bottom-0 right-0 lg:right-1/2">
          <Image
            src="/icon.png"
            width={500}
            height={500}
            className="w-full h-full object-contain"
            alt="Mirrored Logo"
          />
        </div>

        <div className="absolute left-10 lg:left-1/2 top-10 bottom-10 right-10 gap-8 flex flex-col">
          <h1 className="text-4xl md:text-5xl leading-[0.9em]">{common.appName}</h1>
          <MainSearchBox />
          <MainMenu />
        </div>
      </div>
    </div>
  )
}

export default Home

