"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface NavbarProps {
  isAdmin?: boolean;
  initialSignedIn?: boolean;
}

export default function Navbar({
  isAdmin = false,
  initialSignedIn = false,
}: NavbarProps) {
  const { user, isSignedIn: clerkSignedIn, isLoaded } = useUser();
  const isSignedIn = isLoaded ? Boolean(clerkSignedIn) : initialSignedIn;
  const pathname = usePathname();
  const isLanding = pathname === "/";

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      current: pathname === "/dashboard",
    },
    {
      name: "Interview",
      href: "/interview",
      current: pathname === "/interview",
    },
    {
      name: "ประวัติการสัมภาษณ์",
      href: "/history",
      current: pathname === "/history",
    },
    ...(isAdmin
      ? [
          {
            name: "Admin",
            href: "/admin/dashboard",
            current: pathname.startsWith("/admin"),
          },
        ]
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
        {isSignedIn ? (
          /* ========================================================
             SIGNED-IN NAVBAR
             - Mobile: Balanced 3-column layout (Hamburger | Logo | Avatar)
               No collision, name hidden on mobile, logo centered.
             - Desktop: Left-aligned Logo + Navigation links,
               Right-aligned User Avatar + Full Name.
             ======================================================== */
          <div className="flex h-16 items-center justify-between">
            {/* 1. Mobile menu button (Left on mobile, hidden on desktop) */}
            <div className="w-10 flex items-center justify-start sm:hidden">
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

            {/* 2. Center on mobile (Logo) | Left on desktop (Logo + Nav) */}
            <div className="flex flex-1 items-center justify-center sm:justify-start">
              <div className="flex shrink-0 items-center">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <span
                    className={classNames(
                      "w-2 h-2 rounded-full shrink-0",
                      isLanding ? "bg-emerald-500" : "bg-primary",
                    )}
                  />
                  <span
                    className={classNames(
                      "font-mono text-xs sm:text-sm font-semibold tracking-wider whitespace-nowrap",
                      isLanding ? "text-white" : "text-heading",
                    )}
                  >
                    VOICE_INTERVIEW
                    <span
                      className={
                        isLanding ? "text-emerald-400" : "text-primary"
                      }
                    >
                      .AI
                    </span>
                  </span>
                </Link>
              </div>

              {/* Desktop navigation */}
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? "page" : undefined}
                      className={classNames(
                        item.current
                          ? isLanding
                            ? "bg-neutral-800 text-white"
                            : "bg-muted text-foreground"
                          : isLanding
                            ? "text-neutral-400 hover:bg-neutral-800/60 hover:text-white"
                            : "text-muted-foreground hover:bg-accent/10 hover:text-foreground",
                        "rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap",
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Right profile (Avatar on mobile, Avatar + Full name on desktop) */}
            <div className="w-10 sm:w-auto flex items-center justify-end sm:ml-6">
              <div className="flex flex-row gap-2 items-center">
                <UserButton />
                <p
                  className={classNames(
                    "text-sm font-medium hidden sm:block whitespace-nowrap",
                    isLanding ? "text-neutral-200" : "text-foreground",
                  )}
                >
                  {user?.fullName}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================
             SIGNED-OUT NAVBAR (No Session)
             - Hamburger menu is completely REMOVED as requested.
             - Logo on left, Register/Login buttons on right.
             - Perfectly balanced, zero collision across all screens.
             ======================================================== */
          <div className="flex h-16 items-center justify-between w-full">
            {/* Logo on Left */}
            <div className="flex items-center shrink-0">
              <Link href="/" className="flex items-center gap-2">
                <span
                  className={classNames(
                    "w-2 h-2 rounded-full shrink-0",
                    isLanding ? "bg-emerald-500" : "bg-primary",
                  )}
                />
                <span
                  className={classNames(
                    "font-mono text-xs sm:text-sm font-semibold tracking-wider whitespace-nowrap",
                    isLanding ? "text-white" : "text-heading",
                  )}
                >
                  VOICE_INTERVIEW
                  <span
                    className={
                      isLanding ? "text-emerald-400" : "text-primary"
                    }
                  >
                    .AI
                  </span>
                </span>
              </Link>
            </div>

            {/* Right: Register and Login buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/sign-up">
                <button
                  className={classNames(
                    "transition font-medium whitespace-nowrap",
                    isLanding
                      ? "px-2.5 sm:px-3.5 py-1.5 text-xs font-mono text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-750 rounded-md"
                      : "px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white bg-secondary hover:bg-secondary-hover rounded-lg",
                  )}
                >
                  REGISTER
                </button>
              </Link>
              <Link href="/sign-in">
                <button
                  className={classNames(
                    "transition font-medium whitespace-nowrap",
                    isLanding
                      ? "px-2.5 sm:px-3.5 py-1.5 text-xs font-mono text-neutral-950 bg-white hover:bg-neutral-200 font-semibold rounded-md"
                      : "px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white bg-primary hover:bg-primary-hover rounded-lg",
                  )}
                >
                  LOGIN
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mobile drawer (only rendered when signed in) */}
      {isSignedIn && (
        <DisclosurePanel className="sm:hidden border-t border-border/50">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as={Link}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={classNames(
                  item.current
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
      )}
    </Disclosure>
  );
}