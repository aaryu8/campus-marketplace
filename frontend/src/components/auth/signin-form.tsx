"use client"

import { GalleryVerticalEnd } from "lucide-react"
import axios from "axios"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"



export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter();
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={async (e : FormEvent<HTMLFormElement>) => {
                    e.preventDefault();                    
                    if (password.length < 8) {
                      alert("First Enter atleast 8 digits of password");
                      return;
                    }
                    const response = await axios({
                      method : "post",
                      url : "http://localhost:4000/api/auth/sign-in",
                      withCredentials : true,
                      data: {
                        email : email,
                        password : password
                      }
                    });
                    console.log(response.data);
                    
                    if(response.data.authStatus){
                      router.push('/');
                    }

                  }}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            
            <h1 className="text-xl font-bold">Log-in</h1>
            <FieldDescription>
              Don't have an account? <a href="/sign-up">Sign Up</a>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="me@example.com"
              required
              onChange={( e : ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
              }}
            />
            <FieldDescription>
                  Enter your university mail
                </FieldDescription>
          </Field>
         <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="********"
              minLength={8}
              required
              onChange={( e : ChangeEvent<HTMLInputElement>) => {
                  e.target.value = e.target.value.split(" ").join("");
                  setPassword(e.target.value);
                }}
            />
            <FieldDescription>
                 <a href="/sign-up">Forgot Password ?</a>
            </FieldDescription>
          </Field>
          
          <Field>
            <Button type="submit">Log-In</Button>
          </Field>
          <FieldSeparator></FieldSeparator>
          
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
