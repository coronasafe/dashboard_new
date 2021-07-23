import SidebarDropdownMenu from "./SidebarDropDownMenu"

export interface SidebarMenuProps {
  name: string
  href?: string
  routes?: { name: string; path: string }[]
}

const SidebarMenu: React.FunctionComponent<SidebarMenuProps> = ({
  name,
  href,
  routes,
}) => {
  if (routes) return <SidebarDropdownMenu name={name} routes={routes} />

  return (
    <li className="relative px-6 py-3" key={name}>
      <a
        href={href}
        className="dark:hover:text-gray-200 inline-flex items-center w-full hover:text-gray-800 text-sm font-semibold transition-colors duration-150"
      >
        <span className="ml-4">{name}</span>
      </a>
    </li>
  )
}

export default SidebarMenu
