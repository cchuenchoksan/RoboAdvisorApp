const questions = [
    // Personal Information (Risk Capacity)
    {
      id: "q1",
      category: "personal",
      question: "What is your current age in years?",
      options: [
        { label: "Under 25", value: 5 },
        { label: "25-40", value: 4 },
        { label: "40-50", value: 3 },
        { label: "50-65", value: 2 },
        { label: "Above 65", value: 1 },
      ],
    },
    {
      id: "q2",
      category: "personal",
      question: "What is your household's approximate annual gross income?",
      options: [
        { label: "Less than $25,000", value: 1 },
        { label: "$25,000 - $49,999", value: 2 },
        { label: "$50,000-$74,999", value: 3 },
        { label: "$75,000-$99,999", value: 4 },
        { label: "$100,000 or greater", value: 5 },
      ],
    },
    {
      id: "q3",
      category: "personal",
      question: "How many years of experience do you have in investing?",
      options: [
        { label: "Never", value: 1 },
        { label: "Less than 1 year", value: 2 },
        { label: "1-3 years", value: 3 },
        { label: "3-5 years", value: 4 },
        { label: "5 years or above", value: 5 },
      ],
    },
    {
      id: "q4",
      category: "personal",
      question: "How would you describe your current family financial responsibilities?",
      options: [
        { label: "Caring for elderly or multiple dependents", value: 1 },
        { label: "Married, with child under 18", value: 2 },
        { label: "Married but no child", value: 3 },
        { label: "Married, with child over 18", value: 4 },
        { label: "Single", value: 5 },
      ],
    },
  
    // Investment Knowledge
    {
      id: "q5",
      category: "knowledge",
      question: "I find investment matters easy to understand.",
      options: [
        { label: "Strongly Disagree", value: 1 },
        { label: "Disagree", value: 2 },
        { label: "Neutral", value: 3 },
        { label: "Agree", value: 4 },
        { label: "Strongly Agree", value: 5 },
      ],
    },
    {
      id: "q6",
      category: "knowledge",
      question: "Buying a single company's stock usually provides a safer return than a stock mutual fund.",
      options: [
        { label: "Strongly Disagree", value: 5 },
        { label: "Disagree", value: 4 },
        { label: "Neutral", value: 3 },
        { label: "Agree", value: 2 },
        { label: "Strongly Agree", value: 1 },
      ],
    },
    {
      id: "q7",
      category: "knowledge",
      question: "With 2% annual interest compounded, $100 grows to around $110 in 5 years.",
      options: [
        { label: "Strongly Disagree", value: 1 },
        { label: "Disagree", value: 2 },
        { label: "Neutral", value: 3 },
        { label: "Agree", value: 4 },
        { label: "Strongly Agree", value: 5 },
      ],
    },
    {
      id: "q8",
      category: "knowledge",
      question: "If inflation is 2% and interest is 1%, your money buys less in a year.",
      options: [
        { label: "Strongly Disagree", value: 1 },
        { label: "Disagree", value: 2 },
        { label: "Neutral", value: 3 },
        { label: "Agree", value: 4 },
        { label: "Strongly Agree", value: 5 },
      ],
    },
  
    // Investment Appetite
    {
      id: "q9",
      category: "appetite",
      question: "How soon might you need to access a significant portion of your investments?",
      options: [
        { label: "Within 6 months", value: 1 },
        { label: "Within 1 – 3 years", value: 2 },
        { label: "Within 3 – 5 years", value: 3 },
        { label: "More than 5 years", value: 4 },
        { label: "At least 10 years", value: 5 },
      ],
    },
    {
      id: "q10",
      category: "appetite",
      question: "What is your favorite portfolio?",
      options: [
        { label: "40% cash, 20% gold, 30% bond, 10% stock", value: 1 },
        { label: "30% cash, 20% gold, 30% bond, 20% stock", value: 2 },
        { label: "30% cash, 20% gold, 25% bond, 25% stock", value: 3 },
        { label: "20% cash, 20% gold, 30% bond, 30% stock", value: 4 },
        { label: "30% cash, 10% gold, 20% bond, 40% stock", value: 5 },
      ],
    },
    {
      id: "q11",
      category: "appetite",
      question: "Protecting my portfolio is more important than high returns.",
      options: [
        { label: "Strongly Disagree", value: 5 },
        { label: "Disagree", value: 4 },
        { label: "Neutral", value: 3 },
        { label: "Agree", value: 2 },
        { label: "Strongly Agree", value: 1 },
      ],
    },
    {
      id: "q12",
      category: "appetite",
      question: "Who is responsible for investment allocation decisions in your household?",
      options: [
        { label: "A professional advisor", value: 1 },
        { label: "Someone else in household", value: 2 },
        { label: "Shared equally", value: 3 },
        { label: "I decide, with input", value: 4 },
        { label: "I decide independently", value: 5 },
      ],
    },
  
    // Profit-Loss Tolerance
    {
      id: "q13",
      category: "tolerance",
      question: "I tend to be anxious about my investment decisions.",
      options: [
        { label: "Strongly Disagree", value: 5 },
        { label: "Disagree", value: 4 },
        { label: "Neutral", value: 3 },
        { label: "Agree", value: 2 },
        { label: "Strongly Agree", value: 1 },
      ],
    },
    {
      id: "q14",
      category: "tolerance",
      question: "What is the highest percentage gain you'd lock in profits?",
      options: [
        { label: "5%", value: 1 },
        { label: "5% - 10%", value: 2 },
        { label: "10% - 20%", value: 3 },
        { label: "20% - 30%", value: 4 },
        { label: "30% or above", value: 5 },
      ],
    },
    {
      id: "q15",
      category: "tolerance",
      question: "If your stock is in a downtrend, what do you do?",
      options: [
        { label: "Sell all", value: 1 },
        { label: "Sell a portion", value: 2 },
        { label: "Hold and wait", value: 3 },
        { label: "Buy more after a few days", value: 4 },
        { label: "Buy more immediately", value: 5 },
      ],
    },
    {
      id: "q16",
      category: "tolerance",
      question: "It takes me a long time to make up my mind on investment matters.",
      options: [
        { label: "Strongly Disagree", value: 1 },
        { label: "Disagree", value: 2 },
        { label: "Neutral", value: 3 },
        { label: "Agree", value: 4 },
        { label: "Strongly Agree", value: 5 },
      ],
    },
  
    // Psycho Test
    {
      id: "q17",
      category: "psycho",
      question: "TV game show: which prize option would you choose?",
      options: [
        { label: "$1,000 in cash", value: 1 },
        { label: "80% chance at $3,000", value: 2 },
        { label: "50% chance at $7,000", value: 3 },
        { label: "25% chance at $18,000", value: 4 },
        { label: "10% chance at $50,000", value: 5 },
      ],
    },
    {
      id: "q18",
      category: "psycho",
      question: "You lose your job before a planned vacation. What do you do?",
      options: [
        { label: "Cancel the vacation", value: 1 },
        { label: "Take a modest vacation", value: 2 },
        { label: "Go as scheduled", value: 3 },
        { label: "Extend slightly", value: 4 },
        { label: "Go and extend extravagantly", value: 5 },
      ],
    },
    {
      id: "q19",
      category: "psycho",
      question: "You receive $20,000 unexpectedly. What do you do?",
      options: [
        { label: "Deposit in bank", value: 1 },
        { label: "Use a professional", value: 2 },
        { label: "Invest in bonds", value: 3 },
        { label: "Split into stocks & bonds", value: 4 },
        { label: "Invest all in stock market", value: 5 },
      ],
    },
    {
      id: "q20",
      category: "psycho",
      question: "If your broker says your investment is risky, what comes to mind?",
      options: [
        { label: "Loss", value: 1 },
        { label: "Uncertainty", value: 2 },
        { label: "Opportunity", value: 3 },
        { label: "Challenge", value: 4 },
        { label: "Thrill", value: 5 },
      ],
    },
  ];
  
  export default questions;