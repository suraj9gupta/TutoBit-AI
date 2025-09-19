#!/usr/bin/env python3
"""
Debug script for emergentintegrations import issues in VS Code
Run this to verify your Python environment and imports
"""

import sys
import os

def debug_python_environment():
    print("🐍 Python Environment Debug")
    print("=" * 50)
    
    # Check Python version and path
    print(f"Python Version: {sys.version}")
    print(f"Python Executable: {sys.executable}")
    print(f"Python Path: {sys.path[0:3]}...")  # Show first 3 paths
    print()
    
    # Check virtual environment
    venv_path = os.environ.get('VIRTUAL_ENV')
    if venv_path:
        print(f"✅ Virtual Environment: {venv_path}")
    else:
        print("❌ No Virtual Environment detected")
    print()
    
    # Test the problematic import
    print("📦 Testing emergentintegrations import...")
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        print("✅ SUCCESS: emergentintegrations.llm.chat import works!")
        
        # Test instantiation
        chat = LlmChat(
            api_key="test-key",
            session_id="test-session", 
            system_message="Test message"
        )
        message = UserMessage(text="Test message")
        print("✅ SUCCESS: LlmChat and UserMessage can be instantiated!")
        
    except ImportError as e:
        print(f"❌ IMPORT ERROR: {e}")
        return False
    except Exception as e:
        print(f"❌ OTHER ERROR: {e}")
        return False
    
    print()
    
    # Check if package is installed
    print("📋 Checking package installation...")
    try:
        import pkg_resources
        pkg = pkg_resources.get_distribution("emergentintegrations")
        print(f"✅ Package installed: {pkg.project_name} version {pkg.version}")
        print(f"✅ Package location: {pkg.location}")
    except pkg_resources.DistributionNotFound:
        print("❌ emergentintegrations package not found!")
        return False
    except Exception as e:
        print(f"❌ Error checking package: {e}")
        return False
    
    print()
    
    # Check specific module files
    print("📁 Checking module files...")
    try:
        import emergentintegrations
        import emergentintegrations.llm
        import emergentintegrations.llm.chat
        print("✅ All module files found!")
        
        # Show module file locations
        print(f"✅ emergentintegrations location: {emergentintegrations.__file__}")
        print(f"✅ chat module location: {emergentintegrations.llm.chat.__file__}")
        
    except Exception as e:
        print(f"❌ Module file error: {e}")
        return False
    
    return True

def show_vscode_setup_instructions():
    print("\n" + "=" * 60)
    print("🛠️  VS CODE SETUP INSTRUCTIONS")
    print("=" * 60)
    
    print("""
To fix VS Code import issues:

1. 📍 SET PYTHON INTERPRETER:
   - Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
   - Type "Python: Select Interpreter"
   - Choose the interpreter with "(.venv)" or your virtual environment path
   - Should be something like: /root/.venv/bin/python

2. 🔄 RELOAD VS CODE WINDOW:
   - Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
   - Type "Developer: Reload Window"
   - This refreshes IntelliSense cache

3. 🧹 CLEAR PYTHON CACHE:
   - Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
   - Type "Python: Clear Cache and Reload Window"

4. ⚙️ CHECK WORKSPACE SETTINGS:
   - Open .vscode/settings.json in your workspace
   - Add these settings:
   
   {
       "python.defaultInterpreterPath": "/root/.venv/bin/python",
       "python.terminal.activateEnvironment": true,
       "python.analysis.autoImportCompletions": true
   }

5. 🔍 VERIFY IN VS CODE TERMINAL:
   - Open terminal in VS Code (Ctrl+`)
   - Run: python -c "from emergentintegrations.llm.chat import LlmChat, UserMessage; print('Success!')"
   
6. 🐛 IF STILL NOT WORKING:
   - Check if you have Python extension installed
   - Try restarting VS Code completely
   - Ensure you're in the correct workspace folder
""")

def main():
    success = debug_python_environment()
    
    if success:
        print("\n✅ All imports working correctly!")
        print("If VS Code still shows import errors, follow the setup instructions below.")
        show_vscode_setup_instructions()
    else:
        print("\n❌ Import issues detected!")
        print("Please check the errors above and ensure emergentintegrations is properly installed.")
        show_vscode_setup_instructions()

if __name__ == "__main__":
    main()