import {User} from "../../models/user";
import {EndpointReturn} from "../_misc/endpoint-return";
import datasource from "../../misc/datasource";
import {Recipe} from "../../models/recipe";
import {Rating} from "../../models/rating";
import pushNotificationProvider from "../../providers/push-notification";

type Params = {
    recipeId: string;
    rating: number;
}

const rate = async (params: Params, user: User): Promise<EndpointReturn<never>> => {
    const ratingRepository = datasource.getRepository(Rating);
    const recipeRepository = datasource.getRepository(Recipe);
    const recipe = await recipeRepository.findOne({
        where: {id: params.recipeId },
        relations: ["owner"]
    });
    console.log("before singleton")
    const pushNotification = pushNotificationProvider();
   console.log(pushNotification);
    console.log("before checks")
    if (!recipe) {
        return {
            status: 404,
            errorMessage: "Recipe not found"
        }
    }
    if (recipe.owner.id === user.id) {
        return {
            status: 400,
            errorMessage: "You cannot rate your own recipe"
        }
    }
    console.log("before rating creation")
    const rating = ratingRepository.create({
        rating: params.rating,
        recipe,
        user
    });

    console.log("before rating")
    await ratingRepository.save(rating);
    console.log("after rating")

    pushNotification.sendNotification({
        message: `Your recipe ${recipe.name} has been rated by ${user.email} ! Click here to see the rating.`,
        userEndpoint: recipe.owner.notificationLink,
        url: '/recipe/' + recipe.id,
        title: 'One of your recipe has been rated!',
    })
    console.log("after notif send");
    return {
        status: 200
    }
}

export default rate;
