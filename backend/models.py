from sqlalchemy import String,LargeBinary,DateTime,ForeignKey
from sqlalchemy.orm import relationship,Mapped,mapped_column
from datetime import datetime
from database import Base

class User(Base):
    __tablename__="users"
    id:Mapped[int]=mapped_column(primary_key=True,autoincrement=True)
    name:Mapped[str]=mapped_column(String(100),nullable=False)
    email:Mapped[str]=mapped_column(String(100),unique=True,nullable=False)
    password_hash:Mapped[str]=mapped_column(String(255),nullable=False)
    profile_picture:Mapped[bytes|None]=mapped_column(LargeBinary,nullable=True)
    total_urls_created: Mapped[int] = mapped_column(default=0, nullable=False)
    total_clicks: Mapped[int] = mapped_column(default=0, nullable=False)
    urls:Mapped[list["URL"]]=relationship(back_populates="user",cascade="all,delete-orphan")

class URL(Base):
    __tablename__="urls"
    id:Mapped[int]=mapped_column(primary_key=True,autoincrement=True)
    url:Mapped[str]=mapped_column(String,nullable=False)
    shortened_url:Mapped[str]=mapped_column(String(20),unique=True,nullable=False)
    user_id:Mapped[int]=mapped_column(ForeignKey("users.id"),nullable=False)
    created_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.now)
    expires_at:Mapped[datetime]=mapped_column(DateTime,nullable=True)
    user:Mapped["User"]=relationship(back_populates="urls")
    clicked_count:Mapped[int]=mapped_column(default=0,nullable=False)