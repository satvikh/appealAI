import os
import re
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import pytesseract
from typing import Dict, List, Optional, Tuple
import chainlit as cl

class ImageProcessor:
    """Handles image processing and OCR for parking tickets and housing documents."""
    
    def __init__(self):
        # Configure tesseract path if needed (Windows)
        if os.name == 'nt':  # Windows
            # Try common installation paths
            possible_paths = [
                r'C:\Program Files\Tesseract-OCR\tesseract.exe',
                r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
                r'C:\Users\{}\AppData\Local\Tesseract-OCR\tesseract.exe'.format(os.getenv('USERNAME', '')),
            ]
            for path in possible_paths:
                if os.path.exists(path):
                    pytesseract.pytesseract.tesseract_cmd = path
                    break
    
    def preprocess_image(self, image_path: str) -> np.ndarray:
        """Preprocess image for better OCR results."""
        try:
            # Read image
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError("Could not read image file")
            
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Apply denoising
            denoised = cv2.fastNlMeansDenoising(gray)
            
            # Enhance contrast
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
            enhanced = clahe.apply(denoised)
            
            # Apply threshold to get binary image
            _, binary = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            return binary
            
        except Exception as e:
            print(f"Error preprocessing image: {str(e)}")
            # Fallback to simple processing
            img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            return img
    
    def extract_text_from_image(self, image_path: str) -> str:
        """Extract text from image using OCR."""
        try:
            # Preprocess the image
            processed_img = self.preprocess_image(image_path)
            
            # Configure tesseract
            custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,!?@#$%^&*()_+-=[]{}|;:\'\"<>/\\ '
            
            # Extract text
            text = pytesseract.image_to_string(processed_img, config=custom_config)
            
            return text.strip()
            
        except Exception as e:
            print(f"OCR Error: {str(e)}")
            # Fallback method
            try:
                img = Image.open(image_path)
                text = pytesseract.image_to_string(img)
                return text.strip()
            except:
                return "Error: Could not extract text from image. Please enter information manually."
    
    def analyze_parking_ticket(self, image_path: str) -> Dict[str, str]:
        """Analyze parking ticket image and extract relevant information."""
        text = self.extract_text_from_image(image_path)
        
        extracted_data = {
            "ticket_number": "",
            "issue_date": "",
            "violation_description": "",
            "location": "",
            "vehicle_info": "",
            "amount": ""
        }
        
        # Extract ticket number (various patterns)
        ticket_patterns = [
            r'(?:TICKET|CITATION|NO\.?)\s*:?\s*([A-Z0-9\-]{6,15})',
            r'(?:NOTICE|REF|ID)\s*:?\s*([A-Z0-9\-]{6,15})',
            r'([A-Z0-9]{8,12})',  # Generic alphanumeric pattern
        ]
        
        for pattern in ticket_patterns:
            match = re.search(pattern, text.upper())
            if match:
                extracted_data["ticket_number"] = match.group(1)
                break
        
        # Extract dates (various formats)
        date_patterns = [
            r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
            r'(\d{2,4}[/-]\d{1,2}[/-]\d{1,2})',
            r'([A-Z][a-z]+ \d{1,2},? \d{4})',
            r'(\d{1,2} [A-Z][a-z]+ \d{4})'
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, text)
            if match:
                extracted_data["issue_date"] = match.group(1)
                break
        
        # Extract violation description
        violation_keywords = [
            "METER", "EXPIRED", "NO PARKING", "FIRE HYDRANT", "HANDICAP", 
            "LOADING ZONE", "BUS ZONE", "OVERTIME", "BLOCKED", "DRIVEWAY"
        ]
        
        for line in text.upper().split('\n'):
            for keyword in violation_keywords:
                if keyword in line:
                    extracted_data["violation_description"] = line.strip()
                    break
            if extracted_data["violation_description"]:
                break
        
        # Extract location/address
        address_patterns = [
            r'(\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:ST|AVE|BLVD|RD|DR|LN|CT|PL))',
            r'([A-Z][A-Z\s]+(?:STREET|AVENUE|BOULEVARD|ROAD|DRIVE|LANE))',
        ]
        
        for pattern in address_patterns:
            match = re.search(pattern, text)
            if match:
                extracted_data["location"] = match.group(1)
                break
        
        # Extract vehicle information
        license_pattern = r'(?:LIC|LICENSE|PLATE)\s*:?\s*([A-Z0-9\-]{3,8})'
        license_match = re.search(license_pattern, text.upper())
        if license_match:
            extracted_data["vehicle_info"] = f"License Plate: {license_match.group(1)}"
        
        # Extract fine amount
        amount_patterns = [
            r'\$(\d+\.?\d*)',
            r'FINE\s*:?\s*\$?(\d+\.?\d*)',
            r'AMOUNT\s*:?\s*\$?(\d+\.?\d*)'
        ]
        
        for pattern in amount_patterns:
            match = re.search(pattern, text.upper())
            if match:
                extracted_data["amount"] = f"${match.group(1)}"
                break
        
        return extracted_data
    
    def analyze_housing_document(self, image_path: str) -> Dict[str, str]:
        """Analyze housing document image and extract relevant information."""
        text = self.extract_text_from_image(image_path)
        
        extracted_data = {
            "property_address": "",
            "landlord_info": "",
            "issue_type": "",
            "dates": "",
            "rent_amount": "",
            "lease_info": ""
        }
        
        # Extract property address
        address_patterns = [
            r'(?:PROPERTY|ADDRESS|UNIT|APT)\s*:?\s*(\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:ST|AVE|BLVD|RD|DR|LN|CT|PL))',
            r'(\d+\s+[A-Z][A-Z\s]+(?:STREET|AVENUE|BOULEVARD|ROAD|DRIVE|LANE))',
        ]
        
        for pattern in address_patterns:
            match = re.search(pattern, text)
            if match:
                extracted_data["property_address"] = match.group(1)
                break
        
        # Extract landlord/management company information
        landlord_patterns = [
            r'(?:LANDLORD|OWNER|MANAGEMENT|COMPANY)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'(?:MANAGED BY|PROPERTY MANAGER)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        ]
        
        for pattern in landlord_patterns:
            match = re.search(pattern, text)
            if match:
                extracted_data["landlord_info"] = match.group(1)
                break
        
        # Extract rent amount
        rent_patterns = [
            r'(?:RENT|MONTHLY)\s*:?\s*\$?(\d+\.?\d*)',
            r'\$(\d{3,4}\.?\d*)(?:\s*(?:PER MONTH|MONTHLY|/MONTH))?'
        ]
        
        for pattern in rent_patterns:
            match = re.search(pattern, text.upper())
            if match:
                extracted_data["rent_amount"] = f"${match.group(1)}"
                break
        
        # Identify document type/issue
        issue_keywords = {
            "LEASE": ["LEASE", "RENTAL AGREEMENT", "TENANCY"],
            "MAINTENANCE": ["REPAIR", "MAINTENANCE", "BROKEN", "LEAK", "PEST"],
            "EVICTION": ["EVICTION", "NOTICE TO QUIT", "TERMINATION"],
            "DEPOSIT": ["DEPOSIT", "SECURITY", "REFUND"],
            "NOTICE": ["NOTICE", "WARNING", "VIOLATION"]
        }
        
        for issue_type, keywords in issue_keywords.items():
            for keyword in keywords:
                if keyword in text.upper():
                    extracted_data["issue_type"] = issue_type
                    break
            if extracted_data["issue_type"]:
                break
        
        # Extract dates
        date_pattern = r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})'
        dates = re.findall(date_pattern, text)
        if dates:
            extracted_data["dates"] = ", ".join(dates[:3])  # First 3 dates found
        
        return extracted_data
    
    def create_image_preview(self, image_path: str, max_size: Tuple[int, int] = (400, 300)) -> str:
        """Create a resized preview of the uploaded image."""
        try:
            with Image.open(image_path) as img:
                # Calculate new size maintaining aspect ratio
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
                
                # Save preview
                preview_path = image_path.replace('.', '_preview.')
                img.save(preview_path, quality=85, optimize=True)
                
                return preview_path
        except Exception as e:
            print(f"Error creating preview: {str(e)}")
            return image_path