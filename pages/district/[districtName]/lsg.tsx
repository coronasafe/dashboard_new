import { useRouter } from "next/router"

const LSG = () => {
  const router = useRouter()

  return (
    <div className="conainer mx-auto px-4">
      <h1 className="text-4xl pt-10">LSG - {router.query.districtName}</h1>
    </div>
  )
}

export default LSG
