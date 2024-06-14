import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authenticate } from '../auth/authSlice';
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

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });

    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const { status, error } = auth;

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(authenticate(credentials));
    };

    return (
        <div>
            <NavBar />
            <div className='flex justify-center pt-10'>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Bejelentkezés</CardTitle>
                        <CardDescription>Kérjük, adja meg az email címét és jelszavát a bejelentkezéshez.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="email">Email</Label>
                                    <Input type="email" name="email" value={credentials.email} onChange={handleChange} required />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="password">Jelszó</Label>
                                    <Input type="password" name="password" value={credentials.password} onChange={handleChange} required />
                                </div>
                            </div>
                            <CardFooter className="flex justify-center pt-5">
                                <Button type="submit">Bejelentkezés</Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            </div>
            {status === 'loading' && <p className='pt-5 text-center text-2xl text-yellow-700'>Bejelentkezés...</p>}
            {status === 'failedLogin' && <p className='pt-5 text-center text-2xl text-red-700'>Hibás felhasználónév vagy jelszó!</p>}
            {status === 'succeeded' && <p className='pt-5 text-center text-2xl text-green-700'>Sikeresen bejelentkezve!</p>}
        </div>
    );
};

export default Login;
