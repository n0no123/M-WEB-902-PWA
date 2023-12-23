import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    TextField,
    IconButton,
    Typography, Alert
} from "@mui/material";
import React, {CSSProperties, useCallback, useEffect, useState} from "react";
import {IngredientDto} from "../api/recipe/useCreateRecipe";
import useEditRecipe from "../api/recipe/useEditRecipe";
import AddIcon from "@mui/icons-material/Add";

const styles: Record<string, CSSProperties> = {
    typography: {
        maxWidth: "100%",
        wordWrap: "break-word"
    },
    openButton: {
        width: "fit-content"
    }
}

type DefaultValuesDTO = {
    name: string;
    description: string;
    ingredients: IngredientDto[];
    steps: string[];
    tags: string[];
    preparationTimeInMinutes: number;
    cookingTimeInMinutes: number;
    servings: number;
}

type EditRecipeProps = {
    recipeId: string;
    defaultValues: DefaultValuesDTO;
}

const EditRecipe = ({recipeId, defaultValues}: EditRecipeProps) => {
    const {mutate, isLoading, isSuccess, isError, error: mutationError} = useEditRecipe();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentlyEditedStep, setCurrentlyEditedStep] = useState<string>("");
    const [currentlyEditedIngredientQuantityWithUnit, setCurrentlyEditedIngredientQuantityWithUnit] = useState<string>("");
    const [currentlyEditedIngredientName, setCurrentlyEditedIngredientName] = useState<string>("");
    const [currentlyEditedTag, setCurrentlyEditedTag] = useState<string>("");
    const [error, setError] = useState<string | undefined>(undefined);

    //recipe
    const [name, setName] = useState(defaultValues.name);
    const [description, setDescription] = useState(defaultValues.description);
    const [ingredients, setIngredients] = useState(defaultValues.ingredients);
    const [steps, setSteps] = useState(defaultValues.steps);
    const [tags, setTags] = useState(defaultValues.tags);
    const [preparationTime, setPreparationTime] = useState<number | undefined>(defaultValues.preparationTimeInMinutes);
    const [cookingTime, setCookingTime] = useState<number | undefined>(defaultValues.cookingTimeInMinutes);
    const [servings, setServings] = useState<number | undefined>(defaultValues.servings);

    const submit = useCallback(
        () => {
            if (!name)
                setError("Name is required");
            else if (!description)
                setError("Description is required");
            if (!preparationTime)
                setError("Preparation time is required");
            else if (!cookingTime)
                setError("Cooking time is required");
            else if (!servings)
                setError("Servings is required");
            else if (ingredients.length === 0)
                setError("Ingredients is required");
            else if (steps.length === 0)
                setError("Steps is required");
            else {
                mutate({
                    id: recipeId,
                    name,
                    description,
                    preparationTimeInMinutes: preparationTime,
                    cookingTimeInMinutes: cookingTime,
                    servings,
                    steps,
                    ingredients,
                    tags
                })
                setError(undefined);
            }
        },
        [
            name,
            description,
            preparationTime,
            cookingTime,
            servings,
            steps,
            ingredients,
            tags,
            mutate,
            setError
        ]
    );
    const handleNumberType = useCallback(
        (setter: (_: number | undefined) => void) => (e: string) => {
            const value = Number(e);

            if (e === "")
                return setter(undefined);
            if (!(isNaN(value) || value < 0 || value > 99999))
                return setter(value);
        },
        []
    );

    useEffect(
        () => {
            if (isSuccess)
                setIsDialogOpen(false);
        },
        [isSuccess]
    );

    return <>
        <Button
            onClick={() => setIsDialogOpen(true)}
            sx={styles.openButton}
            variant={"outlined"}
        >
            Edit recipe
        </Button>
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth={true}>
            <DialogTitle>
                Edit recipe
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <TextField
                        label={"Name"}
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <TextField
                        label={"Description"}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <TextField
                        label={"Preparation time"}
                        value={preparationTime ?? ""}
                        onChange={e => handleNumberType(setPreparationTime)(e.target.value)}
                    />
                    <TextField
                        label={"Cooking time"}
                        value={cookingTime ?? ""}
                        onChange={e => handleNumberType(setCookingTime)(e.target.value)}
                    />
                    <TextField
                        label={"Servings"}
                        value={servings}
                        onChange={e => handleNumberType(setServings)(e.target.value)}
                    />
                    <Divider>Ingredients</Divider>
                    <Stack spacing={2} direction={"row"}>
                        <TextField
                            label={"Quantity with unit"}
                            value={currentlyEditedIngredientQuantityWithUnit}
                            onChange={e => setCurrentlyEditedIngredientQuantityWithUnit(e.target.value)}
                            fullWidth={true}
                        />
                        <TextField
                            label={"Name"}
                            value={currentlyEditedIngredientName}
                            onChange={e => setCurrentlyEditedIngredientName(e.target.value)}
                            fullWidth={true}
                        />
                        <IconButton
                            onClick={() => {
                                if (currentlyEditedIngredientQuantityWithUnit === "" || currentlyEditedIngredientName === "")
                                    return;
                                setIngredients([
                                    ...ingredients,
                                    {
                                        quantityWithUnit: currentlyEditedIngredientQuantityWithUnit,
                                        name: currentlyEditedIngredientName
                                    }
                                ]);
                                setCurrentlyEditedIngredientQuantityWithUnit("");
                                setCurrentlyEditedIngredientName("");
                            }}
                        >
                            <AddIcon/>
                        </IconButton>
                    </Stack>
                    {
                        ingredients.map((ingredient, index) =>
                            <Typography sx={styles.typography}>{index}. {ingredient.quantityWithUnit} {ingredient.name}</Typography>
                        )
                    }
                    <Divider>Steps</Divider>
                    <Stack spacing={2} direction={"row"}>
                        <TextField
                            label={"Step"}
                            value={currentlyEditedStep}
                            onChange={e => setCurrentlyEditedStep(e.target.value)}
                            fullWidth={true}
                        />
                        <IconButton
                            onClick={() => {
                                if (currentlyEditedStep === "")
                                    return;
                                setSteps([
                                    ...steps,
                                    currentlyEditedStep
                                ]);
                                setCurrentlyEditedStep("");
                            }}
                        >
                            <AddIcon/>
                        </IconButton>
                    </Stack>
                    {
                        steps.map((step, index) => <Typography  sx={styles.typography}>{index}. {step}</Typography>)
                    }
                    <Divider>Tags</Divider>
                    <Stack spacing={2} direction={"row"}>
                        <TextField
                            label={"Tag"}
                            value={currentlyEditedTag}
                            onChange={e => setCurrentlyEditedTag(e.target.value)}
                            fullWidth={true}
                        />
                        <IconButton
                            onClick={() => {
                                if (currentlyEditedTag === "")
                                    return;
                                setTags([
                                    ...tags,
                                    currentlyEditedTag
                                ]);
                                setCurrentlyEditedTag("");
                            }}
                        >
                            <AddIcon/>
                        </IconButton>
                    </Stack>
                    <Typography sx={styles.typography}>{ tags.join(", ") }</Typography>
                    {
                        (error || mutationError) &&
                        <Alert severity={"error"}>{ error ?? mutationError?.errorMessage }</Alert>
                    }
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => setIsDialogOpen(false)}
                    variant={"outlined"}
                >
                    Cancel
                </Button>
                <Button
                    onClick={submit}
                    variant={"contained"}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    </>;
};

export default EditRecipe;
