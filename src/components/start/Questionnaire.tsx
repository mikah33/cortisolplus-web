// NewQuestionnaireView (5.9): age, gender, height, weight, sleep, exercise —
// one typed question per screen, wheels for the numbers.

import { useState } from 'react';
import { BlockButton, Col, Glass, Icon, TypedLine, Txt, Wheel, sleep, typeInto, useRunner, useScript, BackButton } from './ui';

export interface Profile {
  age: number;
  gender: string;
  feet: number;
  inches: number;
  weight: number;
  sleep: string;
  exercise: string;
}

export const QUESTIONS = [
  { id: 'age_range', question: 'How old are you?' },
  { id: 'gender', question: "What's your gender?", options: ['Male', 'Female', 'Prefer not to say'] },
  { id: 'height_range', question: "What's your height?" },
  { id: 'weight_range', question: "What's your weight range?" },
  { id: 'sleep_hours', question: 'How many hours do you typically sleep?', options: ['Less than 6', '6-7 hours', '7-8 hours', '8+ hours'] },
  { id: 'exercise_frequency', question: 'How often do you exercise?', options: ['Rarely', '1-2x / week', '3-4x / week', 'Daily'] },
] as const;

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const AGES = range(13, 100);
const FEET = range(4, 7);
const INCHES = range(0, 11);
const WEIGHTS = range(80, 400);

export default function Questionnaire({ start, profile, update, onQuestion, onBack, onDone }: {
  start: number;
  profile: Profile;
  update: (patch: Partial<Profile>) => void;
  onQuestion: (index: number) => void;
  onBack: () => void;
  onDone: () => void;
}) {
  const run = useRunner();
  const [q, setQ] = useState(Math.min(Math.max(start, 0), QUESTIONS.length - 1));
  const [typed, setTyped] = useState('');
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [age, setAge] = useState(profile.age);
  const [feet, setFeet] = useState(profile.feet);
  const [inches, setInches] = useState(profile.inches);
  const [weight, setWeight] = useState(profile.weight);

  const question = QUESTIONS[q];
  const isPicker = !('options' in question);

  useScript(async (signal) => {
    onQuestion(q);
    setReady(false);
    setTyped('');
    setSelected(null);
    await sleep(250, signal);
    await typeInto(setTyped, question.question, signal);
    setReady(true);
  }, [q]);

  const advance = () => {
    if (q < QUESTIONS.length - 1) setQ(q + 1);
    else onDone();
  };

  const back = () => {
    if (q > 0) setQ(q - 1);
    else onBack();
  };

  const savePicker = () => {
    if (question.id === 'age_range') update({ age });
    else if (question.id === 'height_range') update({ feet, inches });
    else update({ weight });
  };

  const pick = (opt: string) => {
    if (!ready || selected) return;
    setSelected(opt);
    if (question.id === 'gender') update({ gender: opt });
    if (question.id === 'sleep_hours') update({ sleep: opt });
    if (question.id === 'exercise_frequency') update({ exercise: opt });
    run(async (signal) => {
      await sleep(320, signal);
      advance();
    });
  };

  return (
    <Col className="ob-flex">
      {/* Top bar: back + progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '50px 20px 0' }}>
        <BackButton onClick={back} style={{ position: 'static', flex: 'none' }} />
        <div style={{ display: 'flex', gap: 5, flex: 1 }} aria-label={`Question ${q + 1} of ${QUESTIONS.length}`}>
          {QUESTIONS.map((x, i) => (
            <span key={x.id} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= q ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.12)', transition: 'background-color 350ms' }} />
          ))}
        </div>
      </div>

      <div style={{ height: 44, flex: 'none' }} />

      <div style={{ minHeight: 70, padding: '0 28px', display: 'flex', alignItems: 'center' }}>
        <TypedLine full={question.question} shown={typed} size={25} style={{ width: '100%' }} />
      </div>

      <div style={{ height: 22, flex: 'none' }} />

      {isPicker ? (
        <>
          <div key={question.id} style={{ display: 'flex', height: 170, padding: '0 24px' }}>
            {question.id === 'age_range' && (
              <Wheel values={AGES} value={age} onChange={setAge} format={(v) => String(v)} label="Age" />
            )}
            {question.id === 'height_range' && (
              <>
                <Wheel values={FEET} value={feet} onChange={setFeet} format={(v) => `${v} ft`} label="Height, feet" />
                <Wheel values={INCHES} value={inches} onChange={setInches} format={(v) => `${v} in`} label="Height, inches" />
              </>
            )}
            {question.id === 'weight_range' && (
              <Wheel values={WEIGHTS} value={weight} onChange={setWeight} format={(v) => `${v} lbs`} label="Weight in pounds" />
            )}
          </div>
          <div style={{ padding: '16px 24px 0' }}>
            <BlockButton height={54} ready={ready} onClick={() => { savePicker(); advance(); }}>Continue</BlockButton>
          </div>
        </>
      ) : (
        <div className="ob-flex" role="radiogroup" style={{ gap: 10, padding: '0 24px', opacity: ready ? 1 : 0.5, transition: 'opacity 250ms ease-in-out' }}>
          {question.options.map((opt) => {
            const on = selected === opt;
            return (
              <Glass
                as="button"
                key={opt}
                radius={14}
                on={on}
                className="ob-option"
                role="radio"
                aria-checked={on}
                disabled={!ready}
                onClick={() => pick(opt)}
                style={{ gap: 12, padding: '15px 18px' }}
              >
                <Txt className="ob-t" style={{ flex: 1, fontSize: 17, fontWeight: 600, color: on ? '#fff' : '#000', marginRight: 12 }}>{opt}</Txt>
                {on
                  ? <Icon.checkCircle size={24} color="#fff" />
                  : <Icon.circle size={24} color="rgba(0,0,0,0.22)" />}
              </Glass>
            );
          })}
        </div>
      )}
    </Col>
  );
}
