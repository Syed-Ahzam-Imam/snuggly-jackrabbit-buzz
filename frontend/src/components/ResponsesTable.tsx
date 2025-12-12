import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserResponse {
  id: string;
  name: string;
  email: string;
  answers: Record<string, any>;
  created_at: string;
}

import { API_URL } from "@/config";

const ResponsesTable: React.FC = () => {
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponses = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) return;

      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/admin/responses`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setResponses(data);
        } else {
          setError("Failed to fetch responses");
        }
      } catch (err) {
        setError("Error connecting to server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponses();
  }, []);

  if (isLoading) {
      return (
        <Card className="shadow-md">
            <CardContent className="p-8 text-center text-gray-500">
                Loading responses...
            </CardContent>
        </Card>
      );
  }

  if (error) {
      return (
        <Card className="shadow-md border-red-200">
            <CardContent className="p-8 text-center text-red-500">
                {error}
            </CardContent>
        </Card>
      );
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Recent Diagnostic Responses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                          No responses found yet.
                      </TableCell>
                  </TableRow>
              ) : (
                  responses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell className="whitespace-nowrap text-gray-600">
                        {new Date(response.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">{response.name}</TableCell>
                      <TableCell>{response.email}</TableCell>
                      <TableCell className="text-gray-600">
                        {Object.keys(response.answers).length} answers
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsesTable;