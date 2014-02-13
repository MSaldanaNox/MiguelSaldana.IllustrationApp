from django.conf.urls import patterns, include, url
from django.conf import settings
from django.conf.urls.static import static

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'IllustrationSS.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^$', 'MyIllustration.views.home', name='home'),
    url(r'test', 'MyIllustration.views.test', name='test'),
    url(r'saveImage', 'MyIllustration.views.saveImage', name='saveImage'),
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
