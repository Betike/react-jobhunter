import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useNavigate } from 'react-router-dom'

const JobsTable = ({ data }) => {

    const navigate = useNavigate()

    return (
        <div className='flex justify-center'>
            <div className='w-[80%]'>
                <Table className>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Állás neve</TableHead>
                            <TableHead className="text-right">Fizetés</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((e, i) => (
                            <TableRow className='cursor-pointer' key={i} onClick={() => navigate(`/jobs/${e.id}`)}>
                                <TableCell className="font-medium">
                                    <div className='border-b-2 pb-2'>
                                        {e.company} <br/>
                                        <span className='text-muted-foreground'>{e.position}</span>
                                    </div>
                                    <div className='text-muted-foreground'>{e.city}</div>
                                </TableCell>
                                <TableCell className="text-right">
                                    {e.salaryFrom} - {e.salaryTo} Ft<br />
                                    <p className='text-muted-foreground'>{e.type === "full-time"
                                        ? "Teljes munkaidős"
                                        : e.type === "part-time"
                                            ? "Részmunkaidős"
                                            : "Gyakornok"}</p>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default JobsTable
