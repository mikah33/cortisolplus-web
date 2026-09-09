import Quiz from './Quiz';

interface Question {
  id: string;
  prompt: string;
  options: { label: string; weight: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'sleep',
    prompt: 'How many hours do you typically sleep?',
    options: [
      { label: '8+ hours', weight: 0 },
      { label: '7–8 hours', weight: 1 },
      { label: '6–7 hours', weight: 2 },
      { label: 'Under 6 hours', weight: 3 },
    ],
  },
  {
    id: 'wake',
    prompt: 'Do you wake feeling rested?',
    options: [
      { label: 'Usually', weight: 0 },
      { label: 'Sometimes', weight: 1 },
      { label: 'Rarely', weight: 2 },
      { label: 'Never', weight: 3 },
    ],
  },
  {
    id: 'stress',
    prompt: 'How would you describe your stress level day-to-day?',
    options: [
      { label: 'Low', weight: 0 },
      { label: 'Moderate', weight: 1 },
      { label: 'High', weight: 2 },
      { label: 'Constant', weight: 3 },
    ],
  },
  {
    id: 'belly',
    prompt: 'Have you noticed weight gain around your midsection?',
    options: [
      { label: 'No', weight: 0 },
      { label: 'Slightly', weight: 1 },
      { label: 'Yes, noticeably', weight: 2 },
      { label: 'Yes, rapidly', weight: 3 },
    ],
  },
  {
    id: 'caffeine',
    prompt: 'How much caffeine do you drink per day?',
    options: [
      { label: 'None', weight: 0 },
      { label: '1 cup', weight: 1 },
      { label: '2–3 cups', weight: 2 },
      { label: '4+ cups', weight: 3 },
    ],
  },
  {
    id: 'cravings',
    prompt: 'Do you crave sugary or salty foods?',
    options: [
      { label: 'Rarely', weight: 0 },
      { label: 'Sometimes', weight: 1 },
      { label: 'Often', weight: 2 },
      { label: 'Constantly', weight: 3 },
    ],
  },
  {
    id: 'mood',
    prompt: 'Mood: anxious, irritable, or wired-but-tired?',
    options: [
      { label: 'Rarely', weight: 0 },
      { label: 'Sometimes', weight: 1 },
      { label: 'Most days', weight: 2 },
      { label: 'All the time', weight: 3 },
    ],
  },
  {
    id: 'exercise',
    prompt: 'Do you exercise intensely (>5 days/week)?',
    options: [
      { label: 'No, I rest enough', weight: 0 },
      { label: 'Moderate, with recovery', weight: 0 },
      { label: 'Yes, daily hard sessions', weight: 2 },
      { label: 'Yes, often overtrained', weight: 3 },
    ],
  },
];

export default function CortisolCalculator() {
  return <Quiz questions={QUESTIONS} bands={[]} />;
}
