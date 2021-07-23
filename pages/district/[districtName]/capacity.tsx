import { useRouter } from "next/router"

const Capacity = () => {
  const router = useRouter()

  return (
    <div className="conainer mx-auto px-4">
      <h1 className="text-4xl pt-10">Capacity - {router.query.districtName}</h1>
    </div>
  )
}

export default Capacity
