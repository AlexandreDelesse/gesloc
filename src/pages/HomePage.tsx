import { Container, Typography } from "@mui/material"
import type { Housing } from "../entities/housing/housing.models"
import img from "../assets/images.jpg"
import img2 from "../assets/Carqueiranne.jpg"
import HousingCardList from "../entities/housing/components/HousingCardList"
import { useNavigate } from "react-router"

interface Props { }

function HomePage(props: Props) {
    const { } = props
    const navigate = useNavigate()

    const houses: Housing[] = [{
        address: "La parade - Aix en provence",
        id: "1",
        image: img,
        owner: "Notarianni Chantal",
        surface: 32
    }, {
        address: "Beau vézé - Carqueiranne",
        id: "2",
        image: img2,
        owner: "Sci Alexandre",
        surface: 49
    }]

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

