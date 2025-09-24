import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  MessageCircle, 
  Search, 
  Book, 
  Video, 
  FileText, 
  Users,
  Zap,
  Shield,
  Upload,
  Download,
  Heart,
  Send
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Help = () => {
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! I'm your SIMHEALTH assistant. How can I help you today?", sender: "bot" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Send message to Flask chatbot
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = newMessage;
    setChatMessages([...chatMessages, { id: Date.now(), text: userMessage, sender: "user" }]);
    setNewMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      const botReply = data.reply || "Sorry, I couldn't process that. Please try again.";

      setChatMessages((prev) => [...prev, { id: Date.now() + 1, text: botReply, sender: "bot" }]);
    } catch (error) {
      setChatMessages((prev) => [...prev, { id: Date.now() + 1, text: "Error connecting to chatbot. Please try later.", sender: "bot" }]);
    }
  };

  const quickActions = [
    { icon: Upload, title: "Upload Data", description: "Learn how to upload medical images and vital signs" },
    { icon: Download, title: "Download Reports", description: "Guide to accessing and downloading your health reports" },
    { icon: Users, title: "Patient Management", description: "For doctors: Managing patient data and alerts" },
    { icon: Shield, title: "Privacy & Security", description: "Understanding how we protect your health data" },
  ];

  const faqItems = [
    {
      question: "How do I upload medical images?",
      answer: "To upload medical images, go to your dashboard and click on the 'Upload New Data' section. Select 'Medical Image' and choose your file. Supported formats include JPEG, PNG, and DICOM files. Make sure the image is clear and well-lit for best analysis results."
    },
    {
      question: "How accurate are the AI predictions?",
      answer: "Our AI models have been trained on extensive medical datasets and achieve over 99% accuracy in clinical trials. However, AI predictions should always be reviewed by qualified medical professionals and should not replace professional medical advice."
    },
    // ... add remaining FAQ items
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get assistance with using SIMHEALTH, find answers to common questions, or chat with our support team
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Chat & Search */}
          <div className="lg:col-span-2 space-y-8">
            {/* Search Card */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Search Help Articles</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for help topics, features, or issues..."
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Live Chat Card */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Live Support Chat</span>
                </CardTitle>
                <CardDescription>
                  Chat with our support team for immediate assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chat Messages */}
                  <div className="h-64 border border-border rounded-lg p-4 overflow-y-auto bg-secondary/50">
                    <div className="space-y-3">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                              message.sender === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-background border border-border"
                            }`}
                          >
                            {message.text}
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef}></div>
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Card */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Book className="h-5 w-5" />
                  <span>Frequently Asked Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Quick Actions & Resources */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full h-auto p-3 flex items-start space-x-3"
                    >
                      <action.icon className="h-5 w-5 mt-1 text-primary" />
                      <div className="text-left">
                        <p className="font-semibold">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help Resources Card */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Help Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Video Tutorials
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  User Manual (PDF)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Book className="h-4 w-4 mr-2" />
                  Knowledge Base
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Community Forum
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;