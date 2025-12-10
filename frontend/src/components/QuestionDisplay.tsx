"use client";

import React from "react";
import { Question } from "@/data/questions";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QuestionDisplayProps {
  question: Question;
  currentAnswer: string;
  onAnswerChange: (answer: string) => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
}) => {
  if (!question) {
    return null;
  }

  return (
    <div className="w-full">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        {question.text}
      </h3>
      {question.type === "text" && (
        <Textarea
          placeholder={question.placeholder}
          value={currentAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg min-h-[120px]"
        />
      )}
      {question.type === "radio" && question.options && (
        <RadioGroup
          value={currentAnswer}
          onValueChange={onAnswerChange}
          className="space-y-4"
        >
          {question.options.map((option) => (
            <div key={option} className="flex items-center space-x-3 p-4 border rounded-md bg-white shadow-sm hover:bg-gray-50 transition-colors duration-200">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="text-lg font-medium text-gray-700 cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};

export default QuestionDisplay;