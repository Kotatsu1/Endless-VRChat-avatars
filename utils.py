import asyncio
import functools
from pydantic import ValidationError


def syncify(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

        return loop.run_until_complete(func(*args, **kwargs))

    return wrapper


def pydantic_validate(model):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(self, obj):
            try:
                validated_model = model.model_validate(obj)
            except ValidationError as e:
                return {"error": str(e)}

            result = func(self, validated_model)
            return result
        return wrapper
    return decorator
