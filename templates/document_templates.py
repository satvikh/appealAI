from datetime import datetime
from typing import Dict, Any, Optional

# Document templates for parking ticket disputes
PARKING_DISPUTE_TEMPLATE = """
{date}

To: Parking Violations Bureau
From: {name}
Address: {address}
Phone: {phone}
Email: {email}

RE: FORMAL DISPUTE OF PARKING CITATION
Citation Number: {ticket_number}
Date of Alleged Violation: {issue_date}

Dear Hearing Officer,

I am formally disputing the above-referenced parking citation issued on {issue_date} at {location}. I respectfully request that this citation be dismissed for the following reasons:

VEHICLE INFORMATION:
{vehicle_info}

VIOLATION ALLEGED:
The citation alleges: {violation_description}

GROUNDS FOR DISPUTE:
{dispute_reason}

SUPPORTING EVIDENCE:
{evidence}

LEGAL BASIS FOR DISMISSAL:
Based on the circumstances described above, this citation should be dismissed because:
1. The alleged violation did not occur as described
2. The evidence supports my lawful parking at the time in question
3. Any violation that may have occurred was not willful and was due to circumstances beyond my control

I respectfully request that you review all evidence and dismiss this citation. The burden of proof lies with the issuing authority to prove beyond a reasonable doubt that a violation occurred. The evidence I have provided clearly demonstrates that no violation took place.

CONCLUSION:
I am requesting a full dismissal of this citation. I believe the evidence clearly shows that no parking violation occurred, and I respectfully ask for your careful consideration of all facts presented.

Thank you for your time and consideration. I look forward to a favorable resolution of this matter.

Sincerely,

{name}
{date}

---
ATTACHMENTS:
Please find attached the following supporting documentation:
- Copy of parking citation
- Photographic evidence (if applicable)
- Receipts or other relevant documentation
- Any additional supporting materials referenced above
"""

# Document templates for housing disputes
HOUSING_DISPUTE_TEMPLATE = """
{date}

To: {landlord_name}
{landlord_address}

From: {tenant_name}
{tenant_address}
Phone: {tenant_phone}
Email: {tenant_email}

RE: FORMAL NOTICE REGARDING HOUSING ISSUES
Property Address: {property_address}

Dear {landlord_name},

I am writing to formally document and request immediate resolution of serious issues at the above-referenced rental property. This letter serves as official notice of these problems and my request for prompt corrective action.

PROPERTY INFORMATION:
- Property Address: {property_address}
- Monthly Rent: {rent_amount}
- Lease Start Date: {lease_start}

ISSUE DESCRIPTION:
{issue_description}

TIMELINE OF EVENTS:
{timeline}

PREVIOUS ATTEMPTS AT RESOLUTION:
{attempted_resolution}

IMPACT ON HABITABILITY:
The issues described above have significantly impacted the habitability of the rental unit and my ability to peacefully enjoy the premises as guaranteed under the lease agreement and applicable housing laws. These conditions may constitute violations of:

- Local housing codes and regulations
- State habitability standards
- Terms of the lease agreement
- Tenant rights under applicable law

REQUESTED RESOLUTION:
I am requesting the following corrective action:
{desired_outcome}

LEGAL OBLIGATIONS:
Please be advised that as the property owner/manager, you have legal obligations under state and local law to:
- Maintain the property in habitable condition
- Make necessary repairs in a timely manner
- Ensure compliance with all applicable housing codes
- Provide tenants with peaceful enjoyment of the premises

SUPPORTING DOCUMENTATION:
The following evidence supports my claims:
{evidence}

TIMELINE FOR RESPONSE:
I respectfully request that you respond to this letter within 7 days to confirm your plan for addressing these issues. Under applicable law, you may be required to complete repairs within a reasonable time frame, typically 30 days for non-emergency issues and immediately for emergency situations.

NEXT STEPS:
If these issues are not addressed promptly, I may be forced to pursue additional remedies available under law, which may include:
- Filing complaints with local housing authorities
- Withholding rent as permitted by law
- Seeking rent reduction or compensation
- Terminating the lease without penalty
- Pursuing legal action for damages

I prefer to resolve this matter amicably and look forward to your prompt attention to these concerns. Please contact me at your earliest convenience to discuss a resolution plan.

Thank you for your immediate attention to this matter.

Sincerely,

{tenant_name}
{date}

---
COPIES SENT TO:
- Local Housing Authority (if applicable)
- Property Management Company (if applicable)
- Personal records

ATTACHMENTS:
- Photographic evidence
- Previous correspondence
- Receipts and documentation
- Copy of lease agreement (relevant sections)
"""

