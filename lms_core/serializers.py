from rest_framework import serializers
from .models import Category, Course, Enrollment
from users.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.ReadOnlyField(source='instructor.username')
    category_name = serializers.ReadOnlyField(source='category.name')
    category_detail = CategorySerializer(source='category', read_only=True)
    instructor_detail = UserSerializer(source='instructor', read_only=True)

    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ('instructor', 'created_at', 'updated_at')

class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.ReadOnlyField(source='course.title')
    student_name = serializers.ReadOnlyField(source='student.username')
    course_detail = CourseSerializer(source='course', read_only=True)

    class Meta:
        model = Enrollment
        fields = '__all__'
        read_only_fields = ('student', 'enrolled_at')
