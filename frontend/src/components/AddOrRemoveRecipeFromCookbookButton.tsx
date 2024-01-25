import Button from '@mui/material/Button';
import useGetCookBookRecipes from '../api/account/cookbook/useGetCookBookRecipes';
import useAddRecipeToCookBook from '../api/account/cookbook/useAddRecipeToCookBook';
import { useState } from 'react';
import useRemoveRecipeToCookBook from '../api/account/cookbook/useRemoveRecipeFromCookBook';

type Props = {
    recipeId: string
}

export default function AddOrRemoveRecipeFromCookbookButton({ recipeId }: Props) {
    const { data } = useGetCookBookRecipes();
    const [isRecipeInCookbook, setIsRecipeInCookbook] = useState(data?.recipesIds.includes(recipeId));
    const addRecipe = useAddRecipeToCookBook();
    const removeRecipe = useRemoveRecipeToCookBook();

    const add = () => {
        addRecipe.mutate({ recipeId: recipeId });
        if (addRecipe.isSuccess) {
            setIsRecipeInCookbook(true);
        }
    }

    const remove = () => {
        removeRecipe.mutate({ recipeId: recipeId });
        if (removeRecipe.isSuccess) {
            setIsRecipeInCookbook(false);
        }
    }

    return (
        <Button sx={{ width: "fit-content" }} onClick={() => isRecipeInCookbook ? remove() : add()} variant="outlined">{isRecipeInCookbook ? 'Unsave recipe' : 'Save recipe'}</Button>
    );
}
