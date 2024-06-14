import { apiURL } from '@/constants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from './NavBar';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../auth/authSlice';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import CompanyUserDetails from './CompanyUserDetails';
import Experiences from './Experiences';

const UserDetails = () => {

  const auth = useSelector((state) => state.auth);
  const userId = auth.user.id
  const dispatch = useDispatch();

  const [modify, setModify] = useState(false);
  const [exp, setExp] = useState([{ company: "", title: "", interval: "" }]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      dispatch(login({ token, user }));
    }
  }, [dispatch]);

  const queryClient = useQueryClient();

  const addExp = useMutation({
    mutationFn: (data) => {
      return fetch(apiURL + '/experiences', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }).then(res => res.json());
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["experiences"] }) }
  });


  const { isLoading: expLoading, data: expData, error: expError } = useQuery({
    queryKey: ["experiences", userId],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${apiURL}/experiences`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    },
  });

  const handleChange = (index, e) => {
    const newExp = [...exp];
    newExp[index][e.target.name] = e.target.value;
    setExp(newExp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addExp.mutate(exp);
    setExp([{ company: "", title: "", interval: "" }]);
  };

  const addExperienceField = () => {
    setExp([...exp, { company: "", title: "", interval: "" }]);
  };

  const removeExperienceField = (index) => {
    const newExp = exp.filter((_, i) => i !== index);
    setExp(newExp);
  };

  if (expLoading) {
    return <>Loading...</>;
  }

  if (expError) {
    return <>Error: {expError.message}</>;
  }

  if (auth.user.role === "company") {
    return <CompanyUserDetails />
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
                  <CardTitle>Személyes adatok</CardTitle>
                  <CardDescription>Adataid és tapasztalataid egy helyen.</CardDescription>
                </div>
                <div>
                  <Button onClick={() => setModify(!modify)}>
                    <Pencil className='h-5 w-5 pr-1'></Pencil>
                    Tapasztalatok szerkesztése
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 grid-rows-4 gap-4 pb-10'>
                <div>
                  <Label className="text-muted-foreground font-bold">Név</Label>
                </div>
                <div>
                  <p className='font-bold'>{auth.user.fullname}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground font-bold">Email</Label>
                </div>
                <div>
                  <p className='font-bold'>{auth.user.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground font-bold">Foglalkoztatás típusa</Label>
                </div>
                <div>
                  <p className='font-bold'>{auth.user.role === "jobseeker" ? "Munkakereső" : ""}</p>
                </div>
                <div>
                  <Label className="font-bold text-2xl">Munkatapasztalat</Label>
                </div>
              </div>
              <div>
                {expData.data && expData.data.length > 0 ? (
                  expData.data.map((experience, index) => (
                    <Experiences auth={auth} key={index} modify={modify} experience={experience} />
                  ))
                ) : (
                  <p>Nincs munkatapasztalat megadva.</p>
                )}
              </div>
              {modify && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mr-5">Tapasztalat Hozzáadása</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Munkatapasztalat hozzáadása</DialogTitle>
                      <DialogDescription>
                        Adj hozzá munkatapasztalatot a profilodhoz!
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      {exp.map((experience, index) => (
                        <div key={index} className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`company-${index}`} className="text-right">
                              Cég
                            </Label>
                            <Input
                              id={`company-${index}`}
                              name="company"
                              value={experience.company}
                              onChange={(e) => handleChange(index, e)}
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`title-${index}`} className="text-right">
                              Pozíció
                            </Label>
                            <Input
                              id={`title-${index}`}
                              name="title"
                              value={experience.title}
                              onChange={(e) => handleChange(index, e)}
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`interval-${index}`} className="text-right">
                              Időtartam
                            </Label>
                            <Input
                              id={`interval-${index}`}
                              name="interval"
                              value={experience.interval}
                              onChange={(e) => handleChange(index, e)}
                              className="col-span-3"
                              required
                            />
                          </div>
                          {exp.length > 1 && (
                            <Button onClick={() => removeExperienceField(index)}>-</Button>
                          )}
                        </div>
                      ))}
                      <DialogFooter>
                        <Button type="submit">Hozzáadás</Button>
                      </DialogFooter>
                    </form>
                    <Button onClick={addExperienceField}>+</Button>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
