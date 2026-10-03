import os 
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base,sessionmaker

load_dotenv()
# DATABASE_URL="sqlite:///urlshortner.db"
DATABASE_URL=os.getenv("DATABASE_URL")

# engine=create_engine(DATABASE_URL,echo=False,connect_args={"check_same_thread":False})
engine=create_engine(DATABASE_URL)

# Session=sessionmaker(autocommit=False,autoflush=False,bind=engine)
Session=sessionmaker(bind=engine)

Base=declarative_base()