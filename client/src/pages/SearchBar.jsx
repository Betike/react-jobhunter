import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"




const SearchBar = ({ filters, onFilterChange }) => {

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onFilterChange({
            ...filters,
            [name]: type === 'checkbox' ? checked : value,
        });
    }



    return (
        <div className='p-10 flex items-center justify-center w-[100%]'>
            <div className="flex flex-col gap-2">
                <Label htmlFor="search" className='font-bold text-gray-700 text-3xl'>Böngészés az állások között:</Label>
                <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input type="search" name="search" value={filters.search} onChange={handleChange} placeholder="Search" />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">Szűrők</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Szűrők</h4>
                                </div>
                                <div className="grid gap-2">
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="minSal">Fizetési sáv alja</Label>
                                        <Input id="minSal" name="minSal" value={filters.minSal} onChange={handleChange} className="col-span-2 h-8" />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="maxSal">Fizetési sáv teteje</Label>
                                        <Input id="maxSal" name="maxSal" value={filters.maxSal} onChange={handleChange} className="col-span-2 h-8" />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="jobType">Foglalkoztatás típusa</Label>
                                        <Select id="jobType" name="jobType" onValueChange={(value) => onFilterChange({ ...filters, jobType: value })}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="full-time">Teljes munkaidős</SelectItem>
                                                    <SelectItem value="part-time">Részmunkaidős</SelectItem>
                                                    <SelectItem value="internship">Gyakornok</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="city">Település</Label>
                                        <Input id="city" name="city" value={filters.city} onChange={handleChange} className="col-span-2 h-8" />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                    <Checkbox id="homeOffice" name="homeOffice" checked={filters.homeOffice} onCheckedChange={(checked) => onFilterChange({ ...filters, homeOffice: checked })} />
                                        <label
                                            htmlFor="homeOffice"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Home Office lehetőség
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    )
}

export default SearchBar
