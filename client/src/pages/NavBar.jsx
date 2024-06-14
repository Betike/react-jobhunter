import React from 'react'
import { login, logout } from '../auth/authSlice'
import { Aperture } from "lucide-react"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const NavBar = () => {

    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const localUser = localStorage.getItem('user')
        let user = ""
        if (localUser !== "undefined") {
            user = JSON.parse(localUser);
        }
        if (token && user) {
            dispatch(login({ token, user }));
        }
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className='p-8 bg-[rgb(31,41,55)] flex items-center'>
            <Aperture className='h-10 w-10 text-white cursor-pointer' onClick={() => navigate('/')}></Aperture>
            {auth.isAuthenticated ? (
                <>
                    <button className='text-white text-2xl px-10 font-bold' onClick={() => navigate('/')}>Álláshirdetések</button>
                    <button className='text-white text-2xl px-10 font-bold' onClick={() => navigate('/profile')}>Profilom</button>
                    {auth.user.role && auth.user.role === 'company' && (
                        <button className='text-white text-2xl px-10 font-bold' onClick={() => navigate('/create-job')}>Álláshirdetés hozzáadása</button>
                    )}
                    <button className='text-white text-2xl px-10 font-bold' onClick={handleLogout}>Kijelentkezés</button>
                </>

            ) : (
                <>
                    <button className='text-white text-2xl px-10 font-bold' onClick={() => navigate('/login')}>Bejelentkezés</button>
                    <button className='text-white text-2xl px-10 font-bold' onClick={() => navigate('/register')}>Regisztráció</button>
                </>
            )}
        </div>
    )
}

export default NavBar
