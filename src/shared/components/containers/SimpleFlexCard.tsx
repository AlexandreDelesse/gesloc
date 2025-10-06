import { Box } from '@mui/material'
import { type ReactNode } from 'react'

interface Props {
    children: ReactNode
}

function SimpleFlexCard(props: Props) {
    const { children } = props

    return <Box flex={1} bgcolor="#333" p={2} borderRadius={2}>
        {children}
    </Box>
}

export default SimpleFlexCard
