"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { diagnosticQuestions, Question } from "@/data/questions";
import { showSuccess } from "@/utils/toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { API_URL } from "@/config";

interface QuestionContextType {
  currentQuestionIndex: number;
  answers: Record<string, string>;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  setAnswer: (questionId: string, answer: string) => void;
  questions: Question[];
  showAffirmation: boolean;
  currentAffirmation: string;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

export const QuestionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const questions = diagnosticQuestions;

  const setAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const submitResponses = async () => {
    showSuccess("Diagnostic complete! Generating your report...");
    const leadId = localStorage.getItem("lead_id");

    if (!leadId) {
      console.warn("No lead_id found, navigating to results without saving.");
      navigate("/results");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lead_id: leadId,
          answers: answers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit responses");
      }

      const data = await response.json();
      localStorage.setItem("result_id", data.result_id);
      navigate("/results");
    } catch (error) {
      console.error("Error submitting responses:", error);
      navigate("/results");
    }
  };

  const goToNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && currentQuestion.affirmation) {
      setCurrentAffirmation(currentQuestion.affirmation);
      setShowAffirmation(true);
      setTimeout(() => {
        setShowAffirmation(false);
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        } else {
          submitResponses();
        }
      }, 1500); // Show affirmation for 1.5 seconds
    } else {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        submitResponses();
      }
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <QuestionContext.Provider
      value={{
        currentQuestionIndex,
        answers,
        goToNextQuestion,
        goToPreviousQuestion,
        setAnswer,
        questions,
        showAffirmation,
        currentAffirmation,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestionFlow = () => {
  const context = useContext(QuestionContext);
  if (context === undefined) {
    throw new Error("useQuestionFlow must be used within a QuestionProvider");
  }
  return context;
};