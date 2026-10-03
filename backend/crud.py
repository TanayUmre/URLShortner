from database import Session
from models import URL,User
from pwdlib import PasswordHash
import secrets,string
from datetime import datetime,timedelta

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
        existing_email=session.query(User).filter(User.email==email).first()
        if existing_email:
            return False,"Email is already registered"
        existing_name=session.query(User).filter(User.name==name).first()
        if existing_name:
            return False,"Username is already taken"
        if len(password)<8:
            return False,"Password must be atleast 8 characters long"
        
        hashedPw=passwordhash.hash(password)
        user=User(name=name,email=email,password_hash=hashedPw)
        session.add(user)
        session.commit()
        return True,"User created successfully"

def add_url(user_id:int,url:str,custom_alias:str|None=None):
    with Session() as session:
        existing_url=session.query(URL).filter_by(url=url,user_id=user_id).first()
        if existing_url and not custom_alias:
            return existing_url.shortened_url,True
        user=session.get(User,user_id)
        if not user:
            print("User not found. Sign Up")
            return None,False
        url_count = session.query(URL).filter_by(user_id=user_id).count()
        if url_count>=20:
            return ("Limit Reached for shortening the URLs. Delete some unused URLs to shorten new ones.",False)

        if custom_alias:
            existing_alias=session.query(URL).filter_by(shortened_url=custom_alias).first()
            if existing_alias:
                return ("Custom alias is already taken",False)
            code=custom_alias
        else:
            code=create_short_code(session)

        expires_at=datetime.now()+timedelta(days=30)
        new_url=URL(url=url,shortened_url=code,user_id=user_id,expires_at=expires_at)
        session.add(new_url)
        user.total_urls_created+=1
        session.commit()
        return new_url.shortened_url,False

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

def delete_url(url_id:int,user_id:int):
    with Session() as session:
        url=session.get(URL,url_id)
        if not url:
            return False
        if url.user_id!=user_id:
            return False
        session.delete(url)
        session.commit()
        return True

def get_url_by_short_code(short_code:str):
    with Session() as session:
        url=session.query(URL).filter_by(shortened_url=short_code).first()
        if not url:
            return None
        if url.expires_at and datetime.now()>=url.expires_at:
            return "Shortened URL has expired"
        url.clicked_count+=1
        user=session.get(User,url.user_id)
        user.total_clicks+=1
        session.commit()
        return url.url

def change_password(user_id:int,current_password:str,new_password:str):
    with Session() as session:
        user=session.get(User,user_id)
        if not user:
            return False,"User not found"
        if len(new_password)<8:
            return False,"New password must be at least 8 characters long"
        if not passwordhash.verify(current_password,user.password_hash):
            return False,"Incorrect current password"
        if passwordhash.verify(new_password,user.password_hash):
            return False,"New password must be different from your current password"
        user.password_hash=passwordhash.hash(new_password)
        session.commit()
        return True,"Password changed successfully"

def delete_expired_urls():
    with Session() as session:
        expired_urls=session.query(URL).filter(URL.expires_at<=datetime.now()).all()
        for url in expired_urls:
            session.delete(url)
        session.commit()
        return len(expired_urls)

if __name__=="__main__":
    delete=delete_expired_urls()
    print(f"Deleted {delete} expired URLs")