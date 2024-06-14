import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { apiURL } from '@/constants';

const Experiences = ({ modify, experience, auth }) => {

    const queryClient = useQueryClient();
    const [editingExp, setEditingExp] = useState({company: experience.company, title: experience.title, interval: experience.interval});

    const modifyExp = useMutation({
        mutationFn: ({ data, id }) => {
            return fetch(apiURL + `/experiences/${id}`, {
                method: "PATCH",
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            }).then(res => res.json());
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["experiences"] }) }
    });

    const deleteExp = useMutation({
        mutationFn: (expId) => {
            return fetch(apiURL + `/experiences/${expId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                },
            });
        },
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["experiences"] }) }
    });

    const handleChange = (e) => {
        setEditingExp({
            ...editingExp,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        modifyExp.mutate({ data: editingExp, id: experience.id });
    };

    return (
        <div className='mb-4 flex justify-between'>
            <div>
                <p className='text-muted-foreground font-bold'>{experience.company}</p>
            </div>
            <div>
                <p className='font-bold'>{experience.interval} {experience.title}</p>
            </div>
            {modify && 
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => deleteExp.mutate(experience.id)}>Törlés</Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline"><Pencil className="h-4 w-4"/></Button>
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
                                        <Input id="company" name="company" value={editingExp.company} onChange={handleChange} className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="title" className="text-right">
                                            Pozíció
                                        </Label>
                                        <Input id="title" name="title" value={editingExp.title} onChange={handleChange} className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="interval" className="text-right">
                                            Idő intervallum
                                        </Label>
                                        <Input id="interval" name="interval" value={editingExp.interval} onChange={handleChange} className="col-span-3" required />
                                    </div>
                                </div>
                                <Button type="submit">Módosítás</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            }
        </div>
    )
}

export default Experiences
