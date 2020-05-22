from django.urls import path
from .views import (
    AlgorithmListView, 
    AlgorithmDetailView, 
    AlgorithmCreateView,
    AlgorithmUpdateView,
    AlgorithmDeleteView
)
from . import views

urlpatterns = [
    path('', AlgorithmListView.as_view(), name = 'control-system-home'),
    path('algorithm/<int:pk>/', AlgorithmDetailView.as_view(), name = 'algorithm-detail'),
    path('algorithm/new/', AlgorithmCreateView.as_view(), name = 'algorithm-create'),
    path('algorithm/<int:pk>/update/', AlgorithmUpdateView.as_view(), name = 'algorithm-update'),
    path('algorithm/<int:pk>/delete/', AlgorithmDeleteView.as_view(), name = 'algorithm-delete'),
    path('about/', views.about, name = 'control-system-about')
]