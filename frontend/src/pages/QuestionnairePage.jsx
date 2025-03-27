import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";

function Questionnaire() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // calculated by riskTolerance_score, depend on what we want to show
    utilityScore: "",
    riskTolerance_score: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // after submit questionnaire, return to optPortfolio page with score
    navigate("/OptimisePortPage", {
      state: { questionnaireData: formData },
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          p: 2,
          border: "1px solid grey",
          borderRadius: 1,
          backgroundColor: "#f5f5f5",
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Investment Preferences Questionnaire(leave paopao to update ❛‿˂̵✧)
        </Typography>

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="What is your investment goal?"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="What is your risk tolerance? (Low/Medium/High)"
              name="riskTolerance"
              value={formData.riskTolerance}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Investment horizon (years)"
              name="horizon"
              value={formData.horizon}
              onChange={handleChange}
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </FormControl>

          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default Questionnaire;