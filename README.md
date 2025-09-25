# AppealAI - Dispute Document Generator

A Chainlit-powered chatbot that helps users generate dispute documents for:
- Parking tickets
- Housing complaints and disputes

## Features

- Interactive chat interface for data collection
- Automated document generation
- Download dispute documents directly from chat
- Support for multiple dispute types

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
chainlit run app.py -w
```

3. Open your browser to the provided URL (usually http://localhost:8000)

## Usage

1. Start a conversation with the bot
2. Select your dispute type (parking ticket or housing)
3. Provide the requested information
4. Download your generated dispute document

## Project Structure

- `app.py` - Main Chainlit application
- `utils/` - Utility functions for document generation
- `templates/` - Document templates
- `output/` - Generated documents