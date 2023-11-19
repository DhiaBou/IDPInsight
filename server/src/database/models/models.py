from sqlalchemy import Boolean, Column, Integer, String


from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Parteien(Base):
    __tablename__ = 'parteien'
    ParteiID = Column(Integer, primary_key=True)
    Name = Column(String)
    Beschreibung = Column(String)

class Waehler(Base):
    __tablename__ = 'waehler'
    WaehlerID = Column(Integer, primary_key=True)
    Vorname = Column(String)
    Nachname = Column(String)
    Geburtsdatum = Column(Date)
    StimmkreisId = Column(Integer, ForeignKey('stimmkreis.StimmkreisId'))

class Stimmkreis(Base):
    __tablename__ = 'stimmkreis'
    StimmkreisId = Column(Integer, primary_key=True)
    Name = Column(String)
    Stimmberechtigte = Column(Integer)
    WahlkreisId = Column(Integer, ForeignKey('wahlkreis.WahlkreisId'))

class Kandidaten(Base):
    __tablename__ = 'kandidaten'
    KandidatID = Column(Integer, primary_key=True)
    Vorname = Column(String)
    Nachname = Column(String)
    ParteiID = Column(Integer, ForeignKey('parteien.ParteiID'))
    StimmkreisId = Column(Integer, ForeignKey('stimmkreis.StimmkreisId'))

class Stimmzettel(Base):
    __tablename__ = 'stimmzettel'
    StimmzettelID = Column(Integer, primary_key=True)
    Jahr = Column(Integer)
    Erstestimme = Column(Integer, ForeignKey('kandidaten.KandidatID'), nullable=True)
    Zweitstimme = Column(Integer, ForeignKey('kandidaten.KandidatID'), nullable=True)

class Landeslisten(Base):
    __tablename__ = 'landeslisten'
    ListeID = Column(Integer, primary_key=True)
    ParteiID = Column(Integer, ForeignKey('parteien.ParteiID'))
    Name = Column(String)
    WahlkreisId = Column(Integer, ForeignKey('wahlkreis.WahlkreisId'))

class Listenkandidaten(Base):
    __tablename__ = 'listenkandidaten'
    ListenkandidatID = Column(Integer, primary_key=True)
    ListeID = Column(Integer, ForeignKey('landeslisten.ListeID'))
    KandidatID = Column(Integer, ForeignKey('kandidaten.KandidatID'))

class Erste_Stimmzettel(Base):
    __tablename__ = 'erste_stimmzettel'
    Erste_StimmzettelID = Column(Integer, primary_key=True)
    StimmkreisId = Column(Integer, ForeignKey('stimmkreis.StimmkreisId'))
    KandidatID = Column(Integer, ForeignKey('kandidaten.KandidatID'))

class Zweite_Stimmzettel(Base):
    __tablename__ = 'zweite_stimmzettel'
    Zweite_StimmzettelID = Column(Integer, primary_key=True)
    WahlkreisId = Column(Integer, ForeignKey('wahlkreis.WahlkreisId'))
    ListenkandidatID = Column(Integer, ForeignKey('listenkandidaten.ListenkandidatID'))

class Wahlkreis(Base):
    __tablename__ = 'wahlkreis'
    WahlkreisId = Column(Integer, primary_key=True)
    Name = Column(String)

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
