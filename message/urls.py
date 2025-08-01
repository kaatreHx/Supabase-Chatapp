from django.urls import path
from .apis import MessageCreateView

urlpatterns = [
    path('send-message/', MessageCreateView.as_view(), name='send_message'),
]