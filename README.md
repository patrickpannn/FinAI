# FinAI powered by AI

## Setup

### Environment

1. Install Lubuntu 20.4.1 LTS on your Virtual machine
2. Install node (version 14) globally
3. Install yarn globally
4. Install python3 (version 3.8) globally
5. Install pip3 (version 19) globally

### MongoDB

    - There is no need to set up the database
    - Ensure in the backend folder there is a file names “.env” with the below line or add such a file if it does not exist.
        - MONGODB_URL=[mongodb+srv://smartPortfolio:404notfound@cluster0.dmydo.mongodb.net/ezfins?retryWrites=true&w=majority]

## Dependencies

Backend:
1. Open a new terminal
2. Run “cd backend”	
3. Run “yarn install”
4. Run “cd src/AI”
5. Run “pip3 install -r requirements.txt”
6. Run “python3 download.py”

Frontend:
1. Open a new terminal
2. Run “cd frontend”
3. Run “yarn install”

### To Run 

Backend:
1. Open a new terminal
2. Run “cd backend”
3. Run “yarn start”

Frontend:
1. Open a new terminal
2. Run “cd frontend”
3. Run “yarn start”
