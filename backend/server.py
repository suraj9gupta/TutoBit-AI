from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
import json


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="CareerCraft AI API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# LLM Chat instance
llm_chat = LlmChat(
    api_key=os.environ.get('EMERGENT_LLM_KEY'),
    session_id="careercraft-main",
    system_message="""You are CareerCraft AI, an expert career guidance counselor and mentor. You provide personalized career advice, skill gap analysis, and learning recommendations. Always be encouraging, professional, and provide actionable insights. Focus on practical advice that helps users advance their careers."""
).with_model("openai", "gpt-4o")

# Define Models
class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    age: Optional[int] = None
    education: str
    current_role: Optional[str] = None
    experience_years: Optional[int] = 0
    skills: List[str] = []
    interests: List[str] = []
    career_goals: List[str] = []
    preferred_industries: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserProfileCreate(BaseModel):
    name: str
    email: str
    age: Optional[int] = None
    education: str
    current_role: Optional[str] = None
    experience_years: Optional[int] = 0
    skills: List[str] = []
    interests: List[str] = []
    career_goals: List[str] = []
    preferred_industries: List[str] = []

class CareerRecommendation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    job_title: str
    description: str
    required_skills: List[str]
    salary_range: str
    growth_potential: str
    match_percentage: float
    reasons: List[str]
    learning_resources: List[Dict[str, str]]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SkillGapAnalysis(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    target_role: str
    current_skills: List[str]
    required_skills: List[str]
    missing_skills: List[str]
    skill_gaps: List[Dict[str, Any]]
    learning_recommendations: List[Dict[str, str]]
    estimated_time_to_bridge: str
    priority_skills: List[str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    message: str
    response: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    user_id: str
    message: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "CareerCraft AI API is running!"}

@api_router.post("/profile", response_model=UserProfile)
async def create_profile(profile_data: UserProfileCreate):
    profile_dict = profile_data.dict()
    profile_obj = UserProfile(**profile_dict)
    
    # Prepare for MongoDB
    profile_for_db = profile_obj.dict()
    profile_for_db['created_at'] = profile_for_db['created_at'].isoformat()
    profile_for_db['updated_at'] = profile_for_db['updated_at'].isoformat()
    
    await db.user_profiles.insert_one(profile_for_db)
    return profile_obj

@api_router.get("/profile/{user_id}", response_model=UserProfile)
async def get_profile(user_id: str):
    profile = await db.user_profiles.find_one({"id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Parse dates
    if isinstance(profile.get('created_at'), str):
        profile['created_at'] = datetime.fromisoformat(profile['created_at'])
    if isinstance(profile.get('updated_at'), str):
        profile['updated_at'] = datetime.fromisoformat(profile['updated_at'])
    
    return UserProfile(**profile)

@api_router.put("/profile/{user_id}", response_model=UserProfile)
async def update_profile(user_id: str, profile_data: UserProfileCreate):
    existing_profile = await db.user_profiles.find_one({"id": user_id})
    if not existing_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    profile_dict = profile_data.dict()
    profile_dict['id'] = user_id
    profile_dict['created_at'] = existing_profile['created_at']
    profile_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.user_profiles.replace_one({"id": user_id}, profile_dict)
    
    # Parse date for response
    if isinstance(profile_dict.get('created_at'), str):
        profile_dict['created_at'] = datetime.fromisoformat(profile_dict['created_at'])
    profile_dict['updated_at'] = datetime.fromisoformat(profile_dict['updated_at'])
    
    return UserProfile(**profile_dict)

@api_router.post("/recommendations/{user_id}", response_model=List[CareerRecommendation])
async def generate_career_recommendations(user_id: str):
    profile = await db.user_profiles.find_one({"id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Generate AI-powered recommendations
    prompt = f"""
    Based on this user profile, generate 5 personalized career recommendations:
    
    Name: {profile.get('name')}
    Education: {profile.get('education')}
    Current Role: {profile.get('current_role', 'Not specified')}
    Experience: {profile.get('experience_years', 0)} years
    Skills: {', '.join(profile.get('skills', []))}
    Interests: {', '.join(profile.get('interests', []))}
    Career Goals: {', '.join(profile.get('career_goals', []))}
    Preferred Industries: {', '.join(profile.get('preferred_industries', []))}
    
    For each recommendation, provide:
    1. Job title
    2. Brief description (2-3 sentences)
    3. Required skills (list of 5-8 skills)
    4. Salary range (realistic based on location and experience)
    5. Growth potential (High/Medium/Low with brief explanation)
    6. Match percentage (0-100%)
    7. 3-4 specific reasons why this role fits
    8. 3-4 learning resources (with titles and types like "Course", "Certification", "Book")
    
    Format as JSON array with these exact field names: job_title, description, required_skills, salary_range, growth_potential, match_percentage, reasons, learning_resources.
    """
    
    try:
        user_message = UserMessage(text=prompt)
        response = await llm_chat.send_message(user_message)
        
        # Parse AI response
        recommendations_data = json.loads(response)
        recommendations = []
        
        for rec_data in recommendations_data:
            recommendation = CareerRecommendation(
                user_id=user_id,
                job_title=rec_data['job_title'],
                description=rec_data['description'],
                required_skills=rec_data['required_skills'],
                salary_range=rec_data['salary_range'],
                growth_potential=rec_data['growth_potential'],
                match_percentage=rec_data['match_percentage'],
                reasons=rec_data['reasons'],
                learning_resources=rec_data['learning_resources']
            )
            
            # Store in database
            rec_for_db = recommendation.dict()
            rec_for_db['created_at'] = rec_for_db['created_at'].isoformat()
            await db.career_recommendations.insert_one(rec_for_db)
            
            recommendations.append(recommendation)
        
        return recommendations
        
    except Exception as e:
        # Fallback with demo data if AI fails
        demo_recommendations = [
            {
                "job_title": "Data Scientist",
                "description": "Analyze complex data sets to help organizations make informed business decisions.",
                "required_skills": ["Python", "Machine Learning", "SQL", "Statistics", "Data Visualization"],
                "salary_range": "$80,000 - $130,000",
                "growth_potential": "High - Data science is rapidly growing with excellent career prospects",
                "match_percentage": 85.0,
                "reasons": [
                    "Strong analytical background aligns with data science requirements",
                    "Technical skills complement machine learning needs",
                    "Growing demand in preferred industries"
                ],
                "learning_resources": [
                    {"title": "Python for Data Science", "type": "Course"},
                    {"title": "Machine Learning Specialization", "type": "Certification"},
                    {"title": "Hands-On Machine Learning", "type": "Book"}
                ]
            }
        ]
        
        recommendations = []
        for rec_data in demo_recommendations:
            recommendation = CareerRecommendation(
                user_id=user_id,
                **rec_data
            )
            
            # Store in database
            rec_for_db = recommendation.dict()
            rec_for_db['created_at'] = rec_for_db['created_at'].isoformat()
            await db.career_recommendations.insert_one(rec_for_db)
            
            recommendations.append(recommendation)
        
        return recommendations

@api_router.post("/skill-gap-analysis/{user_id}", response_model=SkillGapAnalysis)
async def analyze_skill_gap(user_id: str, target_role: str):
    profile = await db.user_profiles.find_one({"id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    current_skills = profile.get('skills', [])
    
    # Generate AI-powered skill gap analysis
    prompt = f"""
    Analyze the skill gap for this career transition:
    
    Current Skills: {', '.join(current_skills)}
    Target Role: {target_role}
    Experience Level: {profile.get('experience_years', 0)} years
    Education: {profile.get('education')}
    
    Provide a comprehensive skill gap analysis with:
    1. Required skills for the target role (list of 8-12 skills)
    2. Missing skills the user needs to develop
    3. Detailed skill gaps with priority levels (High/Medium/Low), descriptions, and estimated learning time
    4. 5-6 specific learning recommendations with titles, types, and URLs/providers
    5. Estimated total time to bridge the gap
    6. Top 5 priority skills to focus on first
    
    Format as JSON with these exact fields: required_skills, missing_skills, skill_gaps (array with skill, priority, description, learning_time), learning_recommendations (array with title, type, provider), estimated_time_to_bridge, priority_skills.
    """
    
    try:
        user_message = UserMessage(text=prompt)
        response = await llm_chat.send_message(user_message)
        
        # Parse AI response
        analysis_data = json.loads(response)
        
        skill_gap_analysis = SkillGapAnalysis(
            user_id=user_id,
            target_role=target_role,
            current_skills=current_skills,
            required_skills=analysis_data['required_skills'],
            missing_skills=analysis_data['missing_skills'],
            skill_gaps=analysis_data['skill_gaps'],
            learning_recommendations=analysis_data['learning_recommendations'],
            estimated_time_to_bridge=analysis_data['estimated_time_to_bridge'],
            priority_skills=analysis_data['priority_skills']
        )
        
        # Store in database
        analysis_for_db = skill_gap_analysis.dict()
        analysis_for_db['created_at'] = analysis_for_db['created_at'].isoformat()
        await db.skill_gap_analyses.insert_one(analysis_for_db)
        
        return skill_gap_analysis
        
    except Exception as e:
        # Fallback with demo data
        demo_analysis = {
            "required_skills": ["Python", "Machine Learning", "SQL", "Statistics", "Data Visualization", "Deep Learning"],
            "missing_skills": ["Machine Learning", "Deep Learning", "Advanced Statistics"],
            "skill_gaps": [
                {"skill": "Machine Learning", "priority": "High", "description": "Core requirement for data science roles", "learning_time": "3-4 months"},
                {"skill": "Deep Learning", "priority": "Medium", "description": "Advanced AI techniques", "learning_time": "2-3 months"}
            ],
            "learning_recommendations": [
                {"title": "Machine Learning Course", "type": "Course", "provider": "Coursera"},
                {"title": "Python Data Science Handbook", "type": "Book", "provider": "O'Reilly"}
            ],
            "estimated_time_to_bridge": "6-8 months with consistent learning",
            "priority_skills": ["Python", "Machine Learning", "SQL", "Statistics", "Data Visualization"]
        }
        
        skill_gap_analysis = SkillGapAnalysis(
            user_id=user_id,
            target_role=target_role,
            current_skills=current_skills,
            **demo_analysis
        )
        
        # Store in database
        analysis_for_db = skill_gap_analysis.dict()
        analysis_for_db['created_at'] = analysis_for_db['created_at'].isoformat()
        await db.skill_gap_analyses.insert_one(analysis_for_db)
        
        return skill_gap_analysis

@api_router.post("/chat", response_model=ChatMessage)
async def chat_with_mentor(chat_request: ChatRequest):
    try:
        # Get user profile for context
        profile = await db.user_profiles.find_one({"id": chat_request.user_id})
        
        context = ""
        if profile:
            context = f"""
            User Context:
            Name: {profile.get('name')}
            Role: {profile.get('current_role', 'Not specified')}
            Experience: {profile.get('experience_years', 0)} years
            Skills: {', '.join(profile.get('skills', []))}
            Career Goals: {', '.join(profile.get('career_goals', []))}
            """
        
        enhanced_prompt = f"{context}\n\nUser Question: {chat_request.message}\n\nProvide personalized career guidance based on the user's background."
        
        user_message = UserMessage(text=enhanced_prompt)
        response = await llm_chat.send_message(user_message)
        
        chat_message = ChatMessage(
            user_id=chat_request.user_id,
            message=chat_request.message,
            response=response
        )
        
        # Store in database
        chat_for_db = chat_message.dict()
        chat_for_db['timestamp'] = chat_for_db['timestamp'].isoformat()
        await db.chat_messages.insert_one(chat_for_db)
        
        return chat_message
        
    except Exception as e:
        # Fallback response
        fallback_response = "I'm here to help with your career guidance! Could you please rephrase your question or try asking about career recommendations, skill development, or learning paths?"
        
        chat_message = ChatMessage(
            user_id=chat_request.user_id,
            message=chat_request.message,
            response=fallback_response
        )
        
        # Store in database
        chat_for_db = chat_message.dict()
        chat_for_db['timestamp'] = chat_for_db['timestamp'].isoformat()
        await db.chat_messages.insert_one(chat_for_db)
        
        return chat_message

@api_router.get("/chat/{user_id}", response_model=List[ChatMessage])
async def get_chat_history(user_id: str):
    messages = await db.chat_messages.find({"user_id": user_id}).sort("timestamp", -1).limit(50).to_list(50)
    
    # Parse timestamps
    for message in messages:
        if isinstance(message.get('timestamp'), str):
            message['timestamp'] = datetime.fromisoformat(message['timestamp'])
    
    return [ChatMessage(**message) for message in messages]

@api_router.get("/learning-resources/{user_id}")
async def get_learning_resources(user_id: str):
    """Get personalized learning resources based on user profile and skill gaps"""
    profile = await db.user_profiles.find_one({"id": user_id})
    if not profile:
        return []
    
    # Demo learning resources - in production, these would come from real APIs
    resources = [
        {
            "id": str(uuid.uuid4()),
            "title": "Complete Python Bootcamp",
            "provider": "Udemy",
            "type": "Course",
            "duration": "22 hours",
            "rating": 4.8,
            "price": "Free",
            "url": "https://www.udemy.com/course/complete-python-bootcamp/",
            "description": "Learn Python like a Professional Start from the basics and go all the way to creating your own applications"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Google Data Analytics Certificate",
            "provider": "Coursera",
            "type": "Certification",
            "duration": "6 months",
            "rating": 4.7,
            "price": "Free",
            "url": "https://www.coursera.org/professional-certificates/google-data-analytics",
            "description": "Prepare for a career in data analytics with this professional certificate from Google"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Machine Learning A-Z",
            "provider": "Udemy",
            "type": "Course",
            "duration": "44 hours",
            "rating": 4.5,
            "price": "Free",
            "url": "https://www.udemy.com/course/machinelearning/",
            "description": "Learn to create Machine Learning Algorithms in Python and R from two Data Science experts"
        }
    ]
    
    return resources

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()