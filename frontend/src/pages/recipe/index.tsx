import useGetRecipeById from "../../api/recipe/useGetRecipeById";
import {Link, useParams} from "react-router-dom";
import React, {CSSProperties, useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider, Skeleton, Slider,
    Stack,
    Typography
} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import HalfStarIcon from '@mui/icons-material/StarHalf';
import useRateRecipe from "../../api/recipe/useRateRecipe";
import EditRecipe from "../../components/EditRecipe";
import useIsLoggedIn from "../../api/account/useIsLoggedIn";

type RatingDialogProps = {
    currentRating: number | undefined,
    recipeId: string
}

const RatingDialog = ({currentRating, recipeId}: RatingDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(currentRating ?? 0);
    const {mutate, isError, isLoading, isSuccess} = useRateRecipe();

    useEffect(
        () => {
            if (isSuccess)
                setIsOpen(false);
        },
        [isSuccess]
    );
    return <>
        <Button
            onClick={() => setIsOpen(true)}
            sx={{width: "fit-content"}}
            variant={"outlined"}
        >
            {
                currentRating ?
                    "Change your rating" :
                    "Rate this recipe"
            }
        </Button>
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            fullWidth={true}
        >
            <DialogTitle>
                {
                    currentRating ?
                        "Change your rating" :
                        "Rate this recipe"
                }
            </DialogTitle>
            <DialogContent
                dividers
            >
                <Stack>
                    <Typography>Rating:</Typography>
                    <Slider
                        value={rating}
                        onChange={(event, value) => setRating(value as number)}
                        step={0.5}
                        marks
                        min={0}
                        max={5}
                        valueLabelDisplay={"auto"}
                    />
                </Stack>
                {
                    isError && <Alert severity={"error"}>Error while rating recipe</Alert>
                }
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => setIsOpen(false)} disabled={isLoading}
                    variant={"outlined"}
                >Cancel</Button>
                <Button
                    onClick={() => mutate({recipeId, rating: rating as any})}
                    variant={"contained"}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    </>;
}

const styles: Record<string, CSSProperties> = {
    root: {
        left: "50%",
        padding: "1em",
        transform: "translateX(-50%)",
        position: "absolute",
        width: "50%",
        minHeight: "calc(100% - 4em)",
        backgroundColor: "white",
        borderRadius: "1em",
    },
    name: {
        width: "100%",
        textAlign: "center"
    },
    description: {
        width: "100%",
        wordBreak: "break-word",
        paddingBottom: "1em",
        paddingTop: "1em"
    },
    rateButton: {
        width: "fit-content"
    },
    container: {
        position: "absolute",
        minHeight: "calc(100% - 2em)",
        width: "calc(100% - 2em)",
        backgroundColor: "#e3e3e3",
        padding: "1em",
    },
    wrappedTypography: {
        width: "100%",
        wordBreak: "break-word"
    }
}

const VisualizeRecipe = () => {
    const {id} = useParams();
    const {data, isLoading, isError, isIdle, error} = useGetRecipeById({recipeId: id ?? ""});
    const { data: isLoggedIn } = useIsLoggedIn();

    if (id === "" || id === undefined)
        return <Typography>No recipe id provided</Typography>
    if (isLoading || isIdle)
        return <Box sx={styles.container}>
            <Stack sx={styles.root}>
                <Skeleton
                    variant={"text"}
                    sx={{
                        position: "relative",
                        left: "50%",
                        transform: "translateX(-50%)"
                    }}
                    width={250}
                    height={112}
                />
                <Skeleton variant={"text"} width={250}/>
                <Skeleton variant={"text"} width={260}/>
                <Skeleton variant={"rounded"} height={35} width={160}/>
                <Skeleton variant={"text"} height={200}/>

                <Divider>Ingredients</Divider>
                {
                    new Array(10).fill(<Skeleton variant={"text"}/>)
                }
                <Divider>Preparation steps</Divider>
                {
                    new Array(10).fill(<Skeleton variant={"text"}/>)
                }
                <Divider>Tags</Divider>
                <Skeleton variant={"text"}/>
            </Stack>
        </Box>;
    if (isError)
        return <Typography>{JSON.stringify(error)}</Typography> //TODO: error page
    return <Box sx={styles.container}>
        <Stack sx={styles.root}>
            <Link to={"/"}>{"<"} Go back to trending</Link>
            {
                data.owner &&
                <EditRecipe
                    recipeId={id}
                    defaultValues={data}
                />
            }
            <Typography variant="h1" sx={styles.name}>{data.name}</Typography>
            <Stack>
                <Stack direction={"row"} alignItems={"center"}>
                    <Typography variant={"body1"}>Average rating:</Typography>
                    {
                        data.avgRating === -1 ?
                            <Typography variant={"body1"}>No rating yet</Typography> :
                            <Stack direction={"row"} alignItems={"center"}>
                                {
                                    new Array(Math.floor(data.avgRating)).fill(StarIcon).concat(
                                        data.avgRating % 1 === 0 ? [] : [HalfStarIcon]
                                    )
                                }
                            </Stack>
                    }
                </Stack>
                <Stack direction={"row"} alignItems={"center"}>
                    <Typography variant={"body1"}>Your rating:</Typography>
                    {
                        data.yourRating === undefined ?
                            <Typography variant={"body1"}>You havent rated this recipe yet</Typography> :
                            <Stack direction={"row"} alignItems={"center"}>
                                {
                                    new Array(Math.floor(data.yourRating)).fill(StarIcon).concat(
                                        data.yourRating % 1 === 0 ? [] : [HalfStarIcon]
                                    )
                                }
                            </Stack>
                    }
                </Stack>
                {
                    isLoggedIn &&
                    <RatingDialog currentRating={data.yourRating} recipeId={id}/>
                }
            </Stack>
            <Typography variant={"body1"} sx={styles.description}>{data.description.repeat(100)}</Typography>
            <Typography variant={"body1"}>Preparation time: {data.preparationTimeInMinutes}mn</Typography>
            <Typography variant={"body1"}>Cooking time: {data.cookingTimeInMinutes}mn</Typography>
            <Typography variant={"body1"}>Total preparation time: {data.totalPreparationTimeInMinutes}mn</Typography>
            <Typography variant={"body1"}>Number of
                servings: {data.servings}pp{data.servings > 0 ? "s" : ""}</Typography>
            <Divider>Ingredients</Divider>
            {
                data.ingredients.map(
                    (ingredient, index) =>
                        <Typography
                            sx={styles.wrappedTypography}>{index}. {ingredient.quantityWithUnit} {ingredient.name}</Typography>
                )
            }
            <Divider>Preparation steps</Divider>
            {
                data.steps.map((step, index) => <Typography sx={styles.wrappedTypography}>{index}. {step}</Typography>)
            }
            <Divider>Tags</Divider>
            <Typography sx={styles.wrappedTypography}>{data.tags.join(", ")}</Typography>
        </Stack>
    </Box>;
};

export default VisualizeRecipe;
