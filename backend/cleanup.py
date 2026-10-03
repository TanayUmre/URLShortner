from crud import delete_expired_urls

deleted=delete_expired_urls()

print(f"Deleted {deleted} expired URLs")