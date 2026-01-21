import { Separator } from "@/components/ui/separator";

export default async function CurvedContainer({ children }: { children: React.ReactNode }) {
   
    return (
    <div
        className="
            mt-12 ml-12
            h-[calc(100vh-3rem)]   /* 3rem = 48px */
            w-[calc(100vw-3rem)]
            rounded-3xl bg-white border-2
            
            overflow-auto
        "
        >
        <div className="p-6 font-extrabold text-[20px] sticky">
                    Messages 
        </div> 
        <Separator />
        {children}
    </div>
  );
}
