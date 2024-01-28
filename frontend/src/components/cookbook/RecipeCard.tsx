import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useNavigate } from "react-router-dom";
import useGetRecipeById from '../../api/recipe/useGetRecipeById';

type Props = {
    image: string,
    recipeId: string,
}

export default function ActionAreaCard({ image, recipeId }: Props) {
    const navigate = useNavigate();
    const hook = useGetRecipeById({ recipeId: recipeId });

    return (
        <Card sx={{ width: '20em' }}>
            <CardActionArea onClick={() => navigate(`/recipe/${hook.data?.id}`)}>
                <CardMedia
                    component="img"
                    height="140"
                    image={image}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {hook.data?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {hook.data?.avgRating ? `${hook.data?.avgRating} / 5` : "No rating yet"}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}