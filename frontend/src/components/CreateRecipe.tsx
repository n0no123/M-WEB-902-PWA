import useCreateRecipe, {IngredientDto} from "../api/recipe/useCreateRecipe";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {useCallback, useEffect, useState} from "react";
import AskForCameraPermission from "./AskForCameraPermission";

type Props = {
    isMobile: boolean
};

const CreateRecipe = ({ isMobile }: Props) => {
    const { mutate, isLoading, isSuccess, error: mutationError } = useCreateRecipe();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentlyEditedStep, setCurrentlyEditedStep] = useState<string>("");
    const [currentlyEditedIngredientQuantityWithUnit, setCurrentlyEditedIngredientQuantityWithUnit] = useState<string>("");
    const [currentlyEditedIngredientName, setCurrentlyEditedIngredientName] = useState<string>("");
    const [currentlyEditedTag, setCurrentlyEditedTag] = useState<string>("");
    const [error, setError] = useState<string | undefined>(undefined);

    //recipe
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [preparationTime, setPreparationTime] = useState<number | undefined>();
    const [cookingTime, setCookingTime] = useState<number | undefined>();
    const [servings, setServings] = useState<number | undefined>();
    const [steps, setSteps] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<IngredientDto[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [image, setImage] = useState<File | undefined>(undefined);

    const submit = useCallback(
        () => {
            if (!name)
                setError("Name is required");
            else if (!description)
                setError("Description is required");
            if (preparationTime === undefined)
                setError("Preparation time is required");
            else if (cookingTime === undefined)
                setError("Cooking time is required");
            else if (!servings)
                setError("Servings is required");
            else if (ingredients.length === 0)
                setError("Ingredients is required");
            else if (steps.length === 0)
                setError("Steps is required");
            else {
                mutate({
                    name,
                    description,
                    preparationTimeInMinutes: preparationTime,
                    cookingTimeInMinutes: cookingTime,
                    servings,
                    steps,
                    ingredients,
                    tags,
                    image
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
            setError,
            image
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
        <AskForCameraPermission />
        <Dialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
        >
            <DialogTitle>Create Recipe</DialogTitle>
            <DialogContent
                dividers
                sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: "1em"
                }}
            >
                <TextField
                    fullWidth
                    required
                    label={"Name"}
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <TextField
                    fullWidth
                    required
                    label={"Description"}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <TextField
                    fullWidth
                    required
                    label={"Preparation Time"}
                    value={preparationTime ?? ""}
                    onChange={e => handleNumberType(setPreparationTime)(e.target.value)}
                    InputProps={{
                        endAdornment: "min"
                    }}
                />
                <TextField
                    fullWidth
                    required
                    label={"Cooking Time"}
                    value={cookingTime ?? ""}
                    onChange={e => handleNumberType(setCookingTime)(e.target.value)}
                    InputProps={{
                        endAdornment: "min"
                    }}
                />
                <TextField
                    fullWidth
                    required
                    label={"Servings"}
                    value={servings ?? ""}
                    onChange={e => handleNumberType(setServings)(e.target.value)}
                    InputProps={{
                        endAdornment: "servings"
                    }}
                />
                <Divider>Steps</Divider>
                <TextField
                    fullWidth
                    label={"Step"}
                    value={currentlyEditedStep}
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            setSteps([...steps, currentlyEditedStep]);
                            setCurrentlyEditedStep("");
                        }
                    }}
                    onChange={e => setCurrentlyEditedStep(e.target.value)}
                />
                {
                    steps.map((step, index) =>
                        <Stack
                            key={index}
                        >
                            <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                            >
                                <Typography
                                    sx={{
                                        maxWidth: "90%",
                                        wordBreak: "break-all"
                                    }}
                                >
                                    {index}. {step}
                                </Typography>
                                <IconButton
                                    onClick={() => setSteps(steps.filter((_, i) => i !== index))}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                            <Divider />
                        </Stack>
                    )
                }
                <Divider>Ingredients</Divider>
                <Stack
                    direction={"row"}
                    gap={"1em"}
                >
                    <TextField
                        fullWidth
                        label={"Quantity with unit"}
                        value={currentlyEditedIngredientQuantityWithUnit}
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                setIngredients([...ingredients, {
                                    quantityWithUnit: currentlyEditedIngredientQuantityWithUnit,
                                    name: currentlyEditedIngredientName
                                }]);
                                setCurrentlyEditedIngredientQuantityWithUnit("");
                                setCurrentlyEditedIngredientName("");
                            }
                        }}
                        onChange={e => setCurrentlyEditedIngredientQuantityWithUnit(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label={"Name"}
                        value={currentlyEditedIngredientName}
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                setIngredients([...ingredients, {
                                    quantityWithUnit: currentlyEditedIngredientQuantityWithUnit,
                                    name: currentlyEditedIngredientName
                                }]);
                                setCurrentlyEditedIngredientQuantityWithUnit("");
                                setCurrentlyEditedIngredientName("");
                            }
                        }}
                        onChange={e => setCurrentlyEditedIngredientName(e.target.value)}
                    />
                    <IconButton
                        onClick={() => {
                            setIngredients([...ingredients, {
                                quantityWithUnit: currentlyEditedIngredientQuantityWithUnit,
                                name: currentlyEditedIngredientName
                            }]);
                            setCurrentlyEditedIngredientQuantityWithUnit("");
                            setCurrentlyEditedIngredientName("");
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Stack>
                {
                    ingredients.map((ingredient, index) =>
                        <Stack
                            key={index}
                        >
                            <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                            >
                                <Typography
                                    sx={{
                                        maxWidth: "90%",
                                        wordBreak: "break-all"
                                    }}
                                >
                                    {ingredient.quantityWithUnit} {ingredient.name}
                                </Typography>
                                <IconButton
                                    onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                            <Divider />
                        </Stack>
                    )
                }
                <Divider>Tags</Divider>
                <TextField
                    fullWidth
                    label={"Tag"}
                    value={currentlyEditedTag}
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            setTags([...tags, currentlyEditedTag]);
                            setCurrentlyEditedTag("");
                        }
                    }}
                    onChange={e => setCurrentlyEditedTag(e.target.value)}
                />
                <Typography>
                    {tags.join(", ")}
                </Typography>
                <Divider>Picture</Divider>
                <TextField
                    fullWidth
                    type={"file"}
                    onChange={(e: any) => setImage(e.target.files?.[0])}
                />
                {(error || mutationError) && <Alert severity={"error"}>{error}{mutationError?.errorMessage}</Alert>}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isLoading}
                    variant={"outlined"}
                >
                    Cancel
                </Button>
                <Button
                    onClick={submit}
                    disabled={isLoading}
                    variant={"contained"}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
        {
            isMobile ?
                <IconButton color="inherit" onClick={() => setIsDialogOpen(true)}>
                    <AddCircleOutlineIcon />
                </IconButton>
                :
                <Button
                    color="inherit"
                    endIcon={<AddIcon />}
                    onClick={() => setIsDialogOpen(true)}
                >
                    Add Recipe
                </Button>
        }
    </>;
}

export default CreateRecipe;
