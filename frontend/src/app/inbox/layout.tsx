import { Separator } from "@/components/ui/separator";
import React from "react"

type Props = {
    children : React.ReactNode
}
const Layout = (props : Props) =>{
    return (
        <div className="overflow-y-clip h-screen">

             <Separator />
             {props.children}
        </div>
    )
}

export default Layout;

