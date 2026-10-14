"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Show, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const { user, isSignedIn } = useUser();
  const pathname = usePathname();
  const isLanding = pathname === "/";

  const navigation = [
    { name: "Dashboard", href: "/", current: true },
    { name: "Interview", href: "/interview", current: false },
    { name: "ประวัติการสัมภาษณ์", href: "/history", current: false },
    ...(isAdmin
      ? [{ name: "Admin", href: "/admin/dashboard", current: false }]
      : []),
  ];

  return (
    <Disclosure
      as="nav"
      className={classNames(
        "relative border-b transition-colors",
        isLanding
          ? "bg-neutral-950 border-neutral-800 text-neutral-200"
          : "bg-background border-border text-foreground",
      )}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton
              className={classNames(
                "group relative inline-flex items-center justify-center rounded-md p-2 focus:outline-hidden",
                isLanding
                  ? "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  : "text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground",
              )}
            >
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
              <Link href="/" className="flex items-center gap-2">
                <span
                  className={classNames(
                    "w-2 h-2 rounded-full",
                    isLanding ? "bg-emerald-500" : "bg-primary",
                  )}
                />
                <span
                  className={classNames(
                    "font-mono text-xs sm:text-sm font-semibold tracking-wider",
                    isLanding ? "text-white" : "text-heading",
                  )}
                >
                  VOICE_INTERVIEW
                  <span
                    className={isLanding ? "text-emerald-400" : "text-primary"}
                  >
                    .AI
                  </span>
                </span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {isSignedIn &&
                  navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onChange={(e) => e.preventDefault()}
                      aria-current={item.current ? "page" : undefined}
                      className={classNames(
                        pathname === item.href
                          ? isLanding
                            ? "bg-neutral-800 text-white"
                            : "bg-muted text-foreground"
                          : isLanding
                            ? "text-neutral-400 hover:bg-neutral-800/60 hover:text-white"
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
              <Show when={"signed-in"}>
                <div className="flex flex-row gap-2 items-center">
                  <UserButton />
                  <p
                    className={classNames(
                      "text-sm",
                      isLanding ? "text-neutral-200" : "text-foreground",
                    )}
                  >
                    {user?.fullName}
                  </p>
                </div>
              </Show>
            </>

            {/* sign-up / sign-in */}
            <>
              <Show when={"signed-out"}>
                <div className="flex gap-2">
                  <Link href="/sign-up">
                    <button
                      className={classNames(
                        "rounded-md transition font-medium",
                        isLanding
                          ? "px-3.5 py-1.5 text-xs font-mono text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-750"
                          : "px-4 py-2 text-sm text-white bg-secondary hover:bg-secondary-hover rounded-lg",
                      )}
                    >
                      REGISTER
                    </button>
                  </Link>
                  <Link href="/sign-in">
                    <button
                      className={classNames(
                        "rounded-md transition font-medium",
                        isLanding
                          ? "px-3.5 py-1.5 text-xs font-mono text-neutral-950 bg-white hover:bg-neutral-200 font-semibold"
                          : "px-4 py-2 text-sm text-white bg-primary hover:bg-primary-hover rounded-lg",
                      )}
                    >
                      LOGIN
                    </button>
                  </Link>
                </div>
              </Show>
            </>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {isSignedIn &&
            navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as={Link}
                onChange={(e) => e.preventDefault()}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={classNames(
                  pathname === item.href
                    ? isLanding
                      ? "bg-neutral-800 text-white"
                      : "bg-muted text-foreground"
                    : isLanding
                      ? "text-neutral-400 hover:bg-neutral-800 hover:text-white"
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
