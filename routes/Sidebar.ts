import { ACTIVATED_DISTRICTS } from "../config"
import { parameterize } from "../utils/parser"

const routes = [
  {
    name: "District Dashboard",
    routes: ACTIVATED_DISTRICTS.map(({ name }) => ({
      name: name,
      path: `/district/${parameterize(name)}`,
    })),
  },
  {
    href: "https://care.coronasafe.network/",
    name: "Care",
  },
  {
    href: "https://kerala.coronasafe.network/",
    name: "Kerala Dashboard",
  },
  {
    href: "https://kerala.coronasafe.network/hotspots",
    name: "Kerala Dashboard: Hotspots",
  },
]

export default routes
