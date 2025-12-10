"use client";

import React from "react";
import { useQuestionFlow } from "@/context/QuestionContext";
import QuestionDisplay from "./QuestionDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";

const QuestionFlow: React.FC = () => {
  const {
    currentQuestionIndex,
    answers,
    goToNextQuestion,
    goToPreviousQuestion,
    setAnswer,
    questions,
    showAffirmation,
    currentAffirmation,
  } = useQuestionFlow();

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion?.id] || "";
  const isAnswered = !!currentAnswer.trim();
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const progressValue = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!currentQuestion) {
    return (
      <div className="text-center text-xl font-semibold text-gray-700">
        Loading diagnostic...
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-lg p-6 md:p-8">
      <CardHeader className="text-center pb-4">
        <Progress value={progressValue} className="w-full mb-4 h-2" />
        <p className="text-sm text-gray-600 mb-4">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </CardHeader>
      <CardContent className="min-h-[250px] flex items-center justify-center">
        {showAffirmation ? (
          <div className="text-center text-2xl font-bold text-blue-600 animate-fade-in-out">
            {currentAffirmation}
          </div>
        ) : (
          <QuestionDisplay
            question={currentQuestion}
            currentAnswer={currentAnswer}
            onAnswerChange={(answer) => setAnswer(currentQuestion.id, answer)}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0 || showAffirmation}
          className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          onClick={goToNextQuestion}
          disabled={!isAnswered || showAffirmation}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLastQuestion ? "Finish Diagnostic" : "Next"} <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionFlow;