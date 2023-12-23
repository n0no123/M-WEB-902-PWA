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
    Divider,
    Skeleton,
    Slider,
    Stack,
    Typography
} from "@mui/material";
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
        gap: 2,
        left: "50%",
        padding: "1em",
        transform: "translateX(-50%)",
        position: "relative",
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
    const {data: isLoggedIn} = useIsLoggedIn();

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
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <img src={"https://picsum.photos/500/300"} height={300} width={500} alt={"decorative image"}/>
            </Box>
            <Stack>
                <Stack
                    sx={{
                        width: "80%",
                        backgroundColor: "#ededed",
                        borderRadius: ".5em",
                        padding: "1em",
                        gap: 1,
                        margin: "auto"
                    }}
                >
                    <Typography sx={{fontWeight: "bold"}}>
                        Average rating :{" "}
                        <Typography
                            component={"span"}
                        >
                            {
                                data.avgRating !== -1 ?
                                    `${data.avgRating} / 5` :
                                    "No rating yet"
                            }
                        </Typography>
                    </Typography>
                    {
                        isLoggedIn && <>
                            <Divider/>
                            <Stack
                                direction={"row"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                            >
                                <Typography sx={{fontWeight: "bold"}}>
                                    Your rating :{" "}
                                    <Typography
                                        component={"span"}
                                    >
                                        {
                                            data.yourRating !== undefined ?
                                                `${data.yourRating} / 5` :
                                                "You havent rated this recipe yet"
                                        }
                                    </Typography>
                                </Typography>
                                <RatingDialog currentRating={data.yourRating} recipeId={id}/>
                            </Stack>
                        </>
                    }
                </Stack>
            </Stack>
            <Typography variant={"body1"} sx={styles.description}>{data.description}</Typography>
            <Typography variant={"body1"}>Number of
                servings: {data.servings}pp{data.servings > 0 ? "s" : ""}</Typography>
            <Divider>Ingredients</Divider>
            {
                data.ingredients.map(
                    ingredient =>
                        <Typography
                            sx={styles.wrappedTypography}
                        >
                            {ingredient.quantityWithUnit} {ingredient.name}
                        </Typography>
                )
            }
            <Divider>Preparation</Divider>
            <Stack
                sx={{
                    width: "80%",
                    backgroundColor: "#ededed",
                    borderRadius: ".5em",
                    padding: "1em",
                    gap: 1,
                    alignItems: "center",
                    margin: "auto"
                }}
            >
                <Box>
                    <Typography sx={{fontWeight: "bold"}}>
                        Total time :{" "}
                        <Typography
                            variant={"body1"}
                            component={"span"}
                        >
                            {data.totalPreparationTimeInMinutes}mn
                        </Typography>
                    </Typography>
                </Box>
                <Divider sx={{width: "100%"}}/>
                <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    sx={{
                        width: "75%",
                    }}
                >
                    <Typography sx={{fontWeight: "bold"}}>
                        Preparation time :
                        <Typography textAlign={"center"}>{data.preparationTimeInMinutes}mn</Typography>
                    </Typography>
                    <Typography sx={{fontWeight: "bold"}}>
                        Cooking time :
                        <Typography textAlign={"center"}>{data.cookingTimeInMinutes}mn</Typography>
                    </Typography>
                </Stack>
            </Stack>
            {
                data.steps.map((step, index) =>
                    <Stack>
                        <Typography fontWeight={"600"}>STEP {index}</Typography>
                        <Typography sx={styles.wrappedTypography}>{step}</Typography>
                    </Stack>
                )
            }
            <Divider>Tags</Divider>
            <Typography sx={styles.wrappedTypography}>{data.tags.join(", ")}</Typography>
        </Stack>
    </Box>;
};

export default VisualizeRecipe;
