import urllib.request
import json
import sys

BASE_URL = "http://localhost:8000"

def post_json(url, data):
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.reason}")
        print(e.read().decode('utf-8'))
        raise
    except Exception as e:
        print(f"Error: {e}")
        raise

def get_json(url):
    try:
        with urllib.request.urlopen(url) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.reason}")
        print(e.read().decode('utf-8'))
        raise
    except Exception as e:
        print(f"Error: {e}")
        raise

def run_verification():
    print("🚀 Starting User Flow Verification...")

    # 1. Create Lead
    print("\n1️⃣  Testing POST /leads...")
    lead_data = {
        "name": "Test User",
        "email": "test@example.com",
        "company_size": "15-35"
    }
    try:
        response = post_json(f"{BASE_URL}/leads", lead_data)
        lead_id = response["id"]
        print(f"✅ Lead created successfully! ID: {lead_id}")
    except Exception:
        sys.exit(1)

    # 2. Submit Responses
    print("\n2️⃣  Testing POST /responses...")
    response_data = {
        "lead_id": lead_id,
        "answers": {
            "q1": "Answer A",
            "q2": "Answer B"
        }
    }
    try:
        response = post_json(f"{BASE_URL}/responses", response_data)
        result_id = response["result_id"]
        analysis = response["analysis"]
        print(f"✅ Responses submitted successfully! Result ID: {result_id}")
        print(f"   Analysis: {analysis['title']}")
    except Exception:
        sys.exit(1)

    # 3. Get Results
    print("\n3️⃣  Testing GET /results/{result_id}...")
    try:
        response = get_json(f"{BASE_URL}/results/{result_id}")
        print(f"✅ Results retrieved successfully!")
        print(f"   Title: {response['analysis']['title']}")
        print(f"   Description: {response['analysis']['description']}")
    except Exception:
        sys.exit(1)

    print("\n✨ All tests passed successfully!")

if __name__ == "__main__":
    run_verification()