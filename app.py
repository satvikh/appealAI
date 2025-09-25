import chainlit as cl
from datetime import datetime
from typing import Dict, Any, Optional
import asyncio

from utils.parking_handler import ParkingTicketHandler
from utils.housing_handler import HousingHandler
from utils.document_generator import DocumentGenerator

# Initialize handlers
parking_handler = ParkingTicketHandler()
housing_handler = HousingHandler()
doc_generator = DocumentGenerator()

@cl.on_chat_start
async def start():
    """Initialize the chat session."""
    await cl.Message(
        content="""
<div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%); border-radius: 16px; margin: 1rem 0;">

# 🏛️ Welcome to AppealAI! 

### Your AI-Powered Legal Document Assistant

<div style="background: white; padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">

**🎯 What We Specialize In:**

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1rem 0;">

<div style="text-align: left;">
**🅿️ Parking Ticket Disputes**
- Contest unfair citations
- Professional appeal letters  
- Legal argument templates
- Evidence documentation
</div>

<div style="text-align: left;">
**🏠 Housing Complaints**
- Landlord dispute letters
- Maintenance issue reports
- Security deposit claims
- Habitability complaints
</div>

</div>

</div>

<div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">

### 🚀 Ready to Get Started?

**Type "parking"** for parking ticket disputes  
**Type "housing"** for housing-related issues

<small>*Professional legal documents in minutes, not hours*</small>

</div>

</div>
        """,
        author="AppealAI Assistant"
    ).send()
    
    # Initialize user session
    cl.user_session.set("dispute_type", None)
    cl.user_session.set("current_step", "selection")
    cl.user_session.set("collected_data", {})

@cl.on_message
async def main(message: cl.Message):
    """Handle incoming messages and route to appropriate handlers."""
    user_message = message.content.lower().strip()
    current_step = cl.user_session.get("current_step")
    dispute_type = cl.user_session.get("dispute_type")
    
    if current_step == "selection":
        # Handle dispute type selection
        if "parking" in user_message:
            cl.user_session.set("dispute_type", "parking")
            cl.user_session.set("current_step", "collecting")
            await parking_handler.start_collection()
        elif "housing" in user_message:
            cl.user_session.set("dispute_type", "housing")
            cl.user_session.set("current_step", "collecting")
            await housing_handler.start_collection()
        else:
            await cl.Message(
                content="Please specify either **'parking'** for parking ticket disputes or **'housing'** for housing-related issues.",
                author="AppealAI Assistant"
            ).send()
    
    elif current_step == "collecting":
        # Route to appropriate handler
        if dispute_type == "parking":
            await parking_handler.handle_message(message.content)
        elif dispute_type == "housing":
            await housing_handler.handle_message(message.content)
    
    elif current_step == "review":
        # Handle document review and generation
        if user_message in ["yes", "y", "generate", "create"]:
            await generate_document()
        elif user_message in ["no", "n", "edit", "modify"]:
            # Go back to collection
            cl.user_session.set("current_step", "collecting")
            if dispute_type == "parking":
                await parking_handler.restart_collection()
            elif dispute_type == "housing":
                await housing_handler.restart_collection()
        else:
            await cl.Message(
                content="Please respond with **'yes'** to generate the document or **'no'** to make changes.",
                author="AppealAI Assistant"
            ).send()
    
    elif current_step == "complete":
        # Handle restart requests
        if "restart" in user_message:
            # Reset session
            cl.user_session.set("dispute_type", None)
            cl.user_session.set("current_step", "selection")
            cl.user_session.set("collected_data", {})
            
            await cl.Message(
                content="🔄 Starting fresh! Please choose **'parking'** or **'housing'** for your new dispute document.",
                author="AppealAI Assistant"
            ).send()
        elif "quit" in user_message:
            await cl.Message(
                content="👋 Thank you for using AppealAI! Good luck with your dispute. Feel free to return anytime you need help with legal documents.",
                author="AppealAI Assistant"
            ).send()

async def generate_document():
    """Generate and send the dispute document."""
    dispute_type = cl.user_session.get("dispute_type")
    collected_data = cl.user_session.get("collected_data")
    
    # Show generating message
    generating_msg = cl.Message(
        content="🔄 Generating your dispute document... This may take a moment.",
        author="AppealAI Assistant"
    )
    await generating_msg.send()
    
    try:
        # Generate document
        if dispute_type == "parking":
            file_path = await doc_generator.generate_parking_dispute(collected_data)
            doc_type = "Parking Ticket Dispute"
        elif dispute_type == "housing":
            file_path = await doc_generator.generate_housing_dispute(collected_data)
            doc_type = "Housing Dispute"
        
        # Send the document
        elements = [
            cl.File(
                name=f"{doc_type.replace(' ', '_').lower()}.docx",
                path=file_path,
                display="inline"
            )
        ]
        
        await cl.Message(
            content=f"""
✅ **Your {doc_type} document has been generated successfully!**

📄 The document includes:
- Professional formatting
- Relevant legal references
- Your specific case details
- Proper legal language

You can download the document using the file attachment above.

Would you like to create another dispute document? Type **'restart'** to begin again or **'quit'** to end the session.
            """,
            author="AppealAI Assistant",
            elements=elements
        ).send()
        
        # Reset session for potential new document
        cl.user_session.set("current_step", "complete")
        
    except Exception as e:
        await cl.Message(
            content=f"❌ Sorry, there was an error generating your document: {str(e)}\n\nPlease try again or contact support if the issue persists.",
            author="AppealAI Assistant"
        ).send()
        cl.user_session.set("current_step", "collecting")

if __name__ == "__main__":
    cl.run()