import json
import os

import redis
from dotenv import load_dotenv

load_dotenv()


class RedisCache:
    """Redis cache manager for API responses"""
    
    _instance = None
    _client = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._client = redis.Redis(
                host=os.getenv("REDIS_HOST", "localhost"),
                port=int(os.getenv("REDIS_PORT", 6379)),
                db=int(os.getenv("REDIS_DB", 0)),
                decode_responses=True
            )
        return cls._instance

    @property
    def client(self) -> redis.Redis:
        return self._client

    def get(self, key: str) -> dict | None:
        """
        Extracts a value from the cache
        
        Args:
            key: Key of the stored value
            
        Returns:
            Deserialized value or None if it doesn't exist
        """
        try:
            value = self._client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception:
            return None

    def set(self, key: str, value: dict, ttl: int | None = None) -> bool:
        """
        Stores a value in the cache
        
        Args:
            key: Key of the value to store in cache
            value: Value to store (must be JSON serializable)
            ttl: Time to live in seconds (uses REDIS_CACHE_TTL 
                 if not specified)
            
        Returns:
            True if stored successfully, False otherwise
        """
        try:
            if ttl is None:
                ttl = int(os.getenv("REDIS_CACHE_TTL", 3600))
            
            serialized = json.dumps(value)
            self._client.setex(key, ttl, serialized)
            return True
        except Exception:
            return False

    def delete(self, key: str) -> bool:
        """
        Deletes a key from the cache
        
        Args:
            key: Key of the value to delete

        Returns:
            True if deleted successfully, False otherwise
        """
        try:
            self._client.delete(key)
            return True
        except Exception:
            return False

    def clear_all(self) -> bool:
        """
        Clears all cache (use with caution)
        
        Returns:
            True if cleared successfully, False otherwise
        """
        try:
            self._client.flushdb()
            return True
        except Exception:
            return False


def get_cache() -> RedisCache:
    """Helper function to get the cache instance"""
    return RedisCache()