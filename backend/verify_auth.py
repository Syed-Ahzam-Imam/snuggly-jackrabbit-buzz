import urllib.request
import json
import secrets
import sys
import time

BASE_URL = "http://localhost:8000"
EMAIL = f"admin_{secrets.token_hex(4)}@example.com"
PASSWORD = "securepassword123"

def make_request(method, endpoint, data=None, headers=None):
    url = f"{BASE_URL}{endpoint}"
    if headers is None:
        headers = {}
    
    if data:
        json_data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    else:
        json_data = None

    req = urllib.request.Request(url, method=method, data=json_data, headers=headers)
    
    try:
        with urllib.request.urlopen(req) as response:
            return response.getcode(), json.load(response)
    except urllib.error.HTTPError as e:
        return e.code, json.load(e)
    except Exception as e:
        print(f"Error accessing {url}: {e}")
        return None, None

def verify_auth():
    # Wait a bit for server to potentially restart if needed
    time.sleep(2)
    
    print(f"Testing with Email: {EMAIL}")

    # 1. Signup
    print("\n1. Testing Signup...")
    status, response = make_request("POST", "/auth/signup", {"email": EMAIL, "password": PASSWORD})
    print(f"Status: {status}")
    print(f"Response: {response}")
    if status != 201:
        print("Signup failed!")
        return

    # 2. Login
    print("\n2. Testing Login...")
    status, response = make_request("POST", "/auth/login", {"email": EMAIL, "password": PASSWORD})
    print(f"Status: {status}")
    print(f"Response: {response}")
    
    if status != 200 or "access_token" not in response:
        print("Login failed!")
        return
    
    token = response["access_token"]
    print(f"Got Token: {token[:20]}...")

    # 3. Protected Route
    print("\n3. Testing Protected Route (/auth/me)...")
    headers = {"Authorization": f"Bearer {token}"}
    status, response = make_request("GET", "/auth/me", headers=headers)
    print(f"Status: {status}")
    print(f"Response: {response}")

    if status == 200 and response["email"] == EMAIL:
        print("\nSUCCESS: Authentication flow verified!")
    else:
        print("\nFAILURE: Protected route access failed!")

if __name__ == "__main__":
    verify_auth()