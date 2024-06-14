import { useQuery } from '@tanstack/react-query';
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { apiURL } from '@/constants';
import { useNavigate } from 'react-router-dom';

const ApplicantsForJob = ({ jobId, auth }) => {

    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery({
        queryKey: ["applicants", jobId],
        queryFn: async () => {
            const response = await fetch(`${apiURL}/applicants?jobId=${jobId}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data;
        },
    });

    if (error) {
        return <div>Error: {error.message}</div>;
    }


    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Megtekintés</Button>
                </DialogTrigger>
                <DialogContent>
                    {isLoading && !data && <>Loading...</>}
                    {data && data.length > 0 && data.map((applicant) => (
                        <div className="flex justify-center font-bold m-3 p-2 cursor-pointer border-gray-500 border-2 rounded-lg" onClick={() => navigate(`/users/${applicant.user.id}`)} key={applicant.id}>{applicant.user.fullname}</div>
                    ))}
                    {data && data.length === 0 && <p>Nincs jelentkező</p>}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ApplicantsForJob
