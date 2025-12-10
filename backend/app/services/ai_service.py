import json
import asyncio
from openai import AsyncOpenAI
from app.core.config import settings

# Initialize OpenRouter client
client = AsyncOpenAI(
    api_key=settings.OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)


async def generate_analysis(answers: dict) -> dict:
    """
    Generates a 3-part strategic analysis using OpenRouter (DeepSeek free model).
    Ensures valid JSON structure and cleans malformed output.
    """

    prompt = f"""
    You are an expert business coach analyzing a founder's diagnostic answers.
    
    User responses (JSON):
    {json.dumps(answers, indent=2)}
    
    Based on these answers, provide a 3-part analysis.
    
    Return ONLY this JSON structure:
    {{
      "mindset_shift": {{
        "title": "The specific mindset shift they need (e.g. From 'Doing It All' to 'Delegating')",
        "description": "2-3 sentences explaining why this shift is critical for them right now."
      }},
      "operational_focus": {{
        "title": "The top operational area to fix (e.g. Hiring, Sales System, Onboarding)",
        "description": "2-3 sentences on the specific bottleneck and the operational fix."
      }},
      "next_move": {{
        "title": "The immediate next step",
        "description": "One clear, actionable step they can take in the next 24-48 hours."
      }}
    }}
    
    Rules:
    - No markdown.
    - No code fences.
    - Output must be valid JSON.
    """

    try:
        # Call OpenRouter using DeepSeek
        response = await client.chat.completions.create(
            model="tngtech/deepseek-r1t2-chimera:free",
            messages=[{"role": "user", "content": prompt}]
        )

        raw = response.choices[0].message.content.strip()

        # Clean up accidental formatting from DeepSeek
        cleaned = (
            raw.replace("```json", "")
               .replace("```", "")
               .strip()
        )

        analysis_data = json.loads(cleaned)

        # Validate structure
        required_keys = ["mindset_shift", "operational_focus, ", "next_move"]
        for key in ["mindset_shift", "operational_focus", "next_move"]:
            if key not in analysis_data:
                raise ValueError(f"Missing section: {key}")
            if "title" not in analysis_data[key] or "description" not in analysis_data[key]:
                raise ValueError(f"Missing title/description in: {key}")

        return analysis_data

    except Exception as e:
        print(f"Error generating AI analysis: {e}")

        # Fallback that matches the required structure
        return {
            "mindset_shift": {
                "title": "Strategic Alignment",
                "description": "Focus on aligning your daily actions with your long-term vision to prevent burnout."
            },
            "operational_focus": {
                "title": "Process Documentation",
                "description": "Start documenting your core processes to reduce dependency on your direct involvement."
            },
            "next_move": {
                "title": "Audit Your Time",
                "description": "Spend the next 2 days tracking exactly where your time goes to identify low-leverage tasks."
            }
        }
