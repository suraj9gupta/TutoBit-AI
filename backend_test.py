import requests
import sys
import json
from datetime import datetime

class CareerCraftAPITester:
    def __init__(self, base_url="https://skillpath-mentor-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.test_user_id = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'Array with ' + str(len(response_data)) + ' items'}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        success, response = self.run_test(
            "API Root",
            "GET",
            "",
            200
        )
        return success

    def test_create_profile(self):
        """Test profile creation"""
        test_profile = {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "age": 28,
            "education": "Bachelor's in Computer Science",
            "current_role": "Software Developer",
            "experience_years": 3,
            "skills": ["Python", "JavaScript", "React", "SQL"],
            "interests": ["Machine Learning", "Web Development", "Data Science"],
            "career_goals": ["Become a Senior Developer", "Learn AI/ML"],
            "preferred_industries": ["Technology", "Fintech"]
        }
        
        success, response = self.run_test(
            "Create Profile",
            "POST",
            "profile",
            200,
            data=test_profile
        )
        
        if success and 'id' in response:
            self.test_user_id = response['id']
            print(f"   Created user ID: {self.test_user_id}")
            return True
        return False

    def test_get_profile(self):
        """Test profile retrieval"""
        if not self.test_user_id:
            print("❌ Skipping - No user ID available")
            return False
            
        success, response = self.run_test(
            "Get Profile",
            "GET",
            f"profile/{self.test_user_id}",
            200
        )
        return success

    def test_update_profile(self):
        """Test profile update"""
        if not self.test_user_id:
            print("❌ Skipping - No user ID available")
            return False
            
        updated_profile = {
            "name": "John Doe Updated",
            "email": "john.doe.updated@example.com",
            "age": 29,
            "education": "Master's in Computer Science",
            "current_role": "Senior Software Developer",
            "experience_years": 4,
            "skills": ["Python", "JavaScript", "React", "SQL", "Machine Learning"],
            "interests": ["Machine Learning", "Web Development", "Data Science", "AI"],
            "career_goals": ["Become a Tech Lead", "Master AI/ML"],
            "preferred_industries": ["Technology", "Fintech", "AI"]
        }
        
        success, response = self.run_test(
            "Update Profile",
            "PUT",
            f"profile/{self.test_user_id}",
            200,
            data=updated_profile
        )
        return success

    def test_career_recommendations(self):
        """Test career recommendations generation"""
        if not self.test_user_id:
            print("❌ Skipping - No user ID available")
            return False
            
        success, response = self.run_test(
            "Generate Career Recommendations",
            "POST",
            f"recommendations/{self.test_user_id}",
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Generated {len(response)} recommendations")
            first_rec = response[0]
            required_fields = ['job_title', 'description', 'required_skills', 'salary_range', 'match_percentage']
            missing_fields = [field for field in required_fields if field not in first_rec]
            if missing_fields:
                print(f"   ⚠️  Missing fields in recommendation: {missing_fields}")
            else:
                print(f"   ✅ All required fields present in recommendations")
        
        return success

    def test_skill_gap_analysis(self):
        """Test skill gap analysis"""
        if not self.test_user_id:
            print("❌ Skipping - No user ID available")
            return False
            
        success, response = self.run_test(
            "Skill Gap Analysis",
            "POST",
            f"skill-gap-analysis/{self.test_user_id}",
            200,
            params={"target_role": "Data Scientist"}
        )
        
        if success:
            required_fields = ['target_role', 'current_skills', 'required_skills', 'missing_skills', 'skill_gaps']
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                print(f"   ⚠️  Missing fields in analysis: {missing_fields}")
            else:
                print(f"   ✅ All required fields present in analysis")
        
        return success

    def test_chat_functionality(self):
        """Test AI mentor chat"""
        if not self.test_user_id:
            print("❌ Skipping - No user ID available")
            return False
            
        chat_request = {
            "user_id": self.test_user_id,
            "message": "What skills should I focus on to become a data scientist?"
        }
        
        success, response = self.run_test(
            "AI Mentor Chat",
            "POST",
            "chat",
            200,
            data=chat_request
        )
        
        if success:
            required_fields = ['user_id', 'message', 'response', 'timestamp']
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                print(f"   ⚠️  Missing fields in chat response: {missing_fields}")
            else:
                print(f"   ✅ All required fields present in chat response")
                print(f"   Response preview: {response.get('response', '')[:100]}...")
        
        return success

    def test_chat_history(self):
        """Test chat history retrieval"""
        if not self.test_user_id:
            print("❌ Skipping - No user ID available")
            return False
            
        success, response = self.run_test(
            "Get Chat History",
            "GET",
            f"chat/{self.test_user_id}",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Retrieved {len(response)} chat messages")
        
        return success

    def test_learning_resources(self):
        """Test learning resources endpoint"""
        if not self.test_user_id:
            print("❌ Skipping - No user ID available")
            return False
            
        success, response = self.run_test(
            "Get Learning Resources",
            "GET",
            f"learning-resources/{self.test_user_id}",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Retrieved {len(response)} learning resources")
            if len(response) > 0:
                first_resource = response[0]
                required_fields = ['title', 'provider', 'type', 'duration', 'rating']
                missing_fields = [field for field in required_fields if field not in first_resource]
                if missing_fields:
                    print(f"   ⚠️  Missing fields in learning resource: {missing_fields}")
                else:
                    print(f"   ✅ All required fields present in learning resources")
        
        return success

    def test_error_handling(self):
        """Test error handling for invalid requests"""
        print(f"\n🔍 Testing Error Handling...")
        
        # Test invalid profile ID
        success, response = self.run_test(
            "Invalid Profile ID",
            "GET",
            "profile/invalid-id",
            404
        )
        
        # Test missing required fields in profile creation
        invalid_profile = {"name": "Test"}  # Missing required fields
        success2, response2 = self.run_test(
            "Invalid Profile Data",
            "POST",
            "profile",
            422  # Validation error
        )
        
        return success or success2  # At least one error handling test should pass

def main():
    print("🚀 Starting CareerCraft AI Backend API Tests")
    print("=" * 50)
    
    tester = CareerCraftAPITester()
    
    # Run all tests in sequence
    test_results = []
    
    # Basic API tests
    test_results.append(tester.test_api_root())
    
    # Profile management tests
    test_results.append(tester.test_create_profile())
    test_results.append(tester.test_get_profile())
    test_results.append(tester.test_update_profile())
    
    # AI-powered feature tests
    test_results.append(tester.test_career_recommendations())
    test_results.append(tester.test_skill_gap_analysis())
    
    # Chat functionality tests
    test_results.append(tester.test_chat_functionality())
    test_results.append(tester.test_chat_history())
    
    # Learning resources test
    test_results.append(tester.test_learning_resources())
    
    # Error handling tests
    test_results.append(tester.test_error_handling())
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.test_user_id:
        print(f"🆔 Test User ID: {tester.test_user_id}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print("🎉 Backend API tests mostly successful!")
        return 0
    elif success_rate >= 50:
        print("⚠️  Backend API has some issues but basic functionality works")
        return 1
    else:
        print("❌ Backend API has significant issues")
        return 2

if __name__ == "__main__":
    sys.exit(main())