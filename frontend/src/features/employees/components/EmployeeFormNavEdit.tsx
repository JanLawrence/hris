import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { MoveLeft } from "lucide-react"

const STEPS = ["personal", "employment"] as const
type Step = (typeof STEPS)[number]

const triggerClass =
  "h-auto flex-none px-4 py-3 text-base " +
  "after:bg-black group-data-horizontal/tabs:after:h-1 group-data-horizontal/tabs:after:-bottom-px"

export default function EmployeeFormNav(){
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>("personal")
    const index = STEPS.indexOf(step)

    const goPrev = () => setStep(STEPS[Math.max(index - 1, 0)])
    const goNext = () => setStep(STEPS[Math.min(index + 1, STEPS.length - 1)])

    return (
        <Tabs value={step} onValueChange={(value) => setStep(value as Step)}>
            <header className="border-b border-gray-200 flex flex-col gap-3 px-10 pt-6 bg-[#ffffff]">
                <Button variant={'default'} size={'sm'} className={'self-start mb-4 gap-1'} onClick={() => navigate('/employees')}><MoveLeft />Back</Button>
                <div className="flex justify-between"> 
                    <div className="flex items-center gap-3 mb-6">
                        <Avatar className="size-14">
                            <AvatarFallback>JT</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-medium">Jan Tolentino</span>
                                <Badge className="bg-green-100 text-green-700"> 
                                    <span className="size-1.5 rounded-full bg-green-600" />
                                    Active · Regular
                                </Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">Full Stack Engineer</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mb-7">
                        <Button variant={'default'} size={'lg'} className={'gap-1'}>Save Changes</Button>

                    </div>
                </div>
                <TabsList variant="line" className="group-data-horizontal/tabs:h-auto p-0 gap-2">
                    <TabsTrigger value="personal" className={triggerClass}>Personal</TabsTrigger>
                    <TabsTrigger value="employment" className={triggerClass}>Employment</TabsTrigger>
                </TabsList>
            </header>

            <TabsContent value="personal">
                <Card className="mx-6 my-5">
                    <CardHeader>
                        <CardTitle>Personal</CardTitle>
                        <CardDescription>Basic personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {/* personal fields go here */}
                    </CardContent>
                    <CardFooter className="justify-end gap-2">
                        <Button onClick={goNext}>Next</Button>
                    </CardFooter>
                </Card>
            </TabsContent>

            <TabsContent value="employment">
                <Card className="mx-6 my-5">
                    <CardHeader>
                        <CardTitle>Employment</CardTitle>
                        <CardDescription>Position, department and employment details.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {/* employment fields go here */}
                    </CardContent>
                    <CardFooter className="justify-between gap-2">
                        <Button variant="outline" onClick={goPrev}>Previous</Button>
                        <Button type="submit">Save</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
