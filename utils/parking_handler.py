import chainlit as cl
from typing import Dict, Any
from datetime import datetime

class ParkingTicketHandler:
    """Handler for collecting parking ticket dispute information."""
    
    def __init__(self):
        self.required_fields = [
            "ticket_number",
            "issue_date", 
            "violation_description",
            "location",
            "vehicle_info",
            "dispute_reason",
            "evidence",
            "personal_info"
        ]
        self.current_field = 0
        
    async def start_collection(self):
        """Start the parking ticket information collection process."""
        await cl.Message(
            content="""
🎫 **Parking Ticket Dispute Information Collection**

I'll need to gather some information about your parking ticket to create a strong dispute document. Let's start with the basics:

**1. What is your parking ticket number?**
(This is usually found at the top of your ticket)
            """,
            author="AppealAI Assistant"
        ).send()
        
        cl.user_session.set("collection_step", "ticket_number")
    
    async def handle_message(self, user_input: str):
        """Handle user responses during information collection."""
        step = cl.user_session.get("collection_step")
        collected_data = cl.user_session.get("collected_data", {})
        
        if step == "ticket_number":
            collected_data["ticket_number"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "issue_date")
            
            await cl.Message(
                content="""
**2. What date was the ticket issued?**
(Please provide in MM/DD/YYYY format, e.g., 12/25/2023)
                """,
                author="AppealAI Assistant"
            ).send()
        
        elif step == "issue_date":
            collected_data["issue_date"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "violation")
            
            await cl.Message(
                content="""
**3. What violation are you being cited for?**
(e.g., "Parking in a no-parking zone", "Expired meter", "Blocking driveway", etc.)
                """,
                author="AppealAI Assistant"
            ).send()
        
        elif step == "violation":
            collected_data["violation_description"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "location")
            
            await cl.Message(
                content="""
**4. Where did this violation allegedly occur?**
(Please provide the complete address or location description)
                """,
                author="AppealAI Assistant"
            ).send()
        
        elif step == "location":
            collected_data["location"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "vehicle_info")
            
            await cl.Message(
                content="""
**5. Vehicle Information**
Please provide your vehicle details in this format:
- Make/Model: (e.g., Honda Civic)
- Year: (e.g., 2020)
- License Plate: (e.g., ABC123)
- Color: (e.g., Blue)
                """,
                author="AppealAI Assistant"
            ).send()
        
        elif step == "vehicle_info":
            collected_data["vehicle_info"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "dispute_reason")
            
            await cl.Message(
                content="""
**6. Why are you disputing this ticket?**
Please select the main reason or describe your situation:

**Common reasons:**
- **Signs were unclear/missing** - No signs or confusing signage
- **Meter malfunction** - Meter was broken or not working
- **Medical emergency** - Had to park due to medical emergency
- **Vehicle breakdown** - Car broke down in that location  
- **Incorrect information** - Ticket has wrong details
- **Valid permit/payment** - Had valid parking permit/paid meter
- **Other** - Describe your specific situation

Please explain your reason in detail:
                """,
                author="AppealAI Assistant"
            ).send()
        
        elif step == "dispute_reason":
            collected_data["dispute_reason"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "evidence")
            
            await cl.Message(
                content="""
**7. Do you have any evidence to support your dispute?**
Please describe any evidence you have (we'll help you reference it in the document):

- Photos of the location/signs/meter
- Receipts (parking payment, repair bills, medical bills)
- Witness statements
- Time-stamped evidence
- Other relevant documentation

Describe what evidence you have available:
                """,
                author="AppealAI Assistant"
            ).send()
        
        elif step == "evidence":
            collected_data["evidence"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "personal_info")
            
            await cl.Message(
                content="""
**8. Personal Information for the Dispute Letter**
Please provide:
- Full Name: 
- Address: 
- Phone Number: 
- Email: 

(This information will be used in your formal dispute document)
                """,
                author="AppealAI Assistant"
            ).send()
        
        elif step == "personal_info":
            collected_data["personal_info"] = user_input.strip()
            cl.user_session.set("collected_data", collected_data)
            cl.user_session.set("collection_step", "complete")
            
            await self.show_review(collected_data)
    
    async def show_review(self, data: Dict[str, Any]):
        """Show collected information for review."""
        review_content = f"""
✅ **Information Collection Complete!**

Here's a summary of your parking ticket dispute information:

**📋 Ticket Details:**
- Ticket Number: {data.get('ticket_number', 'N/A')}
- Issue Date: {data.get('issue_date', 'N/A')}
- Violation: {data.get('violation_description', 'N/A')}
- Location: {data.get('location', 'N/A')}

**🚗 Vehicle Information:**
{data.get('vehicle_info', 'N/A')}

**⚖️ Dispute Reason:**
{data.get('dispute_reason', 'N/A')}

**📝 Evidence:**
{data.get('evidence', 'N/A')}

**👤 Contact Information:**
{data.get('personal_info', 'N/A')}

---

Does this information look correct? 

- Type **'yes'** to generate your dispute document
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
            content="🔄 Let's collect your parking ticket information again. What is your parking ticket number?",
            author="AppealAI Assistant"
        ).send()
        
        cl.user_session.set("collection_step", "ticket_number")