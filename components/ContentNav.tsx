import Link from "next/link";
import clsx from "classnames";
import { useState } from "react";
import { useRouter } from "next/router";
import { ChevronDown } from "react-feather";
import { Button, Dropdown, DropdownItem } from "@windmill/react-ui";
import { CONTENT, ACTIVATED_DISTRICTS } from "../lib/common";
import { getDistrictName, humanize, parameterize } from "../utils/parser";
import PageTitle from "./Typography/PageTitle";

const ContentNav = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const currentContent = router.pathname.split("/")[3];
  const districtName = getDistrictName(router.query.districtName?.toString());

  return (
    <div>
      <PageTitle text="District Dashboard" />
      <div className="flex flex-col items-center justify-between mb-2 px-4 py-2 bg-primary-500 rounded-lg shadow-md md:flex-row">
        <p className="text-white font-semibold">
          {humanize(districtName as string)}
        </p>
        <div className="md:flex md:space-x-2">
          <div className="flex flex-wrap justify-center dark:text-gray-700 dark:bg-gray-900 bg-white rounded-lg space-x-1 space-y-1 md:space-x-0 md:space-y-0">
            {Object.keys(CONTENT).map((content, i) => {
              const lastContent = i === Object.keys(CONTENT).length - 1;
              return (
                <Link
                  href={`/district/${districtName}/${parameterize(content)}`}
                  key={i}
                >
                  <Button
                    layout="link"
                    className={clsx(
                      "shadow-xs",
                      { "md:rounded-r-none": i == 0 },
                      { "md:rounded-l-none": lastContent },
                      {
                        "md:rounded-l-none md:rounded-r-none":
                          i !== 0 && !lastContent,
                      }
                    )}
                    disabled={currentContent === parameterize(content)}
                  >
                    <span className="capitalize">{content.toLowerCase()}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
          <div className="relative mt-2 dark:bg-gray-900 bg-white rounded-lg md:mt-0">
            <Button
              layout="link"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Select district"
              aria-haspopup="true"
              disabled={false}
              //@ts-ignore
              iconRight={ChevronDown}
              className="w-full shadow-xs"
            >
              {humanize(districtName as string)}
            </Button>
            <Dropdown
              isOpen={isOpen}
              align="right"
              onClose={() => setIsOpen(false)}
              className="z-40"
            >
              {ACTIVATED_DISTRICTS.map((district) => (
                <DropdownItem
                  key={district.id}
                  onClick={() => {
                    router.push(
                      `/district/${parameterize(district.name)}/capacity`
                    );
                    setIsOpen(false);
                  }}
                >
                  <span>{district.name}</span>
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentNav;
