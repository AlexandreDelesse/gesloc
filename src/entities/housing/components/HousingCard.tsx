import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import type { Housing } from '../housing.models'

interface Props {
    housing: Housing
}

function HousingCard(props: Props) {
    const { housing } = props

    const handleOnCardClick = () => {
        alert("Clicked on card : " + housing.address)
    }

    return (
        <Card sx={{ width: 340 }} >
            <CardActionArea onClick={handleOnCardClick} >

                <CardMedia image={housing.image} sx={{ height: 140 }} />
                <CardContent>
                    <Typography variant='h6'>
                        {housing.address}
                    </Typography>
                    <Typography variant='body1'>
                        {housing.surface} m²
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default HousingCard
