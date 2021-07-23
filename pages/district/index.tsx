import { useRouter } from "next/router"
import Loader from "../../../components/Icons/LoaderIcon"

export default function RedirectPage() {
  const router = useRouter()

  const { districtName } = router.query

  if (districtName) router.push(`/district/${districtName}/capacity`)

  return (
    <div>
      <Loader />
    </div>
  )
}
