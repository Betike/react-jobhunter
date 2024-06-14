import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../auth/authSlice';
import NavBar from './NavBar';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullname: '',
        role: 'company',
    });

    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const { status, error } = auth;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRoleChange = (value) => {
        setFormData({
            ...formData,
            role: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(formData));
    };

    return (
        <div>
            <NavBar />  
            <div className='flex justify-center pt-10'>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Regisztrálás</CardTitle>
                        <CardDescription>Add meg az adataid a regisztráláshoz.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="email">Email</Label>
                                    <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="password">Jelszó</Label>
                                    <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="fullname">Teljes név</Label>
                                    <Input type="text" name="fullname" value={formData.fullname} onChange={handleChange} required />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="role">Szerep</Label>
                                    <Select onValueChange={handleRoleChange} defaultValue={formData.role}>
                                        <SelectTrigger id="role">
                                            <SelectValue placeholder="válassz" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="company">Munkáltató</SelectItem>
                                            <SelectItem value="jobseeker">Munkavállaló</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/*formData.role === 'jobseeker' && (
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="experience">Korábbi munkatapasztalatok</Label>
                                        <Input
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            placeholder="Halo Haven;Front-end fejlesztő;2021-2022&#10;Dunder Mifflin;Full-stack fejlesztő;2022-"
                                        />
                                    </div>
                                )*/}
                            </div>
                            <CardFooter className="felx justify-center pt-5">
                                <Button type="submit">Regisztráció</Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {status === 'loading' && <p className='pt-5 text-center text-2xl text-yellow-700'>Regisztrálás folyamatban...</p>}
            {status === 'failedRegister' && <p className='pt-5 text-center text-2xl text-red-700'>Hiba a regisztrálás során. Valószínűleg már létezik felhasználó ezzel az e-mail címmel.</p>}
            {status === 'succeeded' && <p className='pt-5 text-center text-2xl text-green-700'>Regisztráció sikeres!</p>}
        </div>
    );
};

export default Register;
