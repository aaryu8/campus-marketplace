
import { SignupForm } from "@/components/auth/signup-form"
import { Mountains_of_Christmas } from "next/font/google"
const moc = Mountains_of_Christmas({
  subsets : ['latin'],
  weight : ['700'],
})

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 ">
      <div className="flex flex-col gap-4 p-6 md:p-10 ">
        <div className="flex flex-1 items-center justify-center ">
          <div className="w-full max-w-xs ">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="inset-0 bg-gradient-to-br from-purple-700 via-orange-500 to-green-500 relative hidden lg:block">
        <div className="flex h-full w-full items-center justify-center text-3xl flex-col font-extrabold text-primary/80 p-8 text-center">
            <span className={`${moc.className}  text-7xl `}>
                  Welcome To <span className="bg-gradient-to-r  from-yellow-300 via-orange-400 to-green-300 bg-clip-text text-transparent">DormDeal</span>
                </span>   
            <span className={`${moc.className} text-black `}>
                    Your Campus , Your Deals
                </span>     
        </div>
      </div>
    </div>
  )
}