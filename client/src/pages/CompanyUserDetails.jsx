import React from 'react'
import NavBar from './NavBar'
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { apiURL } from '@/constants';
import { CompanyJob } from './CompanyJob';
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

const CompanyUserDetails = () => {

    const auth = useSelector((state) => state.auth);
    const userId = auth.user.id;
    const [job, setJob] = useState({ company: "", city: "", description: "", homeOffice: false, position: "", salaryFrom: 0, salaryTo: 0, type: "" });
    const queryClient = useQueryClient();

    const { isLoading, data } = useQuery({
        queryKey: ["companyUser", userId],
        queryFn: async () => {
            const response = await fetch(`${apiURL}/jobs?userId=${userId}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            return data;
        },
    });

    const addJob = useMutation({
        mutationFn: (job) => {
            job.homeOffice == 1 ? job.homeOffice = true : job.homeOffice = false
            return fetch(apiURL + '/jobs/1', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(job)
            }).then(res => res.json());
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["companyUser", auth.user.id] }) }
    });

    const handleChange = (e) => {
        setJob({
            ...job,
            [e.target.name]: e.target.value,
        });
    };

    const handleSalaryMinChange = (e) => {
        setJob({
            ...job,
            salaryFrom: parseInt(e.target.value),
        })
    }

    const handleSalaryMaxChange = (e) => {
        setJob({
            ...job,
            salaryTo: parseInt(e.target.value)
        })
    }

    const handleTypeChange = (value) => {
        setJob({
            ...job,
            type: value,
        });
    };

    const handleHOChange = (e) => {
        setJob({
            ...job,
            homeOffice: e,
        });
    }

    const handleSliderChange = (values) => {
        setJob({
            ...job,
            salaryFrom: values[0],
            salaryTo: values[1],
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        addJob.mutate(job)
        setJob({ company: "", city: "", description: "", homeOffice: false, position: "", salaryFrom: 0, salaryTo: 0, type: "" })
    };

    if (isLoading || !data) {
        return <>Loading</>
    }

    return (
        <div>
            <NavBar />
            {data.data.length === 0 && <>Nincsenek megjeleníthető álláshirdetések</>}
            <div className='flex justify-center pt-10'>
                <div className='w-[80%] flex flex-col items-center justify-center gap-y-4'>
                    {data.data.map((job) => <CompanyJob auth={auth} job={job} key={job.id} />)}
                </div>
            </div>
            <div className='flex justify-center pt-10 mb-20'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Hirdetés hozzáadása</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Hirdetés hozzáadása</DialogTitle>
                            <DialogDescription>
                                Hozz létre egy új álláshirdetést!
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="company" className="text-right">
                                        Cég
                                    </Label>
                                    <Input id="company" name="company" value={job.company} onChange={handleChange} className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="position" className="text-right">
                                        Pozíció
                                    </Label>
                                    <Input id="position" name="position" value={job.position} onChange={handleChange} className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">
                                        Leírás
                                    </Label>
                                    <Textarea name="description" id="description" value={job.description} onChange={handleChange} className="w-[100%]" placeholder="Type your message here." />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="salaryFrom" className="text-right">
                                        Fizetési sáv alja
                                    </Label>
                                    <Input type="number" id="salaryFrom" name="salaryFrom" value={job.salaryFrom} onChange={handleSalaryMinChange} className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="salaryTo" className="text-right">
                                        Fizetési sáv teteje
                                    </Label>
                                    <Input type="number" id="salaryTo" name="salaryTo" value={job.salaryTo} onChange={handleSalaryMaxChange} className="col-span-3" required />
                                </div>
                                <Slider
                                    value={[job.salaryFrom, job.salaryTo]}
                                    onValueChange={handleSliderChange}
                                    max={1000000}
                                    step={1000}
                                    className="mt-2"
                                />
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="type" className="text-right">
                                        Foglalkoztatás formája
                                    </Label>
                                    <Select onValueChange={handleTypeChange} required>
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
                                    <Input id="city" name="city" value={job.city} onChange={handleChange} className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="homeOffice" className="text-right">
                                        Home Office lehetőség
                                    </Label>
                                    <Checkbox id="homeOffice" name="homeOffice" checked={job.homeOffice} onCheckedChange={handleHOChange} />
                                </div>
                            </div>
                            <Button type="submit">Hozzáadás</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default CompanyUserDetails
