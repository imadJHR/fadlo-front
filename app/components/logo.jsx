import Link from "next/link"
import Image from "next/image"
import logo from "../../public/logo.png"
export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">

      <span className="text-xl font-bold tracking-tighter text-white">
        <Image
          src={logo}
          alt=""
          width={100}
          height={100}
          className="object-contain"
          onError={(e) => {
            e.target.style.display = "none"
          }}
        />

      </span>
    </Link>
  )
}
