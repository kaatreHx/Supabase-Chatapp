from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Message
from .utils import send_chat_message

@receiver(post_save, sender=Message)
def push_chat_to_supabase(sender, instance, created, **kwargs):
    if created:
        try:
            send_chat_message(instance.sender.id, instance.recipient.id, instance.content)
        except Exception as e:
            print(f"Failed to send to Supabase: {e}")
