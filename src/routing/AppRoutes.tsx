import { Navigate, Route, Routes } from 'react-router'
import HomePage from '../pages/HomePage'
import HousePage from '../pages/HousePage'

interface Props { }

function AppRoutes(props: Props) {
    const { } = props


    return (
        <Routes>
            <Route index element={<HomePage />} />
            <Route path='house'>
                <Route index element={<Navigate to='/' />} />
                <Route path=':id' element={<HousePage  />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes
