from django.contrib import admin
from .models import Endpoint
from .models import MLAlgorithm
from .models import MLAlgorithmStatus

# Register your models here.

admin.site.register(Endpoint)
admin.site.register(MLAlgorithm)
admin.site.register(MLAlgorithmStatus)
