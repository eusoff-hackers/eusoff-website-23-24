import LoginButton from "./components/loginButton"

export default function Home() {

  return (
      <div className="h-screen w-full flex items-center justify-center bg-cover">
        <div className="text-center bg-white p-10 rounded-lg shadow-md">
          <h1 className="mb-4 text-2xl font-bold">Welcome to Eusoff App</h1>
          <p className="mb-4">Login to access</p>
          <LoginButton />
        </div>
      </div>
  )
}
