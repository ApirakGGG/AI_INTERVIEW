
import React, {ReactNode} from "react";
import type { Metadata } from "next";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "AI Voice Interview",
  description: "Create by Apirak Jansawang",
};

export default function layout({children} : {children: ReactNode}) {
    return (
        <div className="relative flex h-[70vh] w-full flex-col items-center justify-center">
            <div>
                {children}
            </div>
        </div>
    )
}