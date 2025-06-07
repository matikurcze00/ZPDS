"""
models.py
Minimal-but-sufficient PC-Part DB schema (SQLAlchemy 1.4/2.0).

Zależności:
    pip install sqlalchemy
"""

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    Table,
    ForeignKey,
    create_engine,
)
from sqlalchemy.orm import declarative_base, relationship
from database import db

# Base = declarative_base()
Base = db.Model

# ────────────────────────────
#  Association tables (M:N)
# ────────────────────────────

# CPU-cooler ↔ socket (jeden cooler pasuje do wielu socketów i odwrotnie)
# cooler_socket = Table(
#     "cooler_socket",
#     Base.metadata,
#     Column("cooler_id", ForeignKey("cpu_coolers.id"), primary_key=True),
#     Column("socket", String, primary_key=True),
# )

# Case ↔ form-factor (obudowa może wspierać kilka standardów płyt)
# case_form_factor = Table(
#     "case_form_factor",
#     Base.metadata,
#     Column("case_id", ForeignKey("cases.id"), primary_key=True),
#     Column("form_factor", String, primary_key=True),
# )

# ────────────────────────────
#  Core part tables
# ────────────────────────────


class CPU(Base):
    __tablename__ = "cpus"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    socket = Column(String, index=True)  # np. "AM5", "LGA1700"
    graphics = Column(String)
    core_count = Column(Float)
    core_clock = Column(Float)
    boost_clock = Column(Float)
    tdp = Column(Float)  # deklarowany TDP
    smt = Column(Boolean, default=False)  # ma iGPU?
    price = Column(Float)  # w walucie sklepu/API

    def __init__(
        self,
        name,
        socket,
        graphics=None,
        core_count=0.0,
        core_clock=0.0,
        boost_clock=0.0,
        tdp=0.0,
        smt=False,
        price=0.0,
    ):
        super().__init__()
        self.name = name
        self.socket = socket
        self.graphics = graphics
        self.core_count = core_count
        self.core_clock = core_clock
        self.boost_clock = boost_clock
        self.tdp = tdp
        self.smt = smt
        self.price = price

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "socket": self.socket,
            "price": self.price,
            "core_count": self.core_count,
            "core_clock": self.core_clock,
            "boost_clock": self.boost_clock,
            "tdp": self.tdp,
            "smt": self.smt,
            "graphics": self.graphics,
        }

    @classmethod
    def from_dict(self, data: dict):
        return CPU(
            name=data.get("name"),
            socket=data.get("socket"),
            graphics=data.get("graphics"),
            core_count=data.get("core_count", 0.0),
            core_clock=data.get("core_clock", 0.0),
            boost_clock=data.get("boost_clock", 0.0),
            tdp=data.get("tdp", 0.0),
            smt=data.get("smt", False),
            price=data.get("price", 0.0),
        )


class CPUCooler(Base):
    __tablename__ = "cpu_coolers"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    socket = Column(String, index=True)
    color = Column(String)
    size = Column(Float)  # clearance vs case
    price = Column(Float)

    # supported_sockets = relationship(
    #     "CPUCoolerSocket",  # “dummy” mapped class poniżej – czysty String też działa
    #     secondary=cooler_socket,
    #     viewonly=True,
    # )

    def __init__(self, name, socket, color=None, size=0.0, price=0.0):
        super().__init__()
        self.name = name
        self.socket = socket
        self.color = color
        self.size = size
        self.price = price

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "socket": self.socket,
            "color": self.color,
            "size": self.size,
            "price": self.price,
        }

    @classmethod
    def from_dict(self, data):
        return CPUCooler(
            name=data.get("name"),
            socket=data.get("socket"),
            color=data.get("color"),
            size=data.get("size", 0.0),
            price=data.get("price", 0.0),
        )


