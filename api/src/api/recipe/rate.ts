import {User} from "../../models/user";
import {EndpointReturn} from "../_misc/endpoint-return";
import datasource from "../../misc/datasource";
import {Recipe} from "../../models/recipe";
import {Rating} from "../../models/rating";

type Params = {
    recipeId: string;
    rating: number;
}

const rate = async (params: Params, user: User): Promise<EndpointReturn<never>> => {
    const ratingRepository = datasource.getRepository(Rating);
    const recipeRepository = datasource.getRepository(Recipe);
    const recipe = await recipeRepository.findOne({
        where: {id: params.recipeId },
        relations: []
    });

    if (!recipe) {
        return {
            status: 404,
            errorMessage: "Recipe not found"
        }
    }

    const rating = ratingRepository.create({
        rating: params.rating,
        recipe,
        user
    });

    await ratingRepository.save(rating);
    return {
        status: 200
    }
}

export default rate;
