import { Button } from "@/components/ui/button"
import { useUserContext } from "@/context/StudentContext"
import { useContext } from "react"

export default function Home() {
  const context = useUserContext()
  return (
    <div>
      {context.user.name}
      <h1 className="text-3xl font-bold underline p-2">ggg</h1>
      
    </div>
  )
}
