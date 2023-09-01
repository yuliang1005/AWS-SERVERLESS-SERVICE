import React from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import Uploading from '../views/ImageHandling/Uploading'
import Delete from '../views/ImageHandling/Delete'
import ByTags from '../views/Search/ByTags'
import ByImage from '../views/Search/ByImage'
import UpdateTags from '../views/Search/UpdateTags'

export default function FunctionRouter() {
    return (

        <Routes>
            <Route path='/image/upload' element={<Uploading />}></Route>
            <Route path='/image/delete' element={<Delete />}></Route>
            <Route path='/search/update-tags' element={<UpdateTags />}></Route>
            <Route path='/search/by-tags' element={<ByTags />}></Route>
            <Route path='/search/by-image' element={<ByImage />}></Route>
            <Route path='*' element={<Navigate to='/image/upload' />}></Route>
        </Routes>

    )
}
