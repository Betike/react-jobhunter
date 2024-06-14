import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BriefcaseBusiness } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { CircleDollarSign } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiURL } from "@/constants"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import ApplicantsForJob from "./ApplicantsForJob"


export function CompanyJob({ job, auth }) {

  const queryClient = useQueryClient();
  const [editingJob, setEditingJob] = useState(job);

  const deleteJob = useMutation({
    mutationFn: (jobId) => {
      return fetch(apiURL + `/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["companyUser"] }) }
  });

  const modifyJob = useMutation({
    mutationFn: ({ data, id }) => {
      data.homeOffice == 1 ? data.homeOffice = true : data.homeOffice = false
      return fetch(apiURL + `/jobs/${id}`, {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).then(res => res.json());
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["companyUser"] }) }
  });






  const handleChange = (e) => {
    setEditingJob({
      ...editingJob,
      [e.target.name]: e.target.value,
    });
  };

  const handleSalaryMinChange = (e) => {
    setEditingJob({
      ...editingJob,
      salaryFrom: parseInt(e.target.value),
    })
  }

  const handleSalaryMaxChange = (e) => {
    setEditingJob({
      ...editingJob,
      salaryTo: parseInt(e.target.value)
    })
  }

  const handleTypeChange = (value) => {
    setEditingJob({
      ...editingJob,
      type: value,
    });
  };

  const handleHOChange = (e) => {
    setEditingJob({
      ...editingJob,
      homeOffice: e,
    });
  }

  const handleSliderChange = (values) => {
    setEditingJob({
      ...job,
      salaryFrom: values[0],
      salaryTo: values[1],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    modifyJob.mutate({ data: editingJob, id: job.id })
  };



  return (
    <Card className="w-[80%]">
      <CardContent className="py-10">
        <div className="flex justify-between">
          <div className="flex flex-col gap-3">
            <div className="font-bold text-3xl">
              {job.position}
            </div>
            <div className="flex flex-row gap-3 text-muted-foreground font-bold">
              <div className="flex flex-row gap-1"><BriefcaseBusiness />{job.type}</div>
              <div className="flex flex-row gap-1"><MapPin /> {job.homeOffice === 1 ? "Remote" : job.city}</div>
              <div className="flex flex-row gap-1"><CircleDollarSign />{job.salaryFrom} - {job.salaryTo} Ft</div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Szerkesztés</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Hirdetés szerkesztése</DialogTitle>
                  <DialogDescription>
                    Módosíthatod az álláshirdetést!
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="company" className="text-right">
                        Cég
                      </Label>
                      <Input id="company" name="company" value={editingJob.company} onChange={handleChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="position" className="text-right">
                        Pozíció
                      </Label>
                      <Input id="position" name="position" value={editingJob.position} onChange={handleChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Leírás
                      </Label>
                      <Textarea name="description" id="description" value={editingJob.description} onChange={handleChange} className="w-[100%]" placeholder="Type your message here." />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="salaryFrom" className="text-right">
                        Fizetési sáv alja
                      </Label>
                      <Input type="number" id="salaryFrom" name="salaryFrom" value={editingJob.salaryFrom} onChange={handleSalaryMinChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="salaryTo" className="text-right">
                        Fizetési sáv teteje
                      </Label>
                      <Input type="number" id="salaryTo" name="salaryTo" value={editingJob.salaryTo} onChange={handleSalaryMaxChange} className="col-span-3" required />
                    </div>
                    <Slider
                      value={[editingJob.salaryFrom, editingJob.salaryTo]}
                      onValueChange={handleSliderChange}
                      max={1000000}
                      step={1000}
                      className="mt-2"
                    />
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Foglalkoztatás formája
                      </Label>
                      <Select value={editingJob.type} onValueChange={handleTypeChange} required>
                        <SelectTrigger id="type" className="w-[180px]">
                          <SelectValue placeholder="Válassz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="full-time">Teljes állás</SelectItem>
                            <SelectItem value="part-time">Részmunkaidős</SelectItem>
                            <SelectItem value="internship">Gyakornok</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="city" className="text-right">
                        Település
                      </Label>
                      <Input id="city" name="city" value={editingJob.city} onChange={handleChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="homeOffice" className="text-right">
                        Home Office lehetőség
                      </Label>
                      <Checkbox id="homeOffice" name="homeOffice" checked={editingJob.homeOffice} onCheckedChange={handleHOChange} />
                    </div>
                  </div>
                  <Button type="submit">Módosítás</Button>
                </form>
              </DialogContent>
            </Dialog>
            <ApplicantsForJob jobId={job.id} auth={auth} />
            <Button className="bg-red-500 hover:bg-red-500/80" onClick={() => deleteJob.mutate(job.id)}>Törlés</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
