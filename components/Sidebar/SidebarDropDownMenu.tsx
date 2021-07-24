import Link from "next/link";
import { Transition } from "@windmill/react-ui";
import { useState } from "react";
import { ChevronDown } from "react-feather";

export interface SidebarDropdownMenuProps {
  name: string;
  routes: { name: string; path: string }[];
}

const SidebarDropdownMenu: React.FC<SidebarDropdownMenuProps> = ({
  name,
  routes,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <li className="relative px-6 py-3" key={name}>
      <span
        className="absolute inset-y-0 left-0 w-1 bg-primary-500 rounded-br-lg rounded-tr-lg"
        aria-hidden="true"
      />
      <button
        onClick={(_) => setIsDropdownOpen((prev) => !prev)}
        type="button"
        className="dark:hover:text-gray-200 inline-flex items-center justify-between w-full hover:text-gray-800 text-sm font-semibold transition-colors duration-150"
        aria-haspopup="true"
      >
        <span className="inline-flex items-center">
          <span className="ml-4">{name}</span>
        </span>
        <ChevronDown className="w-4 h-4" aria-hidden="true" />
      </button>
      <Transition
        show={isDropdownOpen}
        enter="transition-all ease-in-out duration-300"
        enterFrom="opacity-25 max-h-0"
        enterTo="opacity-100 max-h-xl"
        leave="transition-all ease-in-out duration-300"
        leaveFrom="opacity-100 max-h-xl"
        leaveTo="opacity-0 max-h-0"
      >
        <ul
          className="bg-gray-50 mt-2 dark:text-gray-400 text-gray-500 text-sm font-medium dark:bg-gray-900 rounded-md shadow-inner overflow-hidden space-y-2"
          aria-label="submenu"
        >
          {routes.map(({ name, path }) => (
            <li
              className="dark:hover:text-gray-200 hover:bg-gray-100 p-2 hover:text-gray-800 transition-colors duration-150 w-full"
              key={name}
            >
              <Link href={path}>
                <a className="w-full block rounded-sm px-2 py-1">{name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </Transition>
    </li>
  );
};

export default SidebarDropdownMenu;
