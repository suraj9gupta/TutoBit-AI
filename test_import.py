#!/usr/bin/env python3
"""
Test script to verify emergentintegrations import works
This file should have no import errors in VS Code after setup
"""

# This import should work without errors
from emergentintegrations.llm.chat import LlmChat, UserMessage

def test_emergent_integration():
    """Test function to verify the imports work correctly"""
    
    # Test LlmChat instantiation
    chat = LlmChat(
        api_key="test-key",
        session_id="test-session",
        system_message="You are a helpful assistant"
    )
    print(f"✅ LlmChat created: {type(chat).__name__}")
    
    # Test UserMessage instantiation  
    message = UserMessage(text="Hello, this is a test message")
    print(f"✅ UserMessage created: {type(message).__name__}")
    
    # Show available methods
    print(f"✅ LlmChat methods: {[m for m in dir(chat) if not m.startswith('_')]}")
    print(f"✅ UserMessage attributes: {[a for a in dir(message) if not a.startswith('_')]}")
    
    return chat, message

if __name__ == "__main__":
    print("🧪 Testing emergentintegrations imports...")
    try:
        chat, message = test_emergent_integration()
        print("✅ All imports and instantiations successful!")
    except Exception as e:
        print(f"❌ Error: {e}")