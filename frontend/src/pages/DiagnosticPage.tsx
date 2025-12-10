import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionProvider } from '@/context/QuestionContext';
import QuestionFlow from '@/components/QuestionFlow';
import { MadeWithDyad } from '@/components/made-with-dyad';

const DiagnosticPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const leadId = localStorage.getItem("lead_id");
    if (!leadId) {
      navigate("/onboarding");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <QuestionProvider>
        <QuestionFlow />
      </QuestionProvider>
      <MadeWithDyad />
    </div>
  );
};

export default DiagnosticPage;