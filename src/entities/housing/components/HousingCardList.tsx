import { Stack } from '@mui/material'
import type { Housing } from '../housing.models'
import HousingCard from './HousingCard'

interface Props {
    houses: Housing[]
}

function HousingCardList(props: Props) {
    const { houses } = props

    return (
        <Stack gap={2} direction="row">
            {houses.map(h => <HousingCard housing={h} />)}
        </Stack>
    )
}

export default HousingCardList
