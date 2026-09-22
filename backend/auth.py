import secrets
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# password create 
def hash_password(password: str) -> str:
    return pwd_context.hash(password)
# verfiy password 
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
#  genarate token for  crete 
def generate_reset_token() -> str:
    return secrets.token_urlsafe(32)