def format_parking_dispute(data: Dict[str, Any]) -> str:
    """Format parking dispute document with provided data."""
    current_date = datetime.now().strftime("%B %d, %Y")
    
    # Parse personal info
    personal_info = data.get("personal_info", "")
    info_lines = personal_info.split("\n")
    
    # Extract information with defaults
    name = "N/A"
    address = "N/A"
    phone = "N/A"
    email = "N/A"
    
    for line in info_lines:
        line = line.strip()
        if line.lower().startswith("full name:") or line.lower().startswith("name:"):
            name = line.split(":", 1)[1].strip()
        elif line.lower().startswith("address:"):
            address = line.split(":", 1)[1].strip()
        elif line.lower().startswith("phone"):
            phone = line.split(":", 1)[1].strip()
        elif line.lower().startswith("email"):
            email = line.split(":", 1)[1].strip()
    
    return PARKING_DISPUTE_TEMPLATE.format(
        date=current_date,
        name=name,
        address=address,
        phone=phone,
        email=email,
        ticket_number=data.get("ticket_number", "N/A"),
        issue_date=data.get("issue_date", "N/A"),
        location=data.get("location", "N/A"),
        vehicle_info=data.get("vehicle_info", "N/A"),
        violation_description=data.get("violation_description", "N/A"),
        dispute_reason=data.get("dispute_reason", "N/A"),
        evidence=data.get("evidence", "No additional evidence provided")
    )

def format_housing_dispute(data: Dict[str, Any]) -> str:
    """Format housing dispute document with provided data."""
    current_date = datetime.now().strftime("%B %d, %Y")
    
    # Parse property info
    property_info = data.get("property_info", "")
    property_lines = property_info.split("\n")
    
    property_address = "N/A"
    rent_amount = "N/A"
    lease_start = "N/A"
    
    for line in property_lines:
        line = line.strip()
        if line.lower().startswith("property address:") or line.lower().startswith("address:"):
            property_address = line.split(":", 1)[1].strip()
        elif line.lower().startswith("monthly rent"):
            rent_amount = line.split(":", 1)[1].strip()
        elif line.lower().startswith("lease start"):
            lease_start = line.split(":", 1)[1].strip()
    
    # Parse landlord info
    landlord_info = data.get("landlord_info", "")
    landlord_lines = landlord_info.split("\n")
    
    landlord_name = "Property Owner/Manager"
    landlord_address = "N/A"
    
    for line in landlord_lines:
        line = line.strip()
        if line.lower().startswith("landlord") or line.lower().startswith("company name"):
            landlord_name = line.split(":", 1)[1].strip()
        elif line.lower().startswith("contact address") or line.lower().startswith("address"):
            landlord_address = line.split(":", 1)[1].strip()
    
    # Parse tenant info
    tenant_info = data.get("tenant_info", "")
    tenant_lines = tenant_info.split("\n")
    
    tenant_name = "N/A"
    tenant_address = "N/A"
    tenant_phone = "N/A"
    tenant_email = "N/A"
    
    for line in tenant_lines:
        line = line.strip()
        if line.lower().startswith("full name:") or line.lower().startswith("name:"):
            tenant_name = line.split(":", 1)[1].strip()
        elif line.lower().startswith("address:") or line.lower().startswith("current address:"):
            tenant_address = line.split(":", 1)[1].strip()
        elif line.lower().startswith("phone"):
            tenant_phone = line.split(":", 1)[1].strip()
        elif line.lower().startswith("email"):
            tenant_email = line.split(":", 1)[1].strip()
    
    return HOUSING_DISPUTE_TEMPLATE.format(
        date=current_date,
        landlord_name=landlord_name,
        landlord_address=landlord_address,
        tenant_name=tenant_name,
        tenant_address=tenant_address,
        tenant_phone=tenant_phone,
        tenant_email=tenant_email,
        property_address=property_address,
        rent_amount=rent_amount,
        lease_start=lease_start,
        issue_description=data.get("issue_description", "N/A"),
        timeline=data.get("timeline", "N/A"),
        attempted_resolution=data.get("attempted_resolution", "N/A"),
        desired_outcome=data.get("desired_outcome", "N/A"),
        evidence=data.get("evidence", "No additional evidence provided")
    )