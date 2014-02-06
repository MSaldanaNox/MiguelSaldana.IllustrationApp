from django.shortcuts import render, render_to_response
from django.template import Context
from django.core import serializers
from django.http import *
import json
import re
import base64
# Create your views here.
def home(request):
    return render(request, 'home.html')


def saveImage(request):
    print('save method')
    if request.POST:
        print('WOOOOOOOOOOW')
        dataUrlPattern = re.compile('data:image/(png|jpeg);base64,(.*)$')
        ImageData = request.POST.get('imgBase64')
        ImageData = dataUrlPattern.match(ImageData).group(2)
         
        # If none or len 0, means illegal image data
        if (ImageData == None or len(ImageData)) == 0:
            # PRINT ERROR MESSAGE HERE
            print('Error')
         
        # Decode the 64 bit string into 32 bit
        ImageData = base64.b64decode(ImageData)
    print('Posted')
    return render(request ,'home.html')

# def about(request):
#     return render(request,'about.html')
# 
# def projects(request):
#     return render(request,'projects.html')
# 
# def illustrations(request):
#     return render(request,'illustrations.html')
# 
# def templates(request):
#     return render(request,'templates.html')
# 
# def get_all_projects(request):
#     # {name:'projectname"  }
#     data = serializers.serialize('json', Project.objects.all())
#     print(data)
#     return HttpResponse(data,content_type="application/json")