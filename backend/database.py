from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base,sessionmaker
from sqlalchemy.exc import IntegrityError

DATABASE_URL="sqlite:///urlshortner.db"

engine=create_engine(DATABASE_URL,echo=False,connect_args={"check_same_thread":False})

Session=sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base=declarative_base()