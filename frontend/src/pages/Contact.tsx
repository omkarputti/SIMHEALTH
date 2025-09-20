import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  Building,
  Users,
  Heart
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Information</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch with our team for support, partnerships, or general inquiries about SIMHEALTH
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Main Office</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-muted-foreground">
                      SIMHEALTH Technologies Pvt. Ltd.<br />
                      Tech Park, Sector 15<br />
                      Gurgaon, Haryana 122001<br />
                      India
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-muted-foreground">+91 124 456 7890</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-muted-foreground">info@simhealth.in</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Business Hours</p>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                      Saturday: 10:00 AM - 2:00 PM IST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Department Contacts */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Department Contacts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="font-semibold">Technical Support</p>
                    <p className="text-sm text-muted-foreground">support@simhealth.in</p>
                    <p className="text-sm text-muted-foreground">+91 124 456 7891</p>
                  </div>
                  
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="font-semibold">Medical Partnerships</p>
                    <p className="text-sm text-muted-foreground">partners@simhealth.in</p>
                    <p className="text-sm text-muted-foreground">+91 124 456 7892</p>
                  </div>
                  
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="font-semibold">Research & Development</p>
                    <p className="text-sm text-muted-foreground">research@simhealth.in</p>
                    <p className="text-sm text-muted-foreground">+91 124 456 7893</p>
                  </div>
                  
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="font-semibold">Media & Press</p>
                    <p className="text-sm text-muted-foreground">media@simhealth.in</p>
                    <p className="text-sm text-muted-foreground">+91 124 456 7894</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="medical-card border-health-critical">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-health-critical">
                  <Heart className="h-5 w-5" />
                  <span>24/7 Emergency Support</span>
                </CardTitle>
                <CardDescription>
                  For critical technical issues affecting patient care
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-health-critical" />
                    <span className="font-semibold">+91 9876 543 210</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-health-critical" />
                    <span className="font-semibold">emergency@simhealth.in</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <select 
                    id="subject"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a subject</option>
                    <option value="technical">Technical Support</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="research">Research Collaboration</option>
                    <option value="media">Media Inquiry</option>
                    <option value="general">General Question</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us how we can help you..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="consent" className="rounded border-border" />
                  <Label htmlFor="consent" className="text-sm">
                    I agree to receive communications from SIMHEALTH and understand that I can unsubscribe at any time.
                  </Label>
                </div>
                
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Location Map Placeholder */}
        <Card className="medical-card mt-8">
          <CardHeader>
            <CardTitle>Find Us</CardTitle>
            <CardDescription>Our office location in Gurgaon, India</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-secondary rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Interactive Map</p>
                <p className="text-sm text-muted-foreground">SIMHEALTH Technologies, Gurgaon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;