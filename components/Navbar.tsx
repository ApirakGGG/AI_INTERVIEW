"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Show, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navigation = [
  { name: "Dashboard", href: "/", current: true },
  { name: "Interview", href: "/interview", current: false },
  // { name: "Projects", href: "#", current: false },
  // { name: "Calendar", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const { user, isSignedIn } = useUser();
  const pathname = usePathname();

  return (
    <Disclosure as="nav" className="relative bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 sticky top-0 z-10">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              {/* LOGO */}
              {/* <img
                alt="AI_INTERVIEW"
                // src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              /> */}
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {/* map navigation ถ้า user is logged in */}
                {isSignedIn &&
                  navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onChange={e => e.preventDefault()}
                      aria-current={item.current ? "page" : undefined}
                      className={classNames(
                        pathname === item.href
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-white/5 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium",
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
          <div className="absolute gap-2 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}

            <>
              <Show when={"signed-in"} >
                <div className="flex flex-row gap-2 items-center">
                  <UserButton />
                  <p className="text-white text-sm">{user?.fullName}</p>
                </div>
              </Show>
            </>

            {/* sign-up */}
            <>
              <Show when={"signed-out"}>
                <div className="flex gap-2">
                  <Link href="/sign-up">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                      REGISTER
                    </button>
                  </Link>
                  <Link href="/sign-in">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition">
                      LOGIN
                    </button>
                  </Link>
                </div>
              </Show>
            </>
          </div>
        </div>
      </div>

      {/* มือถือ */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {isSignedIn &&
            navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as={Link}
                onChange={e => e.preventDefault()}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={classNames(
                  pathname === item.href
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium",
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
