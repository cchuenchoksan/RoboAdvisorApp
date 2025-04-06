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
import questions from "../assets/questions";

function Questionnaire() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    // navigate("/OptimisePortPage", {
    //   state: { questionnaireData: formData },
    // });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          p: 2,
          border: "1px solid grey",
          borderRadius: 1,
          backgroundColor: "#f5f5f5",
          maxWidth: 800,
          mx: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Investment Preferences Questionnaire (20 Questions)
        </Typography>

        <form onSubmit={handleSubmit}>
          {questions.map((q, index) => (
            <FormControl
              component="fieldset"
              key={q.id}
              fullWidth
              sx={{ mb: 3 }}
            >
              <FormLabel
                component="legend"
                sx={{
                  color: "#000000", // Color of unchecked radio button
                  "&.Mui-focused": {
                    color: "#000000", // Color of checked radio button
                  },
                }}
              >
                {index + 1}. {q.question}
              </FormLabel>
              <RadioGroup
                name={q.id}
                value={formData[q.id] || ""}
                onChange={handleChange}
              >
                {q.options.map((opt, i) => (
                  <FormControlLabel
                    key={i}
                    value={opt.value}
                    control={
                      <Radio
                        sx={{
                          color: "#FF5733", // Color of unchecked radio button
                          "&.Mui-checked": {
                            color: "#FF3D00", // Color of checked radio button
                          },
                        }}
                      />
                    }
                    label={opt.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ))}

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#FF5733",
              "&:hover": { backgroundColor: "#FF3D00" },
            }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default Questionnaire;
