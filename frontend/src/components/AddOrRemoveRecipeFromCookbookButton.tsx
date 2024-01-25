import Button from '@mui/material/Button';
import useGetCookBookRecipes from '../api/account/cookbook/useGetCookBookRecipes';
import useAddRecipeToCookBook from '../api/account/cookbook/useAddRecipeToCookBook';
import { useCallback, useMemo } from 'react';
import useRemoveRecipeToCookBook from '../api/account/cookbook/useRemoveRecipeFromCookBook';
import { useQueryClient } from 'react-query';

type Props = {
    recipeId: string
}

export default function AddOrRemoveRecipeFromCookbookButton({ recipeId }: Props) {
    const { data } = useGetCookBookRecipes();
    const queryClient = useQueryClient();
    const isRecipeInCookbook = useMemo(() => data?.recipesIds.includes(recipeId), [recipeId, data]);
    const addRecipe = useAddRecipeToCookBook();
    const removeRecipe = useRemoveRecipeToCookBook();

    const add = useCallback(() => {
        addRecipe.mutate({ recipeId: recipeId }, {
            onSuccess: () => {
                const { recipesIds } = queryClient.getQueryData('getCookBookRecipes') as { recipesIds: string[] | undefined };
                queryClient.setQueryData('getCookBookRecipes', { recipesIds: [...(recipesIds ?? []), recipeId] });
            }
        }
        );
    }, [queryClient, recipeId, addRecipe]);

    const remove = useCallback(() => {
        removeRecipe.mutate({ recipeId: recipeId }, {
            onSuccess: () => {
                const { recipesIds } = queryClient.getQueryData('getCookBookRecipes') as { recipesIds: string[] | undefined };
                queryClient.setQueryData('getCookBookRecipes', { recipesIds: recipesIds?.filter(e => e !== recipeId) });
            }
        }
        );
    }, [queryClient, recipeId, removeRecipe]);

    return (
        <Button sx={{ width: "fit-content" }} onClick={() => isRecipeInCookbook ? remove() : add()} variant="outlined">{isRecipeInCookbook ? 'Unsave recipe' : 'Save recipe'}</Button>
    );
}
