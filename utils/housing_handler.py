import chainlit as cl
from typing import Dict, Any, Optional
from datetime import datetime
from .image_processor import ImageProcessor

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
        self.image_processor = ImageProcessor()
        self.uploaded_image_data = None
        
    async def start_collection(self):
        """Start the housing dispute information collection process."""
        await cl.Message(
            content="""
🏠 **Housing Dispute Information Collection**

I can help you create your housing complaint document in two ways:

**📷 Option 1: Upload Housing Document Photos**  
Upload images of relevant documents (lease, notices, correspondence, etc.) and I'll extract key information automatically.

**✍️ Option 2: Enter Information Manually**  
I'll guide you through a step-by-step process to gather all necessary details.

---

**To upload photos:** Click the attachment button (📎) and select your document images  
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
                    content="Please either upload photos of your housing documents using the 📎 attachment button, or type **'manual'** to enter information step-by-step.",
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
        
        elif step == "issue_type":
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
    
    async def process_uploaded_images(self, files: list):
        """Process uploaded housing document images."""
        try:
            # Show processing message
            processing_msg = cl.Message(
                content="📷 **Processing your housing documents...**\n\nAnalyzing uploaded images to extract relevant information. This may take a moment.",
                author="AppealAI Assistant"
            )
            await processing_msg.send()
            
            all_extracted_data = {
                "property_address": "",
                "landlord_info": "",
                "issue_type": "",
                "dates": "",
                "rent_amount": "",
                "lease_info": ""
            }
            
            # Process each uploaded file
            for i, file in enumerate(files[:3]):  # Process up to 3 files
                # Save the uploaded file temporarily
                temp_path = f"temp_housing_{i}_{file.name}"
                with open(temp_path, "wb") as f:
                    f.write(file.content)
                
                # Extract data from image
                extracted_data = self.image_processor.analyze_housing_document(temp_path)
                
                # Merge data (keep first non-empty values found)
                for key, value in extracted_data.items():
                    if value and not all_extracted_data.get(key):
                        all_extracted_data[key] = value
                
                # Clean up temp file
                import os
                try:
                    os.remove(temp_path)
                except:
                    pass
            
            # Store extracted data
            cl.user_session.set("collected_data", all_extracted_data)
            self.uploaded_image_data = all_extracted_data
            
            # Show extracted information for confirmation
            await self.show_extracted_data_confirmation(all_extracted_data)
            
        except Exception as e:
            await cl.Message(
                content=f"❌ **Error processing images:** {str(e)}\n\nLet's proceed with manual entry instead.",
                author="AppealAI Assistant"
            ).send()
            await self.start_manual_collection()
    
    async def show_extracted_data_confirmation(self, extracted_data: Dict[str, Any]):
        """Show extracted data for user confirmation."""
        confirmation_text = f"""
✅ **Information Extracted from Your Housing Documents**

Here's what I found in your uploaded images:

**🏠 Property Information:**
- **Address:** {extracted_data.get('property_address', 'Not found')}
- **Monthly Rent:** {extracted_data.get('rent_amount', 'Not found')}

**👤 Landlord/Management:**
- **Landlord Info:** {extracted_data.get('landlord_info', 'Not found')}

**📋 Issue Type:**
- **Document Type/Issue:** {extracted_data.get('issue_type', 'Not found')}

**📅 Important Dates:**
- **Dates Found:** {extracted_data.get('dates', 'Not found')}

**📄 Additional Info:**
- **Lease Details:** {extracted_data.get('lease_info', 'Not found')}

---

**Does this information look correct?**

- Type **'yes'** if the information is accurate and we can proceed
- Type **'no'** if you'd like to enter the information manually instead

*Note: We'll still gather detailed information about your specific issue and desired resolution in the next steps.*
        """
        
        await cl.Message(
            content=confirmation_text,
            author="AppealAI Assistant"
        ).send()
        
        cl.user_session.set("collection_step", "confirm_extracted_data")
    
    async def proceed_with_extracted_data(self):
        """Proceed with the extracted data and continue to detailed questions."""
        await cl.Message(
            content="""
✅ **Great! I've saved the document information.**

Now let's gather details about your specific housing issue:

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
        
        cl.user_session.set("collection_step", "issue_description")
    
    async def start_manual_collection(self):
        """Start manual information collection."""
        await cl.Message(
            content="""
📝 **Manual Information Entry**

I'll guide you through gathering information about your housing issue step by step.

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
    
    async def restart_collection(self):
        """Restart the information collection process."""
        await cl.Message(
            content="""
🔄 **Let's start over with your housing dispute information.**

You can either:
- **📷 Upload photos** of your housing documents using the 📎 attachment button
- **✍️ Type 'manual'** to enter information step-by-step

What would you prefer?
            """,
            author="AppealAI Assistant"
        ).send()
        
        cl.user_session.set("collection_step", "upload_choice")