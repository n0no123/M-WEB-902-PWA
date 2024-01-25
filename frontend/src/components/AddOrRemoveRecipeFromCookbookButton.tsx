import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';
import Button from '@mui/material/Button';
import Error from './Error';
import useGetCookBookRecipes from '../api/account/cookbook/useGetCookBookRecipes';
import useAddRecipeToCookBook from '../api/account/cookbook/useAddRecipeToCookBook';
import useRemoveRecipeToCookBook from '../api/account/cookbook/useRemoveRecipeFromCookBook';

type Props = {
    recipeId: string
}

export default function AddOrRemoveRecipeFromCookbookButton({ recipeId }: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const queryClient = useQueryClient();

    const addRecipe = useAddRecipeToCookBook();
    const removeRecipe = useRemoveRecipeToCookBook();
    const getCookBookRecipes = useGetCookBookRecipes();

    const isRecipeInCookbook = useMemo(() => {
        if (getCookBookRecipes.isSuccess) {
            return getCookBookRecipes.data.recipesIds.includes(recipeId);
        } else if (getCookBookRecipes.isError) {
            setOpen(true);
            setMessage('An error has occured.');
        }
    }, [getCookBookRecipes, recipeId]);

    const add = useCallback(() => {
        addRecipe.mutate({ recipeId: recipeId }, {
            onSuccess: () => {
                const queryData: { recipesIds: Array<string> } | undefined = queryClient.getQueryData('getCookBookRecipes');
                queryClient.setQueryData('getCookBookRecipes', { recipesIds: [...queryData ? queryData.recipesIds : [], recipeId] });
            },
            onError: () => {
                setOpen(true);
                setMessage('An error has occured.');
            }
        });
    }, [addRecipe, queryClient, recipeId]);

    const remove = useCallback(() => {
        removeRecipe.mutate({ recipeId: recipeId }, {
            onSuccess: () => {
                const queryData: { recipesIds: Array<string> } | undefined = queryClient.getQueryData('getCookBookRecipes');
                queryClient.setQueryData('getCookBookRecipes', { recipesIds: queryData ? queryData.recipesIds.filter(id => id !== recipeId) : [] });
            },
            onError: () => {
                setOpen(true);
                setMessage('An error has occured.');
            }
        });
    }, [removeRecipe, queryClient, recipeId]);

    return (
        <>
            <Button
                sx={{ width: "fit-content" }}
                onClick={() => isRecipeInCookbook ? remove() : add()}
                variant="outlined"
            >
                {isRecipeInCookbook ? 'Unsave recipe' : 'Save recipe'}
            </Button>
            <Error open={open} message={message} setOpen={setOpen} setMessage={setMessage} />
        </>
    );
}
