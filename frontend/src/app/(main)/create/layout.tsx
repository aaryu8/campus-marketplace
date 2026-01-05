import Navbar from "@/components/global/navbar"
import React from "react"

type Props = {
    children : React.ReactNode
}
const Layout = (props : Props) =>{
    return (
        <div className="overflow-y-clip h-screen">
             <Navbar />
             {props.children}
        </div>
    )
}

export default Layout