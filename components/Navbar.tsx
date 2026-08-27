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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const { user, isSignedIn } = useUser();
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/", current: true },
    { name: "Interview", href: "/interview", current: false },
    { name: "ประวัติการสัมภาษณ์", href: "/history", current: false },
    ...(isAdmin ? [
      { name: "Admin", href: "/admin/dashboard", current: false },
    ] : []),
  ];

  return (
    <Disclosure as="nav" className="relative bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 sticky top-0 z-10">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground focus:outline-2 focus:-outline-offset-1 focus:outline-primary">
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
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-accent/10 hover:text-foreground",
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
                  <p className="text-foreground text-sm">{user?.fullName}</p>
                </div>
              </Show>
            </>

            {/* sign-up */}
            <>
              <Show when={"signed-out"}>
                <div className="flex gap-2">
                  <Link href="/sign-up">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary-hover rounded-lg transition">
                      REGISTER
                    </button>
                  </Link>
                  <Link href="/sign-in">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition">
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
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-accent/10 hover:text-foreground",
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
