export type QuestionType = "text" | "radio";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // For radio type questions
  placeholder?: string; // For text type questions
  affirmation?: string; // Optional micro-affirmation after answering
}

export const diagnosticQuestions: Question[] = [
  {
    id: "q1",
    text: "What is the single biggest challenge your company is currently facing?",
    type: "text",
    placeholder: "e.g., Market saturation, funding, team morale...",
    affirmation: "Got it — thank you for sharing that insight.",
  },
  {
    id: "q2",
    text: "How confident are you in your current product-market fit?",
    type: "radio",
    options: ["Very Confident", "Moderately Confident", "Slightly Confident", "Not Confident"],
    affirmation: "Understood. Confidence is key!",
  },
  {
    id: "q3",
    text: "Describe your primary customer acquisition channel.",
    type: "text",
    placeholder: "e.g., Organic search, paid ads, referrals...",
    affirmation: "Excellent. Knowing your channels is crucial.",
  },
  {
    id: "q4",
    text: "On a scale of 1-5, how aligned is your team with the company's long-term vision?",
    type: "radio",
    options: ["1 - Not Aligned", "2 - Somewhat Aligned", "3 - Moderately Aligned", "4 - Well Aligned", "5 - Perfectly Aligned"],
    affirmation: "Team alignment is so important!",
  },
  {
    id: "q5",
    text: "What is your biggest operational bottleneck right now?",
    type: "text",
    placeholder: "e.g., Slow development, inefficient sales process, customer support...",
    affirmation: "Thanks for pinpointing that.",
  },
  {
    id: "q6",
    text: "How effectively do you delegate tasks to your team?",
    type: "radio",
    options: ["Very Effectively", "Moderately Effectively", "Sometimes Effectively", "Not Effectively At All"],
    affirmation: "Delegation can be tricky, but powerful.",
  },
  {
    id: "q7",
    text: "What's one thing you wish you had more clarity on regarding your business?",
    type: "text",
    placeholder: "e.g., Next growth strategy, market trends, competitor moves...",
    affirmation: "That's a common founder thought!",
  },
  {
    id: "q8",
    text: "How often do you review your company's key performance indicators (KPIs)?",
    type: "radio",
    options: ["Daily", "Weekly", "Monthly", "Quarterly", "Rarely"],
    affirmation: "Keeping an eye on the numbers is smart.",
  },
  {
    id: "q9",
    text: "What's your current biggest personal challenge as a founder?",
    type: "text",
    placeholder: "e.g., Work-life balance, decision fatigue, imposter syndrome...",
    affirmation: "It's okay to admit the personal struggles.",
  },
  {
    id: "q10",
    text: "How would you describe your company culture in three words?",
    type: "text",
    placeholder: "e.g., Innovative, collaborative, fast-paced...",
    affirmation: "Culture is everything!",
  },
  {
    id: "q11",
    text: "Do you have a clear, documented 12-month strategic plan?",
    type: "radio",
    options: ["Yes, it's very clear", "Yes, but it needs refinement", "Partially, it's in my head", "No, not yet"],
    affirmation: "Planning ahead is a superpower.",
  },
  {
    id: "q12",
    text: "What's one thing you're most excited about for your company's future?",
    type: "text",
    placeholder: "e.g., New product launch, market expansion, team growth...",
    affirmation: "Love that enthusiasm! Almost done!",
  },
];