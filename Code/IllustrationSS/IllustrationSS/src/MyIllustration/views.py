from django.shortcuts import render, render_to_response
from django.template import Context
from django.core import serializers
from django.utils.encoding import smart_str
from django.core.servers.basehttp import FileWrapper
from django.http import HttpResponse
import re
import base64
import os

# Create your views here.
def home(request):
    return render(request, 'home.html')
def test(request):
    return render(request, 'layersTest.html')

def saveImage(request):
    if request.POST:
        dataUrlPattern = re.compile('data:image/(png|jpeg);base64,(.*)$')
        ImageData = request.POST.get('imgBase64')
        print(ImageData);
        ImageData = dataUrlPattern.match(ImageData).group(2)
        
        # If none or len 0, means illegal image data
        if (ImageData == None or len(ImageData)) == 0:
            # PRINT ERROR MESSAGE HERE
            print('Error')
         
        # Decode the 64 bit string into 32 bit
        ImageData = base64.b64decode(ImageData)
        fh = open("imageToSave.png", "wb")
        fh.write(ImageData)
        fh.close
        
        filename = "imageToSave.png" # Select your file here.                                
        wrapper = FileWrapper(open("imageToSave.png", "rb"))
        response = HttpResponse(wrapper, content_type='image/png')
        response['Content-Length'] = os.path.getsize(filename)
        response['Content-Disposition'] = 'attachment; filename="image.png"'
        return response
#         response = HttpResponse(content_type='application/force-download')
#         response['Content-Disposition'] = 'attachment; filename=%s' % smart_str("imageToSave.png")
#         response['X-Sendfile'] = smart_str("\static\images\pen.png")
#         return response

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