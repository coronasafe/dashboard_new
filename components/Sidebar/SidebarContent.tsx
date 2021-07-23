import routes from "../../utils/routes"
import React from "react"
import Link from "next/link"
import CoronaSafeLogo from "../../lib/assets/icons/CoronaSafeLogo"
import SidebarSubmenu from "./SidebarSubmenu"

const hoverClassName = "hover:text-gray-900 dark:hover:text-gray-300"

export const SidebarContent = () => {
  return (
    <div className="flex flex-col justify-between py-4 min-h-full dark:text-gray-400 text-gray-500 ">
      <ul>
        {routes.map((route, i) => {
          return (
            <React.Fragment key={i}>
              {route.routes ? (
                <SidebarSubmenu route={route} />
              ) : (
                <li className="relative px-6 py-3">
                  <a
                    target="_blank"
                    href={route.href}
                    className="my-2 dark:hover:text-gray-200 inline-flex items-center w-full hover:text-gray-800 text-sm font-semibold transition-colors duration-150"
                  >
                    <span className="ml-4">{route.name}</span>
                  </a>
                </li>
              )}
            </React.Fragment>
          )
        })}
      </ul>
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
    </div>
  )
}
