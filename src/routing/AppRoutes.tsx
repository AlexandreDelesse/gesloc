import { Route, Routes } from 'react-router'
import HomePage from '../pages/HomePage'

interface Props { }

function AppRoutes(props: Props) {
    const { } = props

    return (
        <Routes>
            <Route index element={<HomePage />} />
            <Route path='house'>
                <Route path=':id' element={<div>coucou</div>} />
            </Route>
        </Routes>
    )
}

export default AppRoutes
