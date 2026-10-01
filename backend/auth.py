from datetime import datetime,timedelta,timezone
from jose import jwt

SECRET_KEY="1542e85f7b2106e5de62a2035ed2fc7076e3432cc5589f790e35b22d3522a9d9"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

def create_access_token(user_id:int):
    expire=datetime.now(timezone.utc)+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload={"sub":str(user_id),"exp":expire}
    return jwt.encode(payload,SECRET_KEY,algorithm=ALGORITHM)