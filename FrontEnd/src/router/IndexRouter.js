import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignIn from '../views/Users/SignIn'
import Home from '../views/Home'
import { getSession } from '../context/Session'
import SignUp from '../views/Users/SignUp'


export default function IndexRouter() {
    const isLogin = getSession() ? <Home /> : <Navigate to='/sign-in' />

    return (
        <Routes>
            <Route path='/sign-in' element={<SignIn />}></Route>
            <Route path='/sign-up' element={<SignUp />}></Route>
            <Route path='*' element={isLogin}></Route>
        </Routes>
    )
}
