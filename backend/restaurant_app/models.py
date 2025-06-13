from django.db import models

class Restaurant(models.Model):
    name = models.CharField(max_length=255)
    photo = models.ImageField(upload_to='restaurant_photos/', blank=True, null=True)
    memo = models.TextField(blank=True)
    lat = models.FloatField()
    lng = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_favorite = models.BooleanField(default=False)
    # ユーザー管理をする場合はuser = models.ForeignKey(User, on_delete=models.CASCADE)なども追加 