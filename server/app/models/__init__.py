"""
SQLAlchemy модели

Содержит все модели базы данных.
"""

from .user import User
from .post import Post, posts_users

__all__ = ["User", "Post", "posts_users"]