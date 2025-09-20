import { useState } from "react";
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

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        { id: Date.now(), text: newMessage, sender: "user" },
        { id: Date.now() + 1, text: "Thank you for your question. Our team will assist you shortly. For immediate help, please check our FAQ section below.", sender: "bot" }
      ]);
      setNewMessage("");
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
    {
      question: "Can I access my data from multiple devices?",
      answer: "Yes, your SIMHEALTH account is cloud-based and can be accessed from any device with an internet connection. Simply log in with your credentials to access your health dashboard, reports, and data from anywhere."
    },
    {
      question: "How is my medical data protected?",
      answer: "We use bank-level encryption (AES-256) and comply with HIPAA standards. Your data is stored securely in India with multiple backup systems. We never share your personal health information without your explicit consent."
    },
    {
      question: "What should I do if I get a high-risk alert?",
      answer: "High-risk alerts require immediate attention. Contact your healthcare provider or visit the nearest emergency room if you experience symptoms. Our emergency contact feature can help connect you with medical professionals 24/7."
    },
    {
      question: "How do I interpret my health reports?",
      answer: "Health reports include easy-to-understand visualizations with color-coded risk levels (green = good, yellow = monitor, red = critical). Detailed explanations and recommendations are provided for each health metric. You can also download a simplified version to share with your doctor."
    },
    {
      question: "Can doctors see all patient data?",
      answer: "Doctors can only access patient data with proper authorization and consent. The system maintains strict access controls, and all data access is logged for security. Patients have full control over what information they share with healthcare providers."
    },
    {
      question: "What devices are compatible with SIMHEALTH?",
      answer: "SIMHEALTH works on all modern devices including smartphones, tablets, and computers. We support iOS 12+, Android 8+, and all major web browsers. The interface is fully responsive and optimized for both mobile and desktop use."
    }
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
            {/* Search */}
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

            {/* Live Chat */}
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

            {/* FAQ Section */}
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
            {/* Quick Actions */}
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

            {/* Help Resources */}
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

            {/* Contact Support */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Our support team is here to help 24/7
                  </p>
                  <Button className="w-full">
                    Contact Support Team
                  </Button>
                </div>
                
                <div className="pt-3 border-t border-border">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Response time:</span>
                  <Badge variant="secondary">&lt; 2 hours</Badge>
                </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AI Analysis Engine</span>
                    <Badge className="health-status-good">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Upload Service</span>
                    <Badge className="health-status-good">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Report Generation</span>
                    <Badge className="health-status-good">Operational</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;