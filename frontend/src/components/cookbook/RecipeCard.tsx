import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useNavigate } from "react-router-dom";
import useGetRecipeById from '../../api/recipe/useGetRecipeById';

type Props = {
    recipeId: string,
}

const ActionAreaCard = ({ recipeId }: Props) => {
    const navigate = useNavigate();
    const {data} = useGetRecipeById({ recipeId });

    return (
        <Card sx={{ width: '20em' }}>
            <CardActionArea onClick={() => navigate(`/recipe/${data?.id}`)}>
                <CardMedia
                    component="img"
                    height="140"
                    image={data?.image ? `${process.env.REACT_APP_API_URL}${data?.image}` : '/assets/placeholder.png'}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {data?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {data?.avgRating ? `${data?.avgRating} / 5` : "No rating yet"}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default ActionAreaCard;
