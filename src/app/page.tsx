"use client";

import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Rocket, Globe, FileText, Settings, Loader2 } from "lucide-react";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [generatingBlogs, setGeneratingBlogs] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedNiche, setSelectedNiche] = useState<string>("");

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (Array.isArray(data)) {
        setClients(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setClients([]);
      }
    } catch (e) {
      console.error("Failed to fetch clients:", e);
      setClients([]);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleGenerateBlogs = async (clientId: string) => {
    setGeneratingBlogs(clientId);
    try {
      const res = await fetch('/api/posts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Successfully generated ${data.posts.length} blog posts!`);
      } else {
        alert('Failed to generate posts: ' + data.error);
      }
    } catch (err) {
      alert('Network error generating blogs.');
    } finally {
      setGeneratingBlogs(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const form = e.target as HTMLFormElement;
      const businessName = (form.elements.namedItem('businessName') as HTMLInputElement).value;
      const niche = selectedNiche;
      const location = (form.elements.namedItem('location') as HTMLInputElement).value;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, niche, location }),
      });

      const data = await response.json();
      console.log("Generated Site Data:", data);

      if (data.success) {
        alert("Website copy generated! Check console.");
        fetchClients(); // Refresh the table
      } else {
        alert("Error generating copy.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <header className="flex items-center justify-between mb-8 pb-4 border-b">
        <div className="flex items-center gap-2 text-indigo-600">
          <Rocket className="h-8 w-8" />
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">GrowthBox AI</h1>
        </div>
        <div className="text-sm font-medium text-neutral-500 flex items-center gap-2">
          <span>Agent: Admin</span>
          <Settings className="w-4 h-4" />
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* Onboarding Form */}
        <Card className="col-span-1 border-none shadow-md">
          <CardHeader>
            <CardTitle>Launch New Client</CardTitle>
            <CardDescription>Generate a new AI website and SEO sequence.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" placeholder="e.g. Minatori Roofing" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="niche">Business Niche</Label>
                <Select value={selectedNiche} onValueChange={(val) => setSelectedNiche(val ?? "")} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a niche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="dentist">Dentist</SelectItem>
                    <SelectItem value="legal">Law Firm</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Target City / Location</Label>
                <Input id="location" placeholder="e.g. Pristina, Kosovo" required />
              </div>
              
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 mt-4" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
                {loading ? "Generating Assets..." : "Auto-Generate & Deploy"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Active Clients */}
        <Card className="col-span-1 lg:col-span-2 border-none shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Active Client Assets</CardTitle>
                <CardDescription>Manage deployed sites and SEO content.</CardDescription>
              </div>
              <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-2"/> Export CSV</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader bg-neutral-100>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Live URL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        <div>{client.name}</div>
                        <div className="text-xs text-neutral-500">{client.niche}</div>
                      </TableCell>
                      <TableCell>{client.city}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700`}>
                          {client.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-2 pr-4">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => handleGenerateBlogs(client.id)}
                          disabled={generatingBlogs === client.id}
                          className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                        >
                          {generatingBlogs === client.id ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : "Write Blogs"}
                        </Button>
                        <a href={`http://${client.slug}.localhost:3000`} target="_blank" rel="noopener noreferrer" className="ml-2 bg-neutral-900 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-neutral-800 transition-colors">
                          Visit Site
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