class GPU(Base):
    __tablename__ = "gpus"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    length = Column(Float)  # ważne dla obudowy
    memory = Column(Float)
    core_clock = Column(Float)
    boost_clock = Column(Float)
    tdp = Column(Float)  # Total Board Power
    price = Column(Float)

    def __init__(
        self,
        name,
        length=0.0,
        memory=0.0,
        core_clock=0.0,
        boost_clock=0.0,
        tdp=0.0,
        price=0.0,
    ):
        super().__init__()
        self.name = name
        self.length = length
        self.memory = memory
        self.core_clock = core_clock
        self.boost_clock = boost_clock
        self.tdp = tdp
        self.price = price

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "length": self.length,
            "memory": self.memory,
            "core_clock": self.core_clock,
            "boost_clock": self.boost_clock,
            "tdp": self.tdp,
            "price": self.price,
        }

    @classmethod
    def from_dict(self, data: dict):
        return GPU(
            name=data.get("name"),
            length=data.get("length", 0.0),
            memory=data.get("memory", 0.0),
            core_clock=data.get("core_clock", 0.0),
            boost_clock=data.get("boost_clock", 0.0),
            tdp=data.get("tdp", 0.0),
            price=data.get("price", 0.0),
        )


class Motherboard(Base):
    __tablename__ = "motherboards"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    socket = Column(String, index=True)  # zgodny z CPU
    # chipset = Column(String)
    form_factor = Column(String)  # ATX / mATX / ITX
    mem_type = Column(String)  # DDR4 / DDR5
    max_memory = Column(Integer)
    memory_slots = Column(Integer)
    # pcie_slots_x16 = Column(Integer)
    m2_slots = Column(Integer)
    # eps_8pin_count = Column(Integer)  # zasilanie CPU
    color = Column(String)
    price = Column(Float)

    def __init__(
        self,
        name,
        socket,
        form_factor=None,
        mem_type=None,
        max_memory=0,
        memory_slots=0,
        m2_slots=0,
        color=None,
        price=0.0,
    ):
        super().__init__()
        self.name = name
        self.socket = socket
        self.form_factor = form_factor
        self.mem_type = mem_type
        self.max_memory = max_memory
        self.memory_slots = memory_slots
        self.m2_slots = m2_slots
        self.color = color
        self.price = price

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "socket": self.socket,
            "form_factor": self.form_factor,
            "mem_type": self.mem_type,
            "max_memory": self.max_memory,
            "memory_slots": self.memory_slots,
            "m2_slots": self.m2_slots,
            "color": self.color,
            "price": self.price,
        }

    @classmethod
    def from_dict(self, data):
        return Motherboard(
            name=data.get("name"),
            socket=data.get("socket"),
            form_factor=data.get("form_factor"),
            mem_type=data.get("mem_type"),
            max_memory=data.get("max_memory", 0),
            memory_slots=data.get("memory_slots", 0),
            m2_slots=data.get("m2_slots", 0),
            color=data.get("color"),
            price=data.get("price", 0.0),
        )


class RAM(Base):
    __tablename__ = "memory"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    mem_type = Column(String)  # DDR4 / DDR5
    capacity_gb = Column(Integer)  # 1 kość!
    sticks = Column(Integer)  # ile w paczce
    speed_mhz = Column(Integer)
    first_word_latency = Column(Float)
    cas_latency = Column(Float)
    color = Column(String)
    price = Column(Float)

    def __init__(
        self,
        name,
        mem_type=None,
        capacity_gb=0,
        sticks=0,
        speed_mhz=0,
        first_word_latency=0.0,
        cas_latency=0.0,
        color=None,
        price=0.0,
    ):
        super().__init__()
        self.name = name
        self.mem_type = mem_type
        self.capacity_gb = capacity_gb
        self.sticks = sticks
        self.speed_mhz = speed_mhz
        self.first_word_latency = first_word_latency
        self.cas_latency = cas_latency
        self.color = color
        self.price = price

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "mem_type": self.mem_type,
            "capacity_gb": self.capacity_gb,
            "sticks": self.sticks,
            "speed_mhz": self.speed_mhz,
            "first_word_latency": self.first_word_latency,
            "cas_latency": self.cas_latency,
            "color": self.color,
            "price": self.price,
        }

    @classmethod
    def from_dict(self, data):
        return RAM(
            name=data.get("name"),
            mem_type=data.get("mem_type"),
            capacity_gb=data.get("capacity_gb", 0),
            sticks=data.get("sticks", 0),
            speed_mhz=data.get("speed_mhz", 0),
            first_word_latency=data.get("first_word_latency", 0.0),
            cas_latency=data.get("cas_latency", 0.0),
            color=data.get("color"),
            price=data.get("price", 0.0),
        )


