import chainlit as cl
from typing import Dict, Any, Optional
from datetime import datetime
from .image_processor import ImageProcessor

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
        self.image_processor = ImageProcessor()
        self.uploaded_image_data = None
        
    async def start_collection(self):
        """Start the parking ticket information collection process."""
        await cl.Message(
            content="""
🎫 **Parking Ticket Dispute Information Collection**

I can help you in two ways:

**📷 Option 1: Upload a Photo of Your Parking Ticket**  
Take a clear photo of your parking ticket and upload it. I'll automatically extract the information using OCR technology.

**✍️ Option 2: Enter Information Manually**  
I'll ask you questions step-by-step to gather all the necessary information.

---

**To upload a photo:** Click the attachment button (📎) and select your ticket image  
**To enter manually:** Type **"manual"** to start the guided process

Which option would you prefer?
            """,
            author="AppealAI Assistant"
        ).send()
        
        cl.user_session.set("collection_step", "upload_choice")
    
    async def handle_message(self, user_input: str, files: Optional[list] = None):
        """Handle user responses during information collection."""
        step = cl.user_session.get("collection_step")
        collected_data = cl.user_session.get("collected_data", {})
        
        # Handle file uploads
        if files and step in ["upload_choice", "image_processing"]:
            await self.process_uploaded_images(files)
            return
        
        if step == "upload_choice":
            if "manual" in user_input.lower():
                await self.start_manual_collection()
            else:
                await cl.Message(
                    content="Please either upload a photo of your parking ticket using the 📎 attachment button, or type **'manual'** to enter information step-by-step.",
                    author="AppealAI Assistant"
                ).send()
        
        elif step == "confirm_extracted_data":
            if user_input.lower() in ["yes", "y", "correct", "good"]:
                await self.proceed_with_extracted_data()
            elif user_input.lower() in ["no", "n", "incorrect", "wrong"]:
                await self.start_manual_collection()
            else:
                await cl.Message(
                    content="Please respond with **'yes'** if the information looks correct, or **'no'** if you'd like to enter it manually.",
                    author="AppealAI Assistant"
                ).send()
        
        elif step == "ticket_number":
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
    
    async def process_uploaded_images(self, files: list):
        """Process uploaded parking ticket images."""
        try:
            # Show processing message
            processing_msg = cl.Message(
                content="📷 **Processing your parking ticket image...**\n\nUsing OCR technology to extract information. This may take a moment.",
                author="AppealAI Assistant"
            )
            await processing_msg.send()
            
            # Process the first image
            file = files[0]
            
            # Save the uploaded file temporarily
            temp_path = f"temp_{file.name}"
            with open(temp_path, "wb") as f:
                f.write(file.content)
            
            # Extract data from image
            extracted_data = self.image_processor.analyze_parking_ticket(temp_path)
            
            # Clean up temp file
            import os
            try:
                os.remove(temp_path)
            except:
                pass
            
            # Store extracted data
            cl.user_session.set("collected_data", extracted_data)
            self.uploaded_image_data = extracted_data
            
            # Show extracted information for confirmation
            await self.show_extracted_data_confirmation(extracted_data)
            
        except Exception as e:
            await cl.Message(
                content=f"❌ **Error processing image:** {str(e)}\n\nLet's proceed with manual entry instead. What is your parking ticket number?",
                author="AppealAI Assistant"
            ).send()
            await self.start_manual_collection()
    
    async def show_extracted_data_confirmation(self, extracted_data: Dict[str, Any]):
        """Show extracted data for user confirmation."""
        confirmation_text = f"""
✅ **Information Extracted from Your Parking Ticket**

Here's what I found in your ticket image:

**🎫 Ticket Details:**
- **Ticket Number:** {extracted_data.get('ticket_number', 'Not found')}
- **Issue Date:** {extracted_data.get('issue_date', 'Not found')}
- **Violation:** {extracted_data.get('violation_description', 'Not found')}
- **Location:** {extracted_data.get('location', 'Not found')}

**🚗 Vehicle Information:**
- **Vehicle Info:** {extracted_data.get('vehicle_info', 'Not found')}

**💰 Fine Amount:**
- **Amount:** {extracted_data.get('amount', 'Not found')}

---

**Does this information look correct?**

- Type **'yes'** if the information is accurate and we can proceed
- Type **'no'** if you'd like to enter the information manually instead

*Note: You'll still be able to add your dispute reason and evidence in the next steps.*
        """
        
        await cl.Message(
            content=confirmation_text,
            author="AppealAI Assistant"
        ).send()
        
        cl.user_session.set("collection_step", "confirm_extracted_data")
    
    async def proceed_with_extracted_data(self):
        """Proceed with the extracted data and continue to dispute reason."""
        collected_data = cl.user_session.get("collected_data", {})
        
        await cl.Message(
            content="""
✅ **Great! I've saved the ticket information.**

Now let's continue with the dispute details:

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
        
        cl.user_session.set("collection_step", "dispute_reason")
    
    async def start_manual_collection(self):
        """Start manual information collection."""
        await cl.Message(
            content="""
📝 **Manual Information Entry**

I'll guide you through entering your parking ticket information step by step.

**1. What is your parking ticket number?**
(This is usually found at the top of your ticket)
            """,
            author="AppealAI Assistant"
        ).send()
        
        cl.user_session.set("collection_step", "ticket_number")
    
    async def restart_collection(self):
        """Restart the information collection process."""
        await cl.Message(
            content="""
🔄 **Let's start over with your parking ticket information.**

You can either:
- **📷 Upload a photo** of your parking ticket using the 📎 attachment button
- **✍️ Type 'manual'** to enter information step-by-step

What would you prefer?
            """,
            author="AppealAI Assistant"
        ).send()
        
        cl.user_session.set("collection_step", "upload_choice")