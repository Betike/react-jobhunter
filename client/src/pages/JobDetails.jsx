import { apiURL } from '@/constants'
import { useMutation, useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import NavBar from './NavBar'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useSelector } from 'react-redux'


const JobDetails = () => {

  const { toast } = useToast()

  const { jobId } = useParams()

  const auth = useSelector((state) => state.auth);

  const { isLoading, data } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const response = await fetch(apiURL + "/jobs/" + jobId, {
        method: "GET",
      });

      const data = await response.json();
      return data;
    },
  })

  const apply = useMutation({
    mutationFn: (jobId) => {
      return fetch(apiURL + '/applicants', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId: jobId })
      }).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Gratulálok!",
        description: `Jelentkeztél a következő munkára: ${data.company}, ${data.position}`,
      })
    }
  });

  if (isLoading) {
    return <>
      Loading...
    </>
  }


  return (
    <div>
      <NavBar />
      <div className='flex justify-center pt-10'>
        <div className='w-[80%]'>
          <Card>
            <CardHeader>
              <div className='flex justify-between'>
                <div>
                  <CardTitle>Cég részletei</CardTitle>
                  <CardDescription>Megtetszett a lehetőség? Jelentkezz!</CardDescription>
                </div>
                <div>
                  {auth.isAuthenticated && auth.user.role === 'jobseeker' && <Button
                    onClick={() => {
                      apply.mutate(data.id)
                    }}
                  >
                    Jelentkezés
                  </Button>}

                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 grid-rows-7 gap-4'>
                <div>
                  <Label className="text-muted-foreground font-bold">Név</Label>
                </div>
                <div>
                  <p className='font-bold'>{data.company}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground font-bold">Pozíció</Label>
                </div>
                <div>
                  <p className='font-bold'>{data.position}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground font-bold">Leírás</Label>
                </div>
                <div>
                  <p className='font-bold'>{data.description}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground font-bold">Fizetési sáv</Label>
                </div>
                <div>
                  <p className='font-bold'>{data.salaryFrom} - {data.salaryTo} Ft</p>
                </div>
                <div>
                  <Label className="text-muted-foreground font-bold">Foglalkoztatás típusa</Label>
                </div>
                <div>
                  <p className='font-bold'>{data.type === "full-time" ? "Teljes munkaidős" : data.type === "part-time" ? "Részmunkaidős" : "Gyakornok"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground font-bold">Település</Label>
                </div>
                <div>
                  <p className='font-bold'>{data.city}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground font-bold">Home Office</Label>
                </div>
                <div>
                  <p className='font-bold'>{data.homeOffice ? "Van" : "Nincs"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default JobDetails
