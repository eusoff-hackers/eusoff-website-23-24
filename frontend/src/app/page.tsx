import Image from "next/image";
import LoginForm from "./components/LoginForm";

export default function Home() {
  return (
    <div className="antialiased bg-gradient-to-br from-yellow-300 to-red-400">
    <div className="container px-6 mx-auto">
      <div
        className="flex flex-col text-center md:text-left md:flex-row h-screen justify-evenly md:items-center"
      >
        <div className="flex flex-col w-full">
          <div className="flex w-64 justfy-center items-center h-64">
            <Image
              src="/eusoff-logo.png"
              alt="Vercel Logo"
              width={400}
              height={24}
              priority
            />
          </div>
          <h1 className="text-7xl text-gray-800 font-bold">Eusoff Hall</h1>
          <p className="w-5/12  pl-5 mx-auto md:mx-0 text-gray-700">
            Excellence and Harmony
          </p>
        </div>
        <div className="w-full md:w-full lg:w-9/12 mx-auto md:mx-0">
          <LoginForm/>
        </div>
      </div>
    </div>
  </div>
)
}
