import { Container, Typography } from "@mui/material"
import type { Housing } from "../entities/housing/housing.models"
import HousingCardList from "../entities/housing/components/HousingCardList"
import { useNavigate } from "react-router"
import { getHouses } from "../entities/housing/housing.repository"

interface Props { }

function HomePage(props: Props) {
    const { } = props
    const navigate = useNavigate()

    const houses: Housing[] = getHouses()

    const handleOnHouseClick = (h: Housing) => {
        navigate(`house/${h.id}`)
    }

    //TODO: Faire un composant Page réutilisable pour que les pages soient cohérentes.
    return (
        <Container>
            <Typography variant="h2" my={2}>Logements</Typography>

            <HousingCardList houses={houses} onClick={handleOnHouseClick} />
        </Container>
    )
}

export default HomePage

