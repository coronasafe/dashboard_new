import { useRouter } from "next/router"

const Triage = () => {
  const router = useRouter()

  return (
    <div className="conainer mx-auto px-4">
      <h1 className="text-4xl pt-10">Triage - {router.query.districtName}</h1>
    </div>
  )
}

export default Triage
