import CoronaSafeLogo from "../../lib/assets/icons/CoronaSafeLogo"
import routes from "../../routes/Sidebar"
import SidebarMenu from "./SidebarMenu"

export interface SidebarProps {}

const hoverClassName = "hover:text-gray-900 dark:hover:text-gray-300"

const Sidebar: React.FunctionComponent<SidebarProps> = () => {
  return (
    <ul className="bg-white dark:bg-black fixed flex flex-col justify-between inset-0 z-50 py-4 min-h-full top-12 w-full max-w-xs dark:text-gray-400 text-gray-500">
      <div>
        {routes.map((route) => (
          <SidebarMenu key={route.name} {...route} />
        ))}
      </div>
      <div className="p-4">
        <div className="flex ">
          <div className="w-1/2">
            <a
              target="_blank"
              href="https://github.com/coronasafe/dashboard"
              className={hoverClassName}
            >
              Github
            </a>
          </div>
          <div className="w-1/2">
            <a
              target="_blank"
              href="https://github.com/coronasafe/dashboard/issues"
              className={hoverClassName}
            >
              Issues
            </a>
          </div>
        </div>
        <div className="flex ">
          <div className="w-1/2">
            <a
              target="_blank"
              href="https://coronasafe.network/volunteer"
              className={hoverClassName}
            >
              Volunteer
            </a>
          </div>
          <div className="w-1/2">
            <a target="_blank" href="mailto:info@coronasafe.network">
              Contact
            </a>
          </div>
        </div>
        <a href="https://coronasafe.network/" className="block mt-4">
          <span className="inline-flex text-sm space-x-1">
            Copyright © 2021
          </span>
        </a>
        <CoronaSafeLogo className="w-32" />
        <a href="https://github.com/coronasafe/dashboard/blob/master/LICENSE">
          <span className="text-xs">Released under the MIT License</span>
        </a>
      </div>
    </ul>
  )
}

export { Sidebar }
