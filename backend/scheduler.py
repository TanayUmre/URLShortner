from apscheduler.schedulers.background import BackgroundScheduler
from crud import delete_expired_urls

scheduler=BackgroundScheduler()

scheduler.add_job(delete_expired_urls,"interval",hours=6,id="delete_expired_urls",replace_existing=True)

def start_scheduler():
    scheduler.start()
    print("Cleanup scheduler started. Runs every 6 hours.")

def stop_scheduler():
    scheduler.shutdown()
    print("Cleanup scheduler stopped.")