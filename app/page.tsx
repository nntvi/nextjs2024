import Card from "@/app/Card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button variant={"outline"} className="text-mini">
        Hello Vi
      </Button>
      <Card />
    </main>
  );
}
