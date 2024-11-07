import axios from 'axios';
import { Platform } from 'react-native';

const api = axios.create({
    baseURL: `https://universitycompanionbackend.onrender.com`,
});

export const getCourses = async () => {
    const response = await api.get('/courses');
    return response.data;
};

export const createCourse = async (courseData: any) => {
    const response = await api.post('/courses', courseData);
    return response.data;
};

export const updateCourse = async (courseData: any) => {
    const response = await api.patch('/course', courseData);
    return response.data;
}

export const deleteCourse = async (courseId: number) => {
    const response = await api.delete(`/course/${courseId}`)
    return response.data;
};

export const getAssignments = async (courseId: number) => {
    const response = await api.get(`/courses/${courseId}/assignments`);
    return response.data;
};

export const createAssignment = async (courseId: number, assignmentData: { title: string, due_date: string }) => {
    const data = { ...assignmentData, course_id: courseId };
    const response = await api.post(`/assignments`, data);
    return response.data;
};

export const updateAssignment = async (item: any) => {
    const response = await api.patch(`/assignments`, item);
    return response.data;
};

export const deleteAssignment = async (assignmentId: number) => {
    const response = await api.delete(`/assignment/${assignmentId}`);
    return response.data;
};

export const completeAssignemnt = async (assignmentId: number) => {
    const data = { status: 'completed'};
    const response = await api.patch(`/assignments/${assignmentId}`, data);
    return response.data;
};


export default api;
