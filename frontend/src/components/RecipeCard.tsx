import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useNavigate } from "react-router-dom";

type Props = {
    id: string,
    image: string,
    name: string,
    rating: number,
}

export default function ActionAreaCard({ id, image, name, rating }: Props) {
    const navigate = useNavigate();
  
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea onClick={() => navigate(`/recipe/${id}`)}>
                <CardMedia
                    component="img"
                    height="140"
                    image={image}
                    alt="lorem ipsum"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {rating} / 5
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}