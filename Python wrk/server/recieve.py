from fastapi import FastAPI, UploadFile, File , Depends, HTTPException
from fastapi import Request
from tempfile import NamedTemporaryFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import pandas as pd 
import matplotlib.pyplot as plt
import mpld3
import subprocess
import csv
import os
from pydantic import BaseModel
from bs4 import BeautifulSoup
import asyncio
import io
import base64
from pymongo import MongoClient
import certifi
# import flowkit as fk

app = FastAPI()
output_csv_path = ""  # Global variable to store the path of the converted CSV file
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

users_db = {
    "username": {
        "username": "username",
        "password": "$2b$12$F1nX3D8mUKb5UcqXHfzj2eL9lAGJNS45f0Ff2Bw/YgXuy6ZrseY6m",  # hashed password: password
    }
}
authorized_configs = {}
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

# MOngoDB
mongodb_connection_string="mongodb+srv://ojas21101:ojas1234@clusterviz.tjmyjct.mongodb.net/?retryWrites=true&w=majority"
mongo_client = MongoClient(mongodb_connection_string, tlsCAFile=certifi.where())
db = mongo_client["clusterviz"]
@app.post("/api/convert-fcs-to-csv")
async def convert_fcs_to_csv(file: UploadFile = File(...) ):
    # print("Received file:", file.filename)
    # config = authorized_configs.get(token)
    # if not config:
    #     raise HTTPException(status_code=401, detail="Unauthorized")

    # Save the uploaded FCS file to a temporary file
    with NamedTemporaryFile(suffix=".fcs", delete=False) as temp_fcs:
        temp_fcs.write(await file.read())
        temp_fcs_path = temp_fcs.name

    # Generate the output CSV file path
    
    global output_csv_path
    output_csv_path = f"{temp_fcs_path}.csv"
    # global fcs_path
    # fcs_path = temp_fcs_path
    if os.path.exists(output_csv_path):
        with open(output_csv_path, "r") as csv_file:
            reader = csv.reader(csv_file)
            column_names = next(reader)
            # db["column_names"].insert_one({"columnNames": column_names})

        # Delete the temporary files
        os.remove(temp_fcs_path)

        return {"columnNames": column_names}

    try:
        # Execute your FCS to CSV conversion script
        command = f"python fcs_csv.py {temp_fcs_path} {output_csv_path}"
        subprocess.run(command, shell=True, check=True)

        # Read the CSV file and extract column names
        with open(output_csv_path, "r") as csv_file:
            reader = csv.reader(csv_file)
            column_names = next(reader)
            db["column_names"].insert_one({"columnNames": column_names})
        os.remove(temp_fcs_path)

        return {"columnNames": column_names}

    except Exception as e:
        os.remove(temp_fcs_path)
        return {"error": str(e)}


class PlotRequest(BaseModel):
    x_column: str
    y_column: str
    x_scale: str
    y_scale: str


@app.post("/api/generate-plots")
async def generate_plots(request: PlotRequest ):
    # config = authorized_configs.get(token)
    # if not config:
    #     raise HTTPException(status_code=401, detail="Unauthorized")
    # # Small delay to allow time for output_csv_path to be updated
    await asyncio.sleep(0.1)

    x_column = request.x_column
    y_column = request.y_column
    x_scale = request.x_scale
    y_scale = request.y_scale
    try:
        print("X Column:", x_column)
        print("Y Column:", y_column)
        print("X Scale:", x_scale)
        print("Y Scale:", y_scale)
        df = pd.read_csv(output_csv_path)
        print("Returning response...")
        print("Dataframe shape:", df.shape)
        print("Columns:", df.columns)

        # Create a new figure and axis objects
        fig, ax = plt.subplots()
        ax.scatter(df[x_column], df[y_column])
        if x_scale == "linear":
            ax.set_xscale("linear")
        elif x_scale == "log":
            ax.set_xscale("log")

        # Set y-axis scale
        if y_scale == "linear":
            ax.set_yscale("linear")
        elif y_scale == "log":
            ax.set_yscale("log")
        # flow_data = fk.FlowData(fcs_path)
        # flow_data.transform(xscale=x_scale, yscale=y_scale)
        # flow_data.plot(x=x_column, y=y_column, ax=ax)
        ax.set_xlabel(x_column)
        ax.set_ylabel(y_column)
        ax.set_title(f"Flow Cytometry Plot: {x_column} vs {y_column}")

        buffer=io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        image_data=base64.b64encode(buffer.read()).decode('utf-8')
        
        if image_data:
            print("Plot has been created successfully")
            return {"imageData": image_data}
        else:
            return {"error": "Failed to generate plot."}

    except Exception as e:
        # Handle any errors that occur during plot generation
        return {"error": str(e)}

# Authenticate user
# Authenticate user
async def authenticate_user(username: str, password: str, config: dict):
    if username == "admin" and password == "password":
        return {"username": username, "config": config}
    return None



# Verify password
async def verify_password(plain_password: str, hashed_password: str):
    return await asyncio.to_thread(pwd_context.verify, plain_password, hashed_password)


# Create access token
async def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = await asyncio.to_thread(jwt.encode, to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

class User(BaseModel):
    username: str
    password: str
    config: dict
# Routes
@app.post("/api/login")
async def login(request: Request):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")
    config = data.get("config")

    print("Received Username:", username)
    print("Received Password:", password)

    # Your authentication logic here

    if username == "admin" and password == "password":
        user = {"username": username}
        access_token = await create_access_token(
            data={"sub": user["username"],"config": config},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        )
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")

@app.get("/api/protected")
async def protected(token: str = Depends(oauth2_scheme)):
    try:
        payload = await asyncio.to_thread(jwt.decode, token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")

        # Your authorization logic here

        return {"message": "You have accessed the protected endpoint"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication token")
# using db to get the columnnames
@app.get("/api/get-column-names")
async def get_column_names():
    collection = db["column_names"]
    document = collection.find_one()
    if document:
        column_names = document["columnNames"]
        return {"columnNames": column_names}
    else:
        return {"columnNames": []}

# async def extract_div_and_script(html):
#     soup = BeautifulSoup(html, 'html.parser')
#     div_element = soup.find(
#         'div', id=lambda value: value and value.startswith('fig_el'))
#     script_element = soup.find('script')

#     div_id = div_element['id'] if div_element else ''
#     script_code = script_element.string if script_element else ''

#     print(div_id)
#     print(script_code)

    # return div_id, script_code
