import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, Lightbulb, Download, Loader2 } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useNavigate } from "react-router-dom";

const ResultsPage: React.FC = () => {
  const [analysis, setAnalysis] = useState<{ title: string; description: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      const resultId = localStorage.getItem("result_id");
      if (!resultId) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/results/${resultId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const data = await response.json();
        setAnalysis(data.analysis);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="p-6">
          <p className="text-red-500">Failed to load results. Please try again.</p>
          <Button onClick={() => navigate("/")} className="mt-4">Go Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-3xl mx-auto space-y-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
          Your Founder Clarity Report
        </h1>
        <p className="text-lg text-center text-gray-700 mb-10">
          Here are your personalized insights to help you move forward.
        </p>

        <Card className="shadow-xl rounded-lg p-6 bg-white">
          <CardHeader className="flex flex-row items-center space-x-4 pb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {analysis.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-lg">
              {analysis.description}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl rounded-lg p-6 bg-white">
          <CardHeader className="flex flex-row items-center space-x-4 pb-4">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Streamline Customer Onboarding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-lg">
              Based on your company size, optimizing your customer onboarding process could yield the most immediate operational improvements.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl rounded-lg p-6 bg-white">
          <CardHeader className="flex flex-row items-center space-x-4 pb-4">
            <Lightbulb className="h-8 w-8 text-blue-600" />
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Your Next Move
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-lg font-medium">
              Conduct a team workshop to identify friction points in your current processes and align on the mindset shift identified above.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            Book a Consult
          </Button>
          <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <Download className="h-5 w-5 mr-2" /> Download My Report
          </Button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-8">
          Disclaimer: These insights are directional and intended for reflection.
        </p>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default ResultsPage;