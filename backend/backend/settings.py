INSTALLED_APPS = [
    # ...
    'rest_framework',
    'corsheaders',
    'restaurant_app',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...
]

CORS_ALLOW_ALL_ORIGINS = True  # 本番は制限推奨
# ... 既存の設定 ... 