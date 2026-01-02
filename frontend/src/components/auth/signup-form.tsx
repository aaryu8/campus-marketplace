"use client"

import { GalleryVerticalEnd } from "lucide-react"

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
import { ChangeEvent, FormEvent, useState } from "react"
import axios from "axios"
import { AuthModal } from "./authModal"



type formFields = {
  name : string;
  email : string;
  password : string;
  [key: string]: string;
}




export function SignupForm() {
    
  const [formData , setformData] = useState<formFields>({
    name : "",
    email :  "",
    password : "",
  })

  const [showModal , setshowModal] = useState(false);

  return (<>
      <div className="flex flex-col gap-6">
      <form onSubmit={async (e : FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              try{

              } catch (error){

              }

              setshowModal(!showModal);
                const response = await axios({
                method : "post",
                url : "http://localhost:4000/sign-up",
                data: {
                  name : formData.name,
                  email : formData.email,
                  password : formData.password
                }
                });
                console.log(response.data);
              
            }}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            
            <h1 className="text-xl font-bold">Create An Account</h1>
            <FieldDescription>
              Already have an account? <a href="/sign-in">Sign in</a>
            </FieldDescription>
          </div>
          <Field>
              <FieldLabel htmlFor="email">Full Name</FieldLabel>
              <Input
                id="text"
                type="text"
                placeholder="Queen Elizabeth"
                required
                onChange={( e : ChangeEvent<HTMLInputElement>) => {
                  setformData({
                    ...formData , 
                    name : e.target.value
                  })
                }}
              />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="me@example.com"
              required
              onChange={( e : ChangeEvent<HTMLInputElement>) => {
                  setformData({
                    ...formData,
                    email : e.target.value
                  })
                }}
            />
            <FieldDescription>
                  We&apos;ll use this to contact you. We will not share your
                  email with anyone else.
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
                  setformData({
                    ...formData , 
                    password : e.target.value
                  })
                }}
            />
            <FieldDescription>
                  Make your Password . Must be at least 8 characters long.
            </FieldDescription>
          </Field>
          
          <Field>
              <Button type="submit">Create Account</Button>
              
          </Field>
          <FieldSeparator></FieldSeparator>
              
        </FieldGroup>
      </form>
      
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
    </>
  )
}