class PowerSupply(Base):
    __tablename__ = "power_supplies"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    wattage = Column(Integer)
    type = Column(String)  # ATX / SFX / SFX-L
    modular = Column(String)
    efficiency = Column(String)  # 80+ Bronze/Gold/…
    color = Column(String)
    price = Column(Float)

    def __init__(
        self,
        name,
        wattage=0,
        type=None,
        modular=False,
        efficiency=None,
        color=None,
        price=0.0,
    ):
        super().__init__()
        self.name = name
        self.wattage = wattage
        self.type = type
        self.modular = modular
        self.efficiency = efficiency
        self.color = color
        self.price = price

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "wattage": self.wattage,
            "type": self.type,
            "modular": self.modular,
            "efficiency": self.efficiency,
            "color": self.color,
            "price": self.price,
        }

    @classmethod
    def from_dict(self, data):
        return PowerSupply(
            name=data.get("name"),
            wattage=data.get("wattage", 0),
            type=data.get("type"),
            modular=data.get("modular", False),
            efficiency=data.get("efficiency"),
            color=data.get("color"),
            price=data.get("price", 0.0),
        )


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    type = Column(String)  # ATX / SFX
    psu = Column(String)
    max_gpu_length_mm = Column(Float)
    # max_cooler_height_mm = Column(Float)
    internal_35_bays = Column(Integer)  # HDD bays
    side_panel = Column(String)
    color = Column(String)
    price = Column(Float)

    # supported_form_factors = relationship(
    #     "CaseFormFactor",
    #     secondary=case_form_factor,
    #     viewonly=True,
    # )

    def __init__(
        self,
        name,
        type=None,
        psu=None,
        max_gpu_length_mm=0.0,
        internal_35_bays=0,
        side_panel=None,
        color=None,
        price=0.0,
    ):
        super().__init__()
        self.name = name
        self.type = type
        self.psu = psu
        self.max_gpu_length_mm = max_gpu_length_mm
        self.internal_35_bays = internal_35_bays
        self.side_panel = side_panel
        self.color = color
        self.price = price

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "psu": self.psu,
            "max_gpu_length_mm": self.max_gpu_length_mm,
            "internal_35_bays": self.internal_35_bays,
            "side_panel": self.side_panel,
            "color": self.color,
            "price": self.price,
        }

    @classmethod
    def from_dict(self, data):
        return Case(
            name=data.get("name"),
            type=data.get("type"),
            psu=data.get("psu"),
            max_gpu_length_mm=data.get("max_gpu_length_mm", 0.0),
            internal_35_bays=data.get("internal_35_bays", 0),
            side_panel=data.get("side_panel"),
            color=data.get("color"),
            price=data.get("price", 0.0),
        )


class StorageDrive(Base):
    __tablename__ = "storage_drives"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    type = Column(String)  # SSD / HDD
    interface = Column(String)  # SATA / NVMe
    form_factor = Column(String)  # 2.5", 3.5", M.2 2280
    capacity = Column(Integer)  # GB
    cache = Column(Integer)  # MB
    price = Column(Float)

    def __init__(
        self,
        name,
        type=None,
        interface=None,
        form_factor=None,
        capacity=0,
        cache=0,
        price=0.0,
    ):
        super().__init__()
        self.name = name
        self.type = type
        self.interface = interface
        self.form_factor = form_factor
        self.capacity = capacity
        self.cache = cache
        self.price = price

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "interface": self.interface,
            "form_factor": self.form_factor,
            "capacity": self.capacity,
            "cache": self.cache,
            "price": self.price,
        }

    @classmethod
    def from_dict(self, data):
        return StorageDrive(
            name=data.get("name"),
            type=data.get("type"),
            interface=data.get("interface"),
            form_factor=data.get("form_factor"),
            capacity=data.get("capacity", 0),
            cache=data.get("cache", 0),
            price=data.get("price", 0.0),
        )


# ────────────────────────────
#  Fake mapped classes for M:N “viewonly” rels
# ────────────────────────────
# class CPUCoolerSocket(Base):
#     __tablename__ = "cooler_socket"  # reuse table
#     cooler_id = Column(Integer, primary_key=True)
#     socket = Column(String, primary_key=True)


# class CaseFormFactor(Base):
#     __tablename__ = "case_form_factor"  # reuse table
#     case_id = Column(Integer, primary_key=True)
#     form_factor = Column(String, primary_key=True)


# ────────────────────────────
#  Utility – create DB quickly
# ────────────────────────────
if __name__ == "__main__":
    engine = create_engine("sqlite:///pcparts.db")
    Base.metadata.create_all(engine)
