from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models, schemas, auth
from database import engine, get_db

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Auth API")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "FastAPI Auth Server is running"}

# 1. SIGNUP ROUTE
@app.post("/api/signup", status_code=status.HTTP_201_CREATED)
def signup(user: schemas.UserSignup, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )

    hashed_pwd = auth.hash_password(user.password)
    new_user = models.User(email=user.email, password=hashed_pwd)
    
    db.add(new_user)
    db.commit()

    return {"message": "User registered successfully"}

# 2. LOGIN ROUTE
@app.post("/api/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid email or password"
        )

    return {"message": "Login successful", "user_id": db_user.id}

# 3. FORGOT PASSWORD ROUTE
@app.post("/api/forgot-password")
def forgot_password(user: schemas.ForgotPassword, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    # Generic message to prevent email enumeration
    generic_response = {"message": "If the email is registered, a reset link has been sent."}
    
    if not db_user:
        return generic_response
    
    token = auth.generate_reset_token()
    db_user.reset_token = token
    db.commit()
    
    # TODO: Send token via email background task here
    return generic_response

# 4. RESET PASSWORD ROUTE
@app.post("/api/reset-password")
def reset_password(data: schemas.ResetPassword, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.reset_token == data.token).first()
    
    if not db_user or not data.token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Invalid or expired reset token"
        )
    
    db_user.password = auth.hash_password(data.new_password)
    db_user.reset_token = None  # Invalidate token after use
    db.commit()
    
    return {"message": "Password reset successfully. You can now log in."}