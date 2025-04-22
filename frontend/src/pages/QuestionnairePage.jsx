import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import questions from "../assets/questions";

// Color palette
const colorPalette = {
  prussianBlue: '#212D40',
  charcoal: '#364156',
  platinum: '#DBDBDB',
  jasper: '#D66853',
  roseTaupe: '#7D4E57'
};

function Questionnaire() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const unanswered = questions.filter((q) => !formData[q.id]);

    if (unanswered.length > 0) {
      alert("Please answer all questions before submitting.");
      return;
    }

    // Sum the values from the selected options
    const total = Object.values(formData).reduce((sum, value) => {
      // Parse value to number if it's a number string
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        return sum + numericValue;
      }
      return sum;
    }, 0);
    console.log(total);

    navigate("/OptimisePortPage", {
      state: { questionnaireData: total },
    });
  };

  // Calculate progress percentage
  const progress = (Object.keys(formData).length / questions.length) * 100;
  
  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Check if current question is answered
  const isCurrentQuestionAnswered = formData[currentQuestion.id] !== undefined;
  
  // Calculate question number for display (1-based index)
  const questionNumber = currentQuestionIndex + 1;
  
  // Check if it's the last question
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <Box sx={{ p: 3, backgroundColor: "#fafafa", minHeight: "90vh" }}>
      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: "#fff",
          maxWidth: 800,
          mx: "auto",
          border: `1px solid ${colorPalette.platinum}`,
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{ 
            color: colorPalette.prussianBlue,
            fontWeight: 600,
            mb: 3,
            textAlign: "center"
          }}
        >
          Investment Preferences Questionnaire
        </Typography>
        
        {/* Progress bar with label */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography 
              variant="body2"
              sx={{ 
                color: colorPalette.charcoal,
                fontWeight: 500
              }}
            >
              Question {questionNumber} of {questions.length}
            </Typography>
            <Typography 
              variant="body2"
              sx={{ 
                color: colorPalette.charcoal,
                fontWeight: 500
              }}
            >
              {Math.round(progress)}% Complete
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              backgroundColor: colorPalette.platinum,
              "& .MuiLinearProgress-bar": {
                backgroundColor: colorPalette.jasper,
              }
            }} 
          />
        </Box>

        {/* Current question */}
        <FormControl
          component="fieldset"
          fullWidth
          sx={{ mb: 4 }}
        >
          <FormLabel
            component="legend"
            sx={{
              color: colorPalette.prussianBlue,
              fontWeight: 600,
              fontSize: "1.1rem",
              mb: 2,
              "&.Mui-focused": {
                color: colorPalette.prussianBlue,
              },
            }}
          >
            {questionNumber}. {currentQuestion.question}
          </FormLabel>
          <RadioGroup
            name={currentQuestion.id}
            value={formData[currentQuestion.id] || ""}
            onChange={handleChange}
          >
            {currentQuestion.options.map((opt, i) => (
              <FormControlLabel
                key={i}
                value={opt.value}
                control={
                  <Radio
                    sx={{
                      color: colorPalette.charcoal,
                      "&.Mui-checked": {
                        color: colorPalette.jasper,
                      },
                    }}
                  />
                }
                label={
                  <Typography 
                    sx={{ 
                      color: colorPalette.charcoal,
                      fontWeight: formData[currentQuestion.id] === opt.value ? 500 : 400
                    }}
                  >
                    {opt.label}
                  </Typography>
                }
                sx={{
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(219, 219, 219, 0.1)'
                  }
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {/* Navigation buttons */}
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="outlined"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            sx={{
              color: colorPalette.prussianBlue,
              borderColor: colorPalette.prussianBlue,
              "&:hover": { 
                borderColor: colorPalette.charcoal,
                backgroundColor: "rgba(33, 45, 64, 0.04)"
              },
              "&.Mui-disabled": {
                borderColor: "rgba(33, 45, 64, 0.3)",
                color: "rgba(33, 45, 64, 0.3)"
              },
              textTransform: "none",
              fontWeight: 500
            }}
          >
            Previous
          </Button>
          
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            {isLastQuestion ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: colorPalette.jasper,
                  "&:hover": { backgroundColor: colorPalette.roseTaupe },
                  px: 4,
                  py: 1,
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "6px",
                }}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!isCurrentQuestionAnswered}
                sx={{
                  backgroundColor: colorPalette.jasper,
                  "&:hover": { backgroundColor: colorPalette.roseTaupe },
                  "&.Mui-disabled": {
                    backgroundColor: "rgba(214, 104, 83, 0.3)",
                  },
                  px: 4,
                  py: 1,
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "6px",
                }}
              >
                Next
              </Button>
            )}
          </Box>
          
          {!isLastQuestion && (
            <Button
              variant="text"
              onClick={handleSubmit}
              sx={{
                color: colorPalette.charcoal,
                "&:hover": { 
                  color: colorPalette.jasper,
                  backgroundColor: "rgba(214, 104, 83, 0.04)"
                },
                textTransform: "none",
                fontWeight: 500
              }}
            >
              Skip to Submit
            </Button>
          )}
          {isLastQuestion && (
            <Button
              variant="text"
              onClick={() => setCurrentQuestionIndex(0)}
              sx={{
                color: colorPalette.charcoal,
                "&:hover": { 
                  color: colorPalette.jasper,
                  backgroundColor: "rgba(214, 104, 83, 0.04)"
                },
                textTransform: "none",
                fontWeight: 500
              }}
            >
              Review All
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}

export default Questionnaire;