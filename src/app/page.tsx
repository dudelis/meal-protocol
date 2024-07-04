import { Spacer } from "@/components/spacer";
import Image from "next/image";


export default async function Home() {


  return (
    <div className="w-full bg-muted p-4">
      <h1 className="text-4xl font-bold text-center mb-4">Вітаємо до HealthTracker!</h1>
      <p className="text-lg text-center mb-8">
        Ваш надійний додаток для реєстрації прийомів їжі, відстеження вашого харчування та моніторингу спортивних активностей.
        Якщо ви прагнете підтримувати здоровий спосіб життя, схуднути або просто контролювати свої харчові звички,
        HealthTracker тут, щоб підтримувати вас на кожному кроці. Увійдіть, щоб розпочати свій шлях до здоровішого вас сьогодні!
      </p>
      {/* Add more components or content here as needed */}
      <Spacer />
      <Spacer />
    </div>
  );
}
