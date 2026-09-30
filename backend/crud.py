from database import Session
from models import URL,User
from pwdlib import PasswordHash
from sqlalchemy.exc import IntegrityError
import secrets,string

CHARACTERS=string.ascii_letters+string.digits
passwordhash=PasswordHash.recommended()

def generate_short_code(length:int=6)->str:
    return "".join(secrets.choice(CHARACTERS) for _ in range(length))

def get_user_by_email(session,email):
    return session.query(User).filter_by(email=email).first()

def create_short_code(session,length:int=6)->str:
    while True:
        code=generate_short_code(length)
        existing=session.query(URL).filter_by(shortened_url=code).first()
        if not existing:
            return code

def add_user(name:str,email:str,password:str):
    with Session() as session:
        hashedPw=passwordhash.hash(password)
        user=User(name=name,email=email,password_hash=hashedPw)
        try:
            session.add(user)
            session.commit()
            print("User Created:",user.id)
        except IntegrityError:
            session.rollback()
            print("Email already present")

def add_url(user_id:int,url:str):
    with Session() as session:
        existing_url=session.query(URL).filter_by(url=url,user_id=user_id).first()
        if existing_url:
            return existing_url.shortened_url
        user=session.get(User,user_id)
        if not user:
            print("User not found. Sign Up")
            return None

        code=create_short_code(session)
        new_url=URL(url=url,shortened_url=code,user_id=user_id)
        session.add(new_url)
        session.commit()
        return new_url.shortened_url

def get_user(email:str,password:str):
    with Session() as session:
        user=get_user_by_email(session,email)
        if not user:
            print("User not found. SignUp")
            return
        if not passwordhash.verify(password,user.password_hash):
            print("Incorrect Password")
            return 
        return user

def get_user_urls(user_id:int)->list:
    with Session() as session:
        urls=session.query(URL).filter_by(user_id=user_id).all()
        if not urls:
            print("No url found")
            return []
        return urls

def delete_url(url_id:int):
    with Session() as session:
        url=session.get(URL,url_id)
        if not url:
            print("No url with current ID")
            return 
        session.delete(url)
        session.commit()