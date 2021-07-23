import { useRouter } from "next/router"

const Map = () => {
  const router = useRouter()

  return (
    <div className="conainer mx-auto px-4">
      <h1 className="text-4xl pt-10">Map - {router.query.districtName}</h1>
    </div>
  )
}

export default Map
