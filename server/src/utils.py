from datetime import datetime, timedelta
from passlib.context import CryptContext
from models import TokenPayload
from jose import jwt

from settings import get_settings

settings = get_settings()

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_context.verify(password, hashed_password)


def create_access_token(username: str) -> str:
    expires_delta = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    encode_data = {"exp": expires_delta, "username": username}
    return jwt.encode(encode_data, settings.JWT_SECRET_KEY, settings.JWT_ALGORITHM)

def decode_jwt(token: str) -> TokenPayload:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        return TokenPayload(**payload)

def create_refresh_token(username: str) -> str:
    expires_delta = datetime.utcnow() + timedelta(
        minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES
    )
    encode_data = {"exp": expires_delta, "username": username}
    return jwt.encode(
        encode_data, settings.JWT_REFRESH_SECRET_KEY, settings.JWT_ALGORITHM
    )

# расчет MAPK@10
def apk(actual, predicted, k=10):
    if not actual:
        return 0.0

    if len(predicted) > k:
        predicted = predicted[:k]

    score = 0.0
    num_hits = 0.0

    for i, p in enumerate(predicted):
        if p in actual and p not in predicted[:i]:
            num_hits += 1.0
            score += num_hits / (i + 1.0)

    return score / min(len(actual), k)

def mapk(actual, predicted, k=10):
    return np.mean([apk(a, p, k) for a, p in zip(actual, predicted)])