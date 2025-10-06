import { Stack, Typography } from '@mui/material'

interface Props {
    title: string,
    content: string,
}

function DisplayInformation(props: Props) {
    const { title, content } = props

    return <Stack direction={'column'}>
        <Typography variant='caption'>
            {title}
        </Typography>
        <Typography variant='h6'>
            {content}
        </Typography>
    </Stack>
}

export default DisplayInformation
