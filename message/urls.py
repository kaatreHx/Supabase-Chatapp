from django.urls import path
from .apis import MessageCreateView, ChatHistoryView

urlpatterns = [
    path('send-message/', MessageCreateView.as_view(), name='send_message'),
    path("history/<int:user_id>/", ChatHistoryView.as_view(), name="chat_history"),

]