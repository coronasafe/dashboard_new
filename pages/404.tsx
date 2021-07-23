import React from "react"
import { useRouter } from "next/router"

const Page404 = () => {
  const router = useRouter()

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ height: "80vh" }}
    >
      <div className="flex">
        <h1 className="dark:text-gray-400 text-gray-400 text-8xl font-semibold">
          404
        </h1>
      </div>
      <p className="dark:text-gray-200 text-gray-700 mt-6 text-4xl">
        Page not found
      </p>
      <button
        onClick={() => router.back()}
        className="text-2xl text-white dark:text-black bg-primary-500 py-2 px-12 rounded mt-12 hover:"
      >
        Go back
      </button>
    </div>
  )
}

export default Page404
