from django.urls import path, include
from .apis import UserViewSet, LoginView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'profile', UserViewSet, basename='profile')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
]
