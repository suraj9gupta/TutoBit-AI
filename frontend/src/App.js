import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Progress } from "./components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { toast } from "sonner";
import { 
  User, 
  Target, 
  Brain, 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  Award, 
  Zap,
  Mic,
  MicOff,
  Star,
  Clock,
  DollarSign,
  ArrowRight,
  Plus,
  X,
  ChevronRight,
  Sparkles,
  Users,
  BookMarked,
  Lightbulb
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Voice Recognition Hook
const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = "en-US";

      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
      };

      speechRecognition.onstart = () => setIsListening(true);
      speechRecognition.onend = () => setIsListening(false);

      setRecognition(speechRecognition);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported: !!recognition
  };
};

// Home/Landing Page Component
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-emerald-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            CareerCraft AI
          </span>
        </div>
        <Button 
          onClick={() => navigate('/onboarding')}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-6 py-2"
        >
          Get Started
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Your AI-Powered
            </span>
            <br />
            <span className="text-gray-800">Career Guide</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover your ideal career path with personalized recommendations, skill gap analysis, and an AI mentor that guides you every step of the way.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate('/onboarding')}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-4 text-lg"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg"
            >
              View Demo
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1698767008609-f5fa6137b9e6"
              alt="Career growth visualization"
              className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Powerful Features for Your Success
          </h2>
          <p className="text-gray-600 text-center mb-12 text-lg">
            Everything you need to navigate your career journey with confidence
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-emerald-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-700">Smart Career Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  AI-powered recommendations based on your skills, interests, and market trends.
                </p>
              </CardContent>
            </Card>

            <Card className="border-cyan-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-cyan-600" />
                </div>
                <CardTitle className="text-cyan-700">Skill Gap Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Identify missing skills and get personalized learning recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-teal-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-teal-600" />
                </div>
                <CardTitle className="text-teal-700">AI Mentor Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  24/7 personalized career guidance with voice and text support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 text-emerald-100">
            Join thousands of professionals who've found their dream careers with CareerCraft AI
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/onboarding')}
            className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

