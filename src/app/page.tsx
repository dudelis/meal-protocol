import { getFood } from "@/actions/foodsettings";
import Image from "next/image";


export default async function Home() {
  const food = await getFood();
  console.log(food);


  return (
    <div className="w-full bg-muted">
      hello
    </div>
  );
}
