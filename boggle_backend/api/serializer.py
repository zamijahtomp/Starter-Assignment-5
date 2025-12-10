from rest_framework import serializers
from .models import Games

# creating a model class below
class GamesSerializer(serializers.ModelSerializer):
    class Meta:
            model = Games
            fields = '__all__'