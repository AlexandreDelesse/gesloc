import { Stack } from '@mui/material'
import type { Housing } from '../housing.models'
import HousingCard from './HousingCard'

interface Props {
    houses: Housing[]
    onClick?: (h: Housing) => void
}

function HousingCardList(props: Props) {
    const { houses, onClick } = props

    return (
        <Stack gap={2} direction="row">
            {houses.map(h => <HousingCard key={h.id} onClick={onClick} housing={h} />)}
        </Stack>
    )
}

export default HousingCardList