// Onboarding Component
const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    education: "",
    current_role: "",
    experience_years: "",
    skills: [],
    interests: [],
    career_goals: [],
    preferred_industries: []
  });
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");

  const handleAddItem = (field, input, setInput) => {
    if (input.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], input.trim()]
      }));
      setInput("");
    }
  };

  const handleRemoveItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API}/profile`, {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : 0
      });
      
      localStorage.setItem('user_id', response.data.id);
      toast("Profile created successfully!");
      navigate('/dashboard');
    } catch (error) {
      toast("Error creating profile. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to CareerCraft AI</h1>
          <p className="text-gray-600">Let's build your career profile</p>
          <div className="flex justify-center mt-4">
            <Progress value={(step / 3) * 100} className="w-64" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Step {step} of 3</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 text-emerald-700">Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="Enter your email"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age (Optional)</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        placeholder="Age"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={formData.experience_years}
                        onChange={(e) => setFormData({...formData, experience_years: e.target.value})}
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      value={formData.education}
                      onChange={(e) => setFormData({...formData, education: e.target.value})}
                      placeholder="e.g., Bachelor's in Computer Science"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="current_role">Current Role (Optional)</Label>
                    <Input
                      id="current_role"
                      value={formData.current_role}
                      onChange={(e) => setFormData({...formData, current_role: e.target.value})}
                      placeholder="e.g., Software Developer"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 text-emerald-700">Skills & Interests</h2>
                
                <div>
                  <Label>Skills</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddItem('skills', skillInput, setSkillInput)}
                    />
                    <Button 
                      type="button"
                      onClick={() => handleAddItem('skills', skillInput, setSkillInput)}
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {skill}
                        <button
                          onClick={() => handleRemoveItem('skills', index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Interests</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      placeholder="Add an interest"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddItem('interests', interestInput, setInterestInput)}
                    />
                    <Button 
                      type="button"
                      onClick={() => handleAddItem('interests', interestInput, setInterestInput)}
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {interest}
                        <button
                          onClick={() => handleRemoveItem('interests', index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 text-emerald-700">Goals & Preferences</h2>
                
                <div>
                  <Label>Career Goals</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      placeholder="Add a career goal"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddItem('career_goals', goalInput, setGoalInput)}
                    />
                    <Button 
                      type="button"
                      onClick={() => handleAddItem('career_goals', goalInput, setGoalInput)}
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.career_goals.map((goal, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {goal}
                        <button
                          onClick={() => handleRemoveItem('career_goals', index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Preferred Industries</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={industryInput}
                      onChange={(e) => setIndustryInput(e.target.value)}
                      placeholder="Add an industry"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddItem('preferred_industries', industryInput, setIndustryInput)}
                    />
                    <Button 
                      type="button"
                      onClick={() => handleAddItem('preferred_industries', industryInput, setIndustryInput)}
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.preferred_industries.map((industry, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {industry}
                        <button
                          onClick={() => handleRemoveItem('preferred_industries', index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Previous
              </Button>
              
              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                >
                  Complete Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [skillGapAnalysis, setSkillGapAnalysis] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [learningResources, setLearningResources] = useState([]);
  
  const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceRecognition();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      navigate('/onboarding');
      return;
    }
    
    loadUserData(userId);
  }, [navigate]);

  useEffect(() => {
    if (transcript) {
      setChatInput(transcript);
    }
  }, [transcript]);

  const loadUserData = async (userId) => {
    try {
      // Load user profile
      const profileResponse = await axios.get(`${API}/profile/${userId}`);
      setUser(profileResponse.data);

      // Load learning resources
      const resourcesResponse = await axios.get(`${API}/learning-resources/${userId}`);
      setLearningResources(resourcesResponse.data);

      // Load chat history
      const chatResponse = await axios.get(`${API}/chat/${userId}`);
      setChatMessages(chatResponse.data.reverse());
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const generateRecommendations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/recommendations/${user.id}`);
      setRecommendations(response.data);
      toast("Career recommendations generated!");
    } catch (error) {
      toast("Error generating recommendations");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSkillGap = async (targetRole) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/skill-gap-analysis/${user.id}?target_role=${encodeURIComponent(targetRole)}`);
      setSkillGapAnalysis(response.data);
      toast("Skill gap analysis completed!");
    } catch (error) {
      toast("Error analyzing skill gap");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !user) return;

    const userMessage = chatInput;
    setChatInput("");
    
    // Add user message to chat
    const newUserMessage = {
      id: Date.now().toString(),
      user_id: user.id,
      message: userMessage,
      response: "",
      timestamp: new Date().toISOString(),
      isUser: true
    };
    setChatMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await axios.post(`${API}/chat`, {
        user_id: user.id,
        message: userMessage
      });
      
      // Add AI response to chat
      setChatMessages(prev => [...prev, { ...response.data, isUser: false }]);
    } catch (error) {
      toast("Error sending message");
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Welcome back, {user.name}!</h1>
              <p className="text-sm text-gray-600">{user.current_role || "Ready to explore new opportunities"}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Careers
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Learning
            </TabsTrigger>
            <TabsTrigger value="mentor" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Mentor
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="border-emerald-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-emerald-700">Career Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">85%</div>
                  <p className="text-xs text-gray-600">Above average for your field</p>
                </CardContent>
              </Card>

              <Card className="border-cyan-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-cyan-700">Skills Mastered</CardTitle>
                  <Award className="h-4 w-4 text-cyan-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-600">{user.skills.length}</div>
                  <p className="text-xs text-gray-600">Keep learning to grow!</p>
                </CardContent>
              </Card>

              <Card className="border-teal-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-teal-700">Goal Progress</CardTitle>
                  <Zap className="h-4 w-4 text-teal-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-teal-600">3/5</div>
                  <p className="text-xs text-gray-600">Goals completed this month</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Button
                onClick={generateRecommendations}
                disabled={loading}
                className="h-24 flex flex-col gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
              >
                <Target className="h-6 w-6" />
                Get Career Recommendations
              </Button>
              
              <Button
                onClick={() => analyzeSkillGap("Data Scientist")}
                disabled={loading}
                variant="outline"
                className="h-24 flex flex-col gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <Brain className="h-6 w-6" />
                Analyze Skill Gaps
              </Button>
              
              <Button
                onClick={() => setActiveTab("learning")}
                variant="outline"
                className="h-24 flex flex-col gap-2 border-cyan-300 text-cyan-700 hover:bg-cyan-50"
              >
                <BookOpen className="h-6 w-6" />
                Explore Learning
              </Button>
              
              <Button
                onClick={() => setActiveTab("mentor")}
                variant="outline"
                className="h-24 flex flex-col gap-2 border-teal-300 text-teal-700 hover:bg-teal-50"
              >
                <MessageSquare className="h-6 w-6" />
                Chat with AI Mentor
              </Button>
            </div>

            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.slice(0, 6).map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                      {user.skills.length > 6 && (
                        <Badge variant="secondary">+{user.skills.length - 6} more</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Career Goals</h4>
                    <div className="flex flex-wrap gap-2">
                      {user.career_goals.slice(0, 3).map((goal, index) => (
                        <Badge key={index} variant="outline">{goal}</Badge>
                      ))}
                      {user.career_goals.length > 3 && (
                        <Badge variant="outline">+{user.career_goals.length - 3} more</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Career Recommendations Tab */}
          <TabsContent value="recommendations">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Career Recommendations</h2>
                <Button
                  onClick={generateRecommendations}
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                >
                  {loading ? "Generating..." : "Get New Recommendations"}
                </Button>
              </div>

              {recommendations.length > 0 ? (
                <div className="grid gap-6">
                  {recommendations.map((rec) => (
                    <Card key={rec.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-emerald-700">{rec.job_title}</CardTitle>
                            <CardDescription className="mt-2">{rec.description}</CardDescription>
                          </div>
                          <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                            {rec.match_percentage}% Match
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Required Skills</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {rec.required_skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">{skill}</Badge>
                              ))}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium">{rec.salary_range}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                                <span className="text-sm">{rec.growth_potential}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Why This Role Fits</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {rec.reasons.map((reason, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <ChevronRight className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <h4 className="font-semibold text-gray-700 mb-2">Learning Resources</h4>
                          <div className="flex flex-wrap gap-2">
                            {rec.learning_resources.map((resource, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {resource.title} ({resource.type})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => analyzeSkillGap(rec.job_title)}
                          variant="outline"
                          className="w-full"
                        >
                          Analyze Skill Gap for This Role
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No recommendations yet</h3>
                    <p className="text-gray-600 mb-4">Click "Get New Recommendations" to discover career paths tailored for you!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Skill Gap Analysis</h2>
              
              {skillGapAnalysis ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-emerald-700">Analysis for: {skillGapAnalysis.target_role}</CardTitle>
                    <CardDescription>
                      Estimated time to bridge gaps: {skillGapAnalysis.estimated_time_to_bridge}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Your Current Skills</h4>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {skillGapAnalysis.current_skills.map((skill, index) => (
                            <Badge key={index} className="bg-green-100 text-green-800 border-green-300">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        
                        <h4 className="font-semibold text-gray-700 mb-3">Skills to Develop</h4>
                        <div className="flex flex-wrap gap-2">
                          {skillGapAnalysis.missing_skills.map((skill, index) => (
                            <Badge key={index} className="bg-orange-100 text-orange-800 border-orange-300">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Priority Skills</h4>
                        <div className="space-y-3">
                          {skillGapAnalysis.priority_skills.slice(0, 5).map((skill, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium">{skill}</span>
                              <Badge variant="secondary">Priority {index + 1}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-700 mb-3">Detailed Skill Gaps</h4>
                      <div className="space-y-3">
                        {skillGapAnalysis.skill_gaps.map((gap, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium text-gray-800">{gap.skill}</h5>
                              <Badge 
                                variant={gap.priority === 'High' ? 'destructive' : gap.priority === 'Medium' ? 'default' : 'secondary'}
                              >
                                {gap.priority} Priority
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{gap.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              Learning time: {gap.learning_time}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No skill analysis yet</h3>
                    <p className="text-gray-600 mb-4">Generate career recommendations first to analyze skill gaps!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Learning Resources</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-sm font-semibold text-gray-800">{resource.title}</CardTitle>
                          <CardDescription className="text-xs text-gray-600 mt-1">{resource.provider}</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{resource.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{resource.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                            {resource.price}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full text-xs" 
                        size="sm"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        Start Learning
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* AI Mentor Tab */}
          <TabsContent value="mentor">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Career Mentor</h2>
              
              <Card className="h-96">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Chat with your AI Mentor
                  </CardTitle>
                  <CardDescription className="text-emerald-100">
                    Get personalized career advice and guidance
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-4">
                  <div className="space-y-4">
                    {chatMessages.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Start a conversation with your AI mentor!</p>
                        <p className="text-sm mt-2">Ask about career advice, skill development, or job searching tips.</p>
                      </div>
                    )}
                    
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.isUser
                              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.isUser ? message.message : message.response}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50">
                  <div className="flex w-full gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask your mentor anything..."
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      className="flex-1"
                    />
                    
                    {isSupported && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={isListening ? stopListening : startListening}
                        className={`px-3 ${isListening ? 'bg-red-50 border-red-300' : ''}`}
                      >
                        {isListening ? (
                          <MicOff className="h-4 w-4 text-red-600" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    
                    <Button 
                      onClick={sendChatMessage}
                      disabled={!chatInput.trim()}
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                    >
                      Send
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;