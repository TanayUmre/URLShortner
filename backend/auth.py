from datetime import datetime,timedelta,timezone
from jose import jwt,JWTError
from fastapi import HTTPException,status,Depends
from fastapi.security import HTTPBearer
from database import Session,engine
from models import User

SECRET_KEY="1542e85f7b2106e5de62a2035ed2fc7076e3432cc5589f790e35b22d3522a9d9"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
security=HTTPBearer()

def get_current_user(credentials:str=Depends(security)):
    token=credentials.credentials
    credentials_exception=HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Could not validate credentials")
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        user_id=payload.get("sub")
        if user_id is None:
            raise credentials_exception
        user_id=int(user_id)
    except JWTError,ValueError:
        raise credentials_exception
    with Session() as session:
        user=session.query(User).filter(User.id==user_id).first()
        if user is None:
            raise credentials_exception
        return user

def create_access_token(user_id:int):
    expire=datetime.now(timezone.utc)+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload={"sub":str(user_id),"exp":expire}
    return jwt.encode(payload,SECRET_KEY,algorithm=ALGORITHM)