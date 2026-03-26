import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center ">
      <Image
        src={"/LOGO_KEEPTANG.png"}
        alt="logo"
        width={250}
        height={250}
        className="stroke stroke-amber-500 stroke-[1.5]"
      />
      <p className="tracking-tight text-3xl leading-tight bg-blue-400 bg-clip-text text-transparent">
        AI Voice Interview
      </p>
    </Link>
  );
}

export function LogoPage() {
  return (
    <>
      {" "}
      <Image
        src={"/"}
        alt="logo"
        width={250}
        height={250}
        className="stroke stroke-amber-500 stroke-[1.5]"
      />
      <p className="tracking-tight text-3xl leading-tight bg-blue-400 bg-clip-text text-transparent">
        AI Voice Interview
      </p>
    </>
  );
}
