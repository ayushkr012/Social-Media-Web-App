import { Box, Typography, styled } from '@mui/material';


const emptyProfilePicture = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD5ZayjCxB9Vb4xcKC2H5ZCWGeuGB47GSWBSVsCi7JAA&s';

const Component = styled(Box)`
    background: #black;
    padding: 30px 0;
    text-align: center;
    height:100%;
`;

const Container = styled(Box)`
    padding: 0 200px;
`;

const Image = styled('img')({
    width:400,
    marginTop:100,
    borderRadius: '50% 40% 40% 20%'
});

const Title = styled(Typography)`
    font-size:32px;
    margin:20px 0 10px 0;
    font-family: cursive;
    font-weight:900;
    ${'' /* color:#fff; */}
`;

const Subtitle = styled(Typography)`
    font-size:20px;
    font-family:cursive;
    font-weight:500;
    ${'' /* color:#fff; */}
`;

const Emptychat = () => {
    return (
        <Component>
            <Container>
                <Image src={emptyProfilePicture} alt='logo'/>
                <Title>Connectify</Title>
                <Subtitle>Send and receive messages & connect with your closed ones online!!</Subtitle>
            </Container>
        </Component>
    )
}

export default Emptychat;