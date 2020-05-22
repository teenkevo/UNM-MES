from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import (
    ListView, 
    DetailView,
    CreateView,
    UpdateView,
    DeleteView
)    
from .models import MLAlgorithm

# Create your views here.

#Function based views (not used now -for later)
def home(request):
    context = {
        'algorithms': MLAlgorithm.objects.all()
    }
    return render(request, 'control_system/home.html', context)

#Class based views replacing the function based views above
class AlgorithmListView(ListView):
    model = MLAlgorithm #the model to query in this list view.
    template_name = 'control_system/home.html' #template name to override default naming convention <app>/<model>_<viewtype>.html.
    context_object_name = 'algorithms' #name given to algorithm objects being looped over in the html template.
    ordering = ['-created_at'] #sorting algorithms from newest to oldest.

class AlgorithmDetailView(DetailView):
    model = MLAlgorithm 

class AlgorithmCreateView(LoginRequiredMixin, CreateView):
    model = MLAlgorithm
    fields = ['name', 'description', 'version', 'parent_endpoint' ]

    #Overriding the default form_valid method; Attributing the logged in facility manager 
    #to be the owner/creater of the algorithm instance before it is created.
    def form_valid(self, form):
        form.instance.owner = self.request.user
        return super().form_valid(form)

class AlgorithmUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = MLAlgorithm
    fields = ['name', 'description', 'version', 'parent_endpoint' ]

    #Overriding the default form_valid method; Attributing the logged in facility manager 
    #to be the owner/creater of the algorithm instance before it is created.
    def form_valid(self, form):
        form.instance.owner = self.request.user
        return super().form_valid(form)

    #Attributing the logged in facility manager to only update algorithm instances they added.
    def test_func(self):
        algorithm = self.get_object()
        if self.request.user == algorithm.owner:
            return True
        return False

class AlgorithmDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = MLAlgorithm 
    success_url = '/'

    #Attributing the logged in facility manager to only delete algorithm instances they added.
    def test_func(self):
        algorithm = self.get_object()
        if self.request.user == algorithm.owner:
            return True
        return False

    

def about(request):
    return render(request, 'control_system/about.html', {'algorithm': 'About'})