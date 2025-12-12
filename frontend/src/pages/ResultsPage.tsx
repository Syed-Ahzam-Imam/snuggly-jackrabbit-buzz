import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, Lightbulb, Download, Loader2, Mail } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import { API_URL } from "@/config";

interface AnalysisSection {
  title: string;
  description: string;
}

interface AnalysisResult {
  mindset_shift: AnalysisSection;
  operational_focus: AnalysisSection;
  next_move: AnalysisSection;
}

const ResultsPage: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const generatePDF = () => {
    if (!analysis) return null;

    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185); // Blue color
    doc.text("Founder Clarity Report", 105, 20, { align: "center" });
    
    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Personalized Insights to help you move forward", 105, 30, { align: "center" });

    let yPos = 50;

    // Helper to add sections
    const addSection = (header: string, title: string, description: string, color: [number, number, number]) => {
      // Section Header
      doc.setFontSize(10);
      doc.setTextColor(...color);
      doc.setFont("helvetica", "bold");
      doc.text(header, 20, yPos);
      yPos += 7;

      // Card Title
      doc.setFontSize(16);
      doc.setTextColor(33, 33, 33);
      doc.setFont("helvetica", "bold");
      doc.text(title, 20, yPos);
      yPos += 10;

      // Description
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      
      const splitDesc = doc.splitTextToSize(description, 170);
      doc.text(splitDesc, 20, yPos);
      yPos += (splitDesc.length * 7) + 15;
    };

    const mindset = analysis.mindset_shift || { title: "N/A", description: "N/A" };
    const operational = analysis.operational_focus || { title: "N/A", description: "N/A" };
    const nextMove = analysis.next_move || { title: "N/A", description: "N/A" };

    addSection("TOP MINDSET SHIFT", mindset.title, mindset.description, [37, 99, 235]); // Blue
    addSection("OPERATIONAL FOCUS", operational.title, operational.description, [22, 163, 74]); // Green
    addSection("YOUR NEXT MOVE", nextMove.title, nextMove.description, [217, 119, 6]); // Amber

    // Disclaimer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Disclaimer: These insights are directional and intended for reflection.", 105, 280, { align: "center" });

    return doc;
  };

  const handleDownloadPDF = () => {
    const doc = generatePDF();
    if (doc) doc.save("founder-clarity-report.pdf");
  };

  const handleEmailReport = async () => {
    if (!analysis) return;
    const resultId = localStorage.getItem("result_id");
    if (!resultId) return;

    setSendingEmail(true);
    try {
      const doc = generatePDF();
      if (!doc) return;
      const pdfBlob = doc.output('blob');
      
      const formData = new FormData();
      formData.append("file", pdfBlob, "founder-clarity-report.pdf");

      const response = await fetch(`${API_URL}/results/${resultId}/email`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to send email");
      
      toast({
        title: "Email Sent!",
        description: "Your report has been emailed to you successfully.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Email Failed",
        description: "Failed to send the email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      const resultId = localStorage.getItem("result_id");
      if (!resultId) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/results/${resultId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const data = await response.json();
        // Handle both old and new format gracefully or just expect new format
        // We'll assume new format as we just updated the backend
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

  // Fallback for partial data if something goes wrong with AI generation structure
  const mindset = analysis.mindset_shift || { title: "Analysis Unavailable", description: "Could not generate mindset shift." };
  const operational = analysis.operational_focus || { title: "Analysis Unavailable", description: "Could not generate operational focus." };
  const nextMove = analysis.next_move || { title: "Analysis Unavailable", description: "Could not generate next move." };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-3xl mx-auto space-y-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
          Your Founder Clarity Report
        </h1>
        <p className="text-lg text-center text-gray-700 mb-10">
          Here are your personalized insights to help you move forward.
        </p>

        {/* Mindset Shift Card */}
        <Card className="shadow-xl rounded-lg p-6 bg-white border-l-4 border-blue-500">
          <CardHeader className="flex flex-row items-center space-x-4 pb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Top Mindset Shift</p>
              <CardTitle className="text-2xl font-semibold text-gray-800 mt-1">
                {mindset.title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-lg leading-relaxed">
              {mindset.description}
            </p>
          </CardContent>
        </Card>

        {/* Operational Focus Card */}
        <Card className="shadow-xl rounded-lg p-6 bg-white border-l-4 border-green-500">
          <CardHeader className="flex flex-row items-center space-x-4 pb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Operational Focus</p>
              <CardTitle className="text-2xl font-semibold text-gray-800 mt-1">
                {operational.title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-lg leading-relaxed">
              {operational.description}
            </p>
          </CardContent>
        </Card>

        {/* Next Move Card */}
        <Card className="shadow-xl rounded-lg p-6 bg-white border-l-4 border-amber-500">
          <CardHeader className="flex flex-row items-center space-x-4 pb-4">
            <Lightbulb className="h-8 w-8 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-600 uppercase tracking-wide">Your Next Move</p>
              <CardTitle className="text-2xl font-semibold text-gray-800 mt-1">
                {nextMove.title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-lg leading-relaxed font-medium">
              {nextMove.description}
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <Button
            onClick={handleEmailReport}
            disabled={sendingEmail}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            {sendingEmail ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-5 w-5" />
                Email Report
              </>
            )}
          </Button>
          <Button onClick={handleDownloadPDF} size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
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