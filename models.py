from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)

    # Users who coach this user.
    coaches = relationship('Coachingconnection', backref='student',
        primaryjoin='User.id==Coachingconnection.student_id')

    # Users who are coached by this user.
    students = relationship('Coachingconnection', backref='coach',
        primaryjoin='User.id==Coachingconnection.coach_id')

class Coachingconnection(Base):
    __tablename__ = 'coachingconnections'
    id = Column(Integer, primary_key=True)

    coach_id = Column(Integer, ForeignKey('users.id'))
    student_id = Column(Integer, ForeignKey('users.id'))