import chainlit as cl
from typing import Dict, Any
from datetime import datetime

class HousingHandler:
    """Handler for collecting housing dispute information."""
    
    def __init__(self):
        self.required_fields = [
            "issue_type",
            "property_info",
            "landlord_info", 
            "issue_description",
            "timeline",
            "attempted_resolution",
            "desired_outcome",
            "evidence",
            "tenant_info"
        ]
        
    async def start_collection(self):
        """Start the housing dispute information collection process."""
        await cl.Message(
            content="""
🏠 **Housing Dispute Information Collection**

I'll help you create a professional document for your housing issue. Let's gather the necessary information:

**1. What type of housing issue are you dealing with?**

Please select or describe your situation:

**🔧 Maintenance Issues:**
- Broken appliances/fixtures
- Plumbing or electrical problems
- Heating/cooling issues
- Pest infestations

**💰 Financial Disputes:**
- Security deposit issues
- Illegal fees or charges
- Rent increases
- Utility billing problems

**🏠 Habitability Issues:**
- Unsafe living conditions
- Code violations
- Mold or water damage
- Noise disturbances

**📋 Lease Issues:**
- Lease violations by landlord
- Privacy violations
- Discriminatory practices
- Eviction disputes

**Other:** Describe your specific situation

Please tell me about your housing issue:
            """,
            author="AppealAI Assistant"
        ).send()
        
        cl.user_session.set("collection_step", "issue_type")
    
    async def handle_message(self, user_input: str):
        """Handle user responses during information collection."""
        step = cl.user_session.get("collection_step")
        collected_data = cl.user_session.get("collected_data", {})
        
        if step == "issue_type":
            collected_data["issue_type"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "property_info")
            
            await cl.Message(
                content="""
**2. Property Information**
Please provide details about the rental property:

- Property Address: 
- Unit/Apartment Number (if applicable): 
- Property Type: (apartment, house, condo, etc.)
- Monthly Rent Amount: 
- Lease Start Date: 
                """,
                author="AppealAI Assistant"
            ).send()
        
        elif step == "property_info":
            collected_data["property_info"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "landlord_info")
            
            await cl.Message(
                content="""
**3. Landlord/Property Management Information**
Please provide:

- Landlord/Company Name: 
- Contact Address: 
- Phone Number: 
- Email (if available): 
- Property Manager Name (if different): 
                """,
                author="AppealAI Assistant"
            ).send()
        
        elif step == "landlord_info":
            collected_data["landlord_info"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "issue_description")
            
            await cl.Message(
                content="""
**4. Detailed Issue Description**
Please provide a comprehensive description of the problem:

- What exactly is the issue?
- How is it affecting your living situation?
- How long has this been a problem?
- Has the issue gotten worse over time?
- Any safety concerns or health impacts?

Be as specific as possible:
                """,
                author="AppealAI Assistant"
            ).send()
        
        elif step == "issue_description":
            collected_data["issue_description"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "timeline")
            
            await cl.Message(
                content="""
**5. Timeline of Events**
Please provide a chronological timeline:

- When did you first notice/discover the issue?
- When did you first report it to the landlord?
- What responses (if any) have you received?
- List any important dates and what happened

Example format:
- 01/15/2024: Noticed leak in bathroom ceiling
- 01/16/2024: Called landlord, left voicemail
- 01/20/2024: Sent email with photos
- 01/25/2024: Landlord visited but no repairs made

Your timeline:
                """,
                author="AppealAI Assistant"
            ).send()
        
        elif step == "timeline":
            collected_data["timeline"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "attempted_resolution")
            
            await cl.Message(
                content="""
**6. Attempts at Resolution**
What steps have you taken to resolve this issue?

- Phone calls made to landlord/management
- Emails or letters sent
- In-person conversations
- Maintenance requests submitted
- Third-party contacts (city inspectors, housing authority, etc.)
- Any responses or promises made by landlord

Please describe your efforts:
                """,
                author="AppealAI Assistant"
            ).send()
        
        elif step == "attempted_resolution":
            collected_data["attempted_resolution"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "desired_outcome")
            
            await cl.Message(
                content="""
**7. Desired Resolution**
What outcome are you seeking?

**Common requests:**
- Immediate repairs/maintenance
- Rent reduction or refund
- Security deposit return
- Compensation for damages/expenses
- Lease termination without penalty
- Improved living conditions
- Policy changes

**Specific requests:**
- Timeline for resolution (e.g., "within 30 days")
- Specific monetary amounts
- Alternative housing arrangements

What resolution are you seeking?
                """,
                author="AppealAI Assistant"
            ).send()
        
        elif step == "desired_outcome":
            collected_data["desired_outcome"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "evidence")
            
            await cl.Message(
                content="""
**8. Evidence and Documentation**
What evidence do you have to support your case?

- Photos or videos of the issue
- Email correspondence with landlord
- Text messages or call logs
- Receipts for expenses incurred
- Medical documentation (if health-related)
- Inspection reports
- Witness statements
- Lease agreement copies

Please describe your available evidence:
                """,
                author="AppealAI Assistant"
            ).send()
        
        elif step == "evidence":
            collected_data["evidence"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "tenant_info")
            
            await cl.Message(
                content="""
**9. Your Contact Information**
Please provide your details for the dispute document:

- Full Name: 
- Current Address (if different from rental): 
- Phone Number: 
- Email Address: 
- Best time to contact you: 

(This information will be used in your formal complaint document)
                """,
                author="AppealAI Assistant"
            ).send()
        
        elif step == "tenant_info":
            collected_data["tenant_info"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "complete")
            
            await self.show_review(collected_data)
    
    async def show_review(self, data: Dict[str, Any]):
        """Show collected information for review."""
        review_content = f"""
✅ **Information Collection Complete!**

Here's a summary of your housing dispute information:

**🏠 Issue Type:**
{data.get('issue_type', 'N/A')}

**📍 Property Details:**
{data.get('property_info', 'N/A')}

**👤 Landlord Information:**
{data.get('landlord_info', 'N/A')}

**📝 Issue Description:**
{data.get('issue_description', 'N/A')[:200]}{"..." if len(data.get('issue_description', '')) > 200 else ""}

**📅 Timeline:**
{data.get('timeline', 'N/A')[:200]}{"..." if len(data.get('timeline', '')) > 200 else ""}

**🔄 Resolution Attempts:**
{data.get('attempted_resolution', 'N/A')[:200]}{"..." if len(data.get('attempted_resolution', '')) > 200 else ""}

**🎯 Desired Outcome:**
{data.get('desired_outcome', 'N/A')}

**📋 Evidence:**
{data.get('evidence', 'N/A')}

**📞 Your Information:**
{data.get('tenant_info', 'N/A')}

---

Does this information look correct? 

- Type **'yes'** to generate your housing dispute document
- Type **'no'** to make changes
        """
        
        await cl.Message(
            content=review_content,
            author="AppealAI Assistant"
        ).send()
        
        cl.user_session.set("current_step", "review")
    
    async def restart_collection(self):
        """Restart the information collection process."""
        await cl.Message(
            content="🔄 Let's collect your housing dispute information again. What type of housing issue are you dealing with?",
            author="AppealAI Assistant"
        ).send()
        
        cl.user_session.set("collection_step", "issue_type")