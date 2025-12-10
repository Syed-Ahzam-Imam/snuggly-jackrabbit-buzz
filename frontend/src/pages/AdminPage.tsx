import React, { useState, useEffect } from 'react';
import DashboardCard from '@/components/DashboardCard';
import CompletionRateChart from '@/components/charts/CompletionRateChart';
import CTAClickChart from '@/components/charts/CTAClickChart';
import ResponsesTable from '@/components/ResponsesTable';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const API_URL = "http://localhost:8000";

interface AdminStats {
  total_leads: number;
  total_responses: number;
  completion_rate: number;
}

const AdminPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const accessToken = data.access_token;
        localStorage.setItem('admin_token', accessToken);
        setToken(accessToken);
        toast({
            title: "Login Successful",
            description: "Welcome to the admin dashboard.",
        });
      } else {
          const errorData = await response.json();
          toast({
            title: "Login Failed",
            description: errorData.detail || "Invalid credentials",
            variant: "destructive",
        });
      }
    } catch (error) {
       toast({
            title: "Error",
            description: "Failed to connect to server",
            variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!token) return;
    try {
        const response = await fetch(`${API_URL}/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            setStats(data);
        } else {
            if (response.status === 401) {
                handleLogout();
            }
        }
    } catch (error) {
        console.error("Failed to fetch stats", error);
    }
  }

  const handleLogout = () => {
      localStorage.removeItem('admin_token');
      setToken(null);
      setStats(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total Diagnostics Completed"
            value={stats?.total_responses.toLocaleString() || "..."}
            description="Since inception"
          />
          <DashboardCard
            title="Completion Rate"
            value={stats ? `${stats.completion_rate}%` : "..."}
            description="Responses / Leads"
          />
          <DashboardCard
            title="Total Leads"
            value={stats?.total_leads.toLocaleString() || "..."}
            description="Total registered leads"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CompletionRateChart />
          <CTAClickChart />
        </div>

        {/* Recent Responses Table */}
        <ResponsesTable />
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default AdminPage;