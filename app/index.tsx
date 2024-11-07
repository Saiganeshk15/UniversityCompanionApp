import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../src/api/api';

export default function CourseListScreen() {
    const [courses, setCourses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modal1Visible, setModal1Visible] = useState(false);
    const [courseName, setCourseName] = useState('');
    const [professor, setProfessor] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [course, setCourse] = useState<any>({});
    const router = useRouter();

    useEffect(() => {
        fetchCourses();
    }, []);
    useEffect(() => {
        if (Platform.OS === 'web') {
            document.title = "Courses";
        }
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await getCourses();
            setCourses(data);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        }
    };

    const handleAddCourse = async () => {
        if (!courseName || !startDate || !endDate) {
            alert('Please fill out all required fields');
            return;
        }
        try {
            const newCourse = {
                course_name: courseName,
                professor: professor,
                start_date: startDate,
                end_date: endDate,
            };
            await createCourse(newCourse);
            setModalVisible(false);
            fetchCourses();
            setCourseName('');
            setProfessor('');
            setStartDate('');
            setEndDate('');
        } catch (error) {
            console.error('Failed to add course:', error);
        }
    };
    const handleUpdateCourse = async () => {
        if (courseName === course.course_name && professor === course.professor && startDate === course.start_date.split('T')[0] && endDate === course.end_date.split('T')[0]) {
            alert("Change values to update course");
            return ;
        }
        try {
            course.course_name = courseName;
            course.start_date = startDate;
            course.end_date = endDate;
            course.professor = professor;
            await updateCourse(course);
        } catch (e) {
            console.error("Failed to update course", e);
        }
        setModal1Visible(false);
        fetchCourses();
    };
    const handleDeleteCourse = async (courseId: any) => {
        await deleteCourse(courseId);
        fetchCourses();
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={courses}
                keyExtractor={(item: any) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.courseContainer}
                        onPress={() => router.push(`/assignments?courseId=${item.id}`)}
                    >
                        <Text style={styles.courseName}>{item.course_name}</Text>
                        <Text style={{marginHorizontal: 10,}}>{item.professor}</Text>
                        <Text style={styles.dates}>{item.start_date.split('T')[0] + " - " + item.end_date.split('T')[0]}</Text>
                        <View style={styles.buttonsContainer}>
                            <View style={styles.buttons}><Button title="Update"
                                onPress={() => {setCourse(item); setModal1Visible(true); setCourseName(item.course_name); setProfessor(item.professor);
                                    setStartDate(item.start_date.split('T')[0]); setEndDate(item.end_date.split('T')[0]);
                                }} /></View>
                            <View style={styles.buttons}><Button title="Delete" onPress={() => {handleDeleteCourse(item.id)}} /></View>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <Button title="Add Course" onPress={() => setModalVisible(true)} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Course</Text>
                        <TextInput
                            placeholder="Course Name"
                            value={courseName}
                            onChangeText={setCourseName}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Professor"
                            value={professor}
                            onChangeText={setProfessor}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Start Date (YYYY-MM-DD)"
                            value={startDate}
                            onChangeText={setStartDate}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="End Date (YYYY-MM-DD)"
                            value={endDate}
                            onChangeText={setEndDate}
                            style={styles.input}
                        />
                        <Button title="Submit" onPress={handleAddCourse} />
                        <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modal1Visible}
                onRequestClose={() => setModal1Visible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Course</Text>
                        <TextInput
                            placeholder="Course Name"
                            value={courseName}
                            onChangeText={setCourseName}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Professor"
                            value={professor}
                            onChangeText={setProfessor}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Start Date (YYYY-MM-DD)"
                            value={startDate}
                            onChangeText={setStartDate}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="End Date (YYYY-MM-DD)"
                            value={endDate}
                            onChangeText={setEndDate}
                            style={styles.input}
                        />
                        <Button title="Submit" onPress={handleUpdateCourse} />
                        <Button title="Cancel" color="red" onPress={() => setModal1Visible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    courseName: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
    },
    dates: {
        fontSize: 15,
        fontWeight: "400",
        margin: 10,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    courseContainer: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
      },
      buttonsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    buttons: {
        width: "30%",
        margin: 2,
        fontSize: 20,
    },
});
