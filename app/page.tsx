import Card from "@/app/Card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* <Button variant={"outline"} className="text-mini">
        Hello Vi
      </Button>
      <Card />
      <div className="w-[700px] h-[700px] bg-red-300">
        <Image src="/images/img1.jpg" alt="logo" width={700} height={600} />
      </div> */}
      <ul>
        <li>
          <Link href="/register">Register</Link>
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
      </ul>
    </main>
  );
}
