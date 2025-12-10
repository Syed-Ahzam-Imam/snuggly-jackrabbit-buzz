import urllib.request
import json
import secrets
import sys
import time

BASE_URL = "http://localhost:8000"
EMAIL = f"admin_stats_{secrets.token_hex(4)}@example.com"
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

def verify_admin():
    # Wait a bit
    time.sleep(1)
    
    print(f"Testing with Email: {EMAIL}")

    # 1. Signup
    print("\n1. Creating Admin...")
    status, response = make_request("POST", "/auth/signup", {"email": EMAIL, "password": PASSWORD})
    if status != 201:
        print(f"Signup failed: {response}")
        return

    # 2. Login
    print("\n2. Logging in...")
    status, response = make_request("POST", "/auth/login", {"email": EMAIL, "password": PASSWORD})
    
    if status != 200 or "access_token" not in response:
        print(f"Login failed: {response}")
        return
    
    token = response["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"Got Token: {token[:20]}...")

    # 3. Get Stats
    print("\n3. Testing GET /admin/stats...")
    status, response = make_request("GET", "/admin/stats", headers=headers)
    print(f"Status: {status}")
    print(f"Stats: {response}")
    
    if status != 200 or "completion_rate" not in response:
        print("Failed to fetch stats!")
        return

    # 4. Get Responses
    print("\n4. Testing GET /admin/responses...")
    status, response = make_request("GET", "/admin/responses", headers=headers)
    print(f"Status: {status}")
    print(f"Response count: {len(response) if isinstance(response, list) else 'Error'}")
    
    if status == 200 and isinstance(response, list):
        if len(response) > 0:
            print(f"Sample response: {response[0]}")
        print("\nSUCCESS: Admin endpoints verified!")
    else:
        print("\nFAILURE: Could not fetch responses!")

if __name__ == "__main__":
    verify_admin()