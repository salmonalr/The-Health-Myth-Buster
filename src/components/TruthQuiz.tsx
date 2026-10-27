import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { QuizQuestion } from '../types/myth';
import { CheckCircle2, XCircle, RotateCcw, Award, ChevronRight, BookOpen, Flame, Sliders } from 'lucide-react';

export const TruthQuiz: React.FC = () => {
  const [quizLength, setQuizLength] = useState<number>(10);
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    return [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 10);
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [answersHistory, setAnswersHistory] = useState<
    { question: QuizQuestion; userAnswer: boolean; isCorrect: boolean }[]
  >([]);

  const currentQ = questions[currentIndex] || questions[0];

  const resetQuizWithLength = (len: number) => {
    setQuizLength(len);
    setQuestions([...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, len));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setIsFinished(false);
    setAnswersHistory([]);
  };

  const handleSelect = (userChoice: boolean) => {
    if (hasAnswered) return;

    const isCorrect = userChoice === currentQ.isFact;
    setSelectedAnswer(userChoice);
    setHasAnswered(true);

    if (isCorrect) {
      setScore((s) => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      setStreak(0);
    }

    setAnswersHistory((prev) => [
      ...prev,
      { question: currentQ, userAnswer: userChoice, isCorrect },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto rounded-xl border border-slate-800 bg-[#0E131F] p-6 md:p-8 space-y-6 shadow-2xl text-center animate-in fade-in duration-200">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400">
          <Award className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Health Literacy Assessment Complete
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {percentage >= 80
              ? 'Distinguished Medical Skeptic'
              : percentage >= 50
              ? 'Informed Health Explorer'
              : 'Susceptible to Wellness Folklore'}
          </h2>
          <p className="text-slate-400 text-sm">
            You accurately adjudicated{' '}
            <span className="font-mono font-bold text-teal-400">{score}</span> out of{' '}
            <span className="font-mono font-bold text-white">{questions.length}</span> viral health claims.
          </p>
        </div>

        {/* Score & Streak Stats */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-4">
            <span className="text-xs font-mono text-slate-500 uppercase block">Accuracy</span>
            <span className="text-2xl font-mono font-bold text-white tabular-nums">{percentage}%</span>
          </div>
          <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-4">
            <span className="text-xs font-mono text-slate-500 uppercase block">Max Streak</span>
            <span className="text-2xl font-mono font-bold text-teal-400 tabular-nums">{maxStreak} 🔥</span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="text-left space-y-3 pt-4 border-t border-slate-800">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Question Review:
          </span>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {answersHistory.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 text-xs space-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-slate-200">
                    {idx + 1}. {item.question.statement}
                  </span>
                  {item.isCorrect ? (
                    <span className="inline-flex items-center gap-1 font-mono text-emerald-400 shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-mono text-rose-400 shrink-0">
                      <XCircle className="h-3.5 w-3.5" /> Incorrect
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {item.question.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => resetQuizWithLength(quizLength)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-6 py-2.5 text-xs font-semibold text-slate-950 hover:bg-teal-400 transition-colors shadow-sm"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retake With New Claims</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top status bar & Quiz Length selector */}
      <div className="rounded-xl border border-slate-800 bg-[#0E131F] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <span>Question</span>
          <span className="font-bold text-teal-400 tabular-nums">
            {currentIndex + 1}
          </span>
          <span>of</span>
          <span className="tabular-nums">{questions.length}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-amber-400">
            <Flame className="h-3.5 w-3.5" />
            <span className="tabular-nums">Streak: {streak}</span>
          </div>

          <div className="text-slate-400">
            Score: <span className="text-white font-bold tabular-nums">{score}</span>
          </div>

          <div className="flex items-center gap-1 border-l border-slate-800 pl-3">
            {[5, 10, 20].map((len) => (
              <button
                key={len}
                onClick={() => resetQuizWithLength(len)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  quizLength === len
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={`Play ${len} questions`}
              >
                {len}Q
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div
          className="h-full bg-teal-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="rounded-xl border border-slate-800 bg-[#0E131F] p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="text-teal-400 font-medium uppercase tracking-wider">
            {currentQ.category}
          </span>
          <span aria-hidden="true">·</span>
          <span>Empirical Medical Adjudication</span>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-mono text-slate-500 block">Is the following claim a Fact or a Myth?</span>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-relaxed">
            "{currentQ.statement}"
          </h3>
        </div>

        {/* Choice Buttons */}
        {!hasAnswered ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => handleSelect(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-sm font-semibold text-emerald-300 hover:bg-emerald-950/40 hover:border-emerald-500/60 active:scale-98 transition-all"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span>Scientific Fact</span>
            </button>

            <button
              onClick={() => handleSelect(false)}
              className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 text-sm font-semibold text-rose-300 hover:bg-rose-950/40 hover:border-rose-500/60 active:scale-98 transition-all"
            >
              <XCircle className="h-5 w-5 text-rose-400" />
              <span>Busted Myth</span>
            </button>
          </div>
        ) : (
          /* Feedback Card */
          <div className="space-y-5 pt-2 animate-in fade-in duration-150">
            <div
              className={`rounded-xl border p-4 text-sm ${
                selectedAnswer === currentQ.isFact
                  ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
                  : 'border-rose-500/40 bg-rose-950/30 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-2">
                {selectedAnswer === currentQ.isFact ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>Correct! You recognized the evidence.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-rose-400" />
                    <span>
                      Incorrect. This claim is actually{' '}
                      {currentQ.isFact ? 'CONFIRMED FACT' : 'BUSTED MYTH'}.
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs leading-relaxed text-slate-300">
                {currentQ.explanation}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
              <span className="font-mono text-slate-400">
                Demographic Stat: <span className="text-slate-200">{currentQ.misconceptionStat}</span>
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-teal-400">
                <BookOpen className="h-3 w-3" />
                {currentQ.citation}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-teal-400 transition-colors shadow-sm"
              >
                <span>
                  {currentIndex + 1 < questions.length ? 'Next Question' : 'View Final Score'}
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
