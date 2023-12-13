import React from "react";
import { Grid, Container, Button, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FlashCard } from "../../../types/card.interface";
import { AxiosError } from "axios";

interface EditCardProps {
  cardData: FlashCard | null;
  setAnchor: React.Dispatch<React.SetStateAction<boolean>>;
  updateFlashCard: (updatedData: FlashCard) => void;
  onEditComplete: (updatedData: FlashCard) => void;
}

const EditCard: React.FC<EditCardProps> = ({
  cardData,
  setAnchor,
  updateFlashCard,
  onEditComplete,
}) => {
  const [difficulty, setDifficulty] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [errorFields, setErrorFields] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Set initial values when cardData changes
    if (cardData) {
      setDifficulty(cardData.difficulty_level);
      setQuestion(cardData.question);
      setAnswer(cardData.answer);
      setCategory(cardData.category);
    }
  }, [cardData]);

  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setDifficulty(event.target.value as string);
  };

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };

  const handleEditClick = async () => {
    const errors: string[] = [];
    if (!question) errors.push("Question");
    if (!answer) errors.push("Answer");
    if (!category) errors.push("Category");
    if (!difficulty) errors.push("Difficulty");

    setErrorFields(errors);

    if (errors.length > 0) return;

    const updatedData = {
      id: cardData?.id || -1, // Ensure you have a valid ID
      question,
      answer,
      category,
      difficulty_level: difficulty,
    };

    try {
      await updateFlashCard(updatedData);

      // Close the edit popup
      setAnchor(false);

      // Optionally, you can clear the form fields here
      setQuestion("");
      setAnswer("");
      setCategory("");
      setDifficulty("");

      onEditComplete(updatedData);
    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error("Error updating flashcard:", (error as AxiosError).message);
    }
  };

  const isErrorField = (field: string) => errorFields.includes(field);

  return (
    <Container component="main" maxWidth="sm">
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          style={{ marginBottom: "1.5rem" }}
        >
          Edit Card
        </Typography>
        <form noValidate style={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="Question"
                label="Question"
                name="Question"
                autoComplete="off"
                multiline
                rows={4}
                variant="outlined"
                value={question}
                onChange={handleQuestionChange}
                error={isErrorField("Question")}
                helperText={
                  isErrorField("Question") ? "Please enter a question" : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="Answer"
                label="Answer"
                type="Answer"
                id="Answer"
                autoComplete="off"
                multiline
                rows={4}
                variant="outlined"
                value={answer}
                onChange={handleAnswerChange}
                error={isErrorField("Answer")}
                helperText={
                  isErrorField("Answer") ? "Please enter an answer" : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Difficulty Level
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={difficulty}
                  label="Difficulty Level"
                  onChange={handleDifficultyChange}
                  variant="outlined"
                  error={isErrorField("Difficulty")}
                >
                  <MenuItem value={"Easy"}>Easy</MenuItem>
                  <MenuItem value={"Medium"}>Medium</MenuItem>
                  <MenuItem value={"Hard"}>Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="Category"
                label="Category"
                name="Category"
                autoComplete="Category"
                variant="outlined"
                value={category}
                onChange={handleCategoryChange}
                error={isErrorField("Category")}
                helperText={
                  isErrorField("Category") ? "Please enter a category" : ""
                }
              />
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            style={{ marginTop: "2rem" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditClick}
            >
              Edit Card
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => {
                setAnchor(false);
              }}
            >
              Cancel
            </Button>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default EditCard;