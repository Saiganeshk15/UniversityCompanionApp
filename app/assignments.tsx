import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getAssignments, createAssignment, updateAssignment, deleteAssignment, completeAssignemnt } from '../src/api/api';

type Assignment = {
    id: number;
    courseid: number;
    due_date: string;
    title: string;
    status: string;
};

export default function AssignmentsScreen() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modal1Visible, setModal1Visible] = useState(false);
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [item, setItem] = useState<any>({});
    
    const router = useRouter();
    const { courseId } = useLocalSearchParams<{ courseId: string }>();

    useEffect(() => {
        if (courseId) {
            fetchAssignments();
        }
    }, [courseId,]);
    useEffect(() => {
        if (Platform.OS === 'web') {
            document.title = "Courses";
        }
    }, []);

    const fetchAssignments = async () => {
        try {
            const data = await getAssignments(Number(courseId));
            setAssignments(data);
        } catch (error) {
            console.error('Failed to fetch assignments:', error);
        }
    };

    const handleAddAssignment = async () => {
        if (!assignmentTitle || !dueDate) {
            alert('Please fill out all required fields');
            return;
        }
        try {
            const newAssignment = {
                title: assignmentTitle,
                due_date: dueDate,
            };
            await createAssignment(parseInt(courseId), newAssignment);
            setModalVisible(false);
            fetchAssignments();
            setAssignmentTitle('');
            setDueDate('');
        } catch (error) {
            console.error('Failed to add assignment:', error);
        }
    };
    const handleUpdate = () => {
        if (assignmentTitle == item.title && dueDate == item.due_date.split('T')[0]) {
            alert('Please change fields to update');
            return;
        }
        item.title = assignmentTitle;
        item.due_date = dueDate;
        try{
            updateAssignment(item);
        } catch (e) {
            console.error("Failed to update assignment details", e);
        }
        setModal1Visible(false);
    };

    const handleUpdates = () => {
        console.log("kjdfk");
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={assignments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View id={item.id.toString()} style={item.status === 'pending' ? styles.assignmentContainer : styles.assignmentCompletedContainer}>
                        <Text style={styles.assignmentTitle}>{item.title}</Text>
                        <Text style={styles.dueDate}>Due Date: {item.due_date.split('T')[0]}</Text>
                        <Text style={styles.status}>Status: {item.status}</Text>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity onPress={() => {setModal1Visible(true); setItem(item); 
                                setAssignmentTitle(item.title); setDueDate(item.due_date.split('T')[0])}}><Text style={styles.buttons}>Update</Text></TouchableOpacity>
                            <TouchableOpacity onPress={async () => {await deleteAssignment(item.id); fetchAssignments()}}><Text style={styles.buttons}>Delete</Text></TouchableOpacity>
                            <TouchableOpacity onPress={async () => {await completeAssignemnt(item.id); fetchAssignments()}}><Text style={styles.buttons}>{item.status === 'pending' ? "Complete" : "Completed"} </Text></TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <Button title="Add Assignment" onPress={() => {setModalVisible(true); setAssignmentTitle(''); setDueDate('')}} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Assignment</Text>
                        <TextInput
                            placeholder="Assignment Title"
                            value={assignmentTitle}
                            onChangeText={setAssignmentTitle}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Due Date (YYYY-MM-DD)"
                            value={dueDate}
                            onChangeText={setDueDate}
                            style={styles.input}
                        />
                        <Button title="Submit" onPress={handleAddAssignment} />
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
                        <Text style={styles.modalTitle}>Update Assignment</Text>
                        <TextInput
                            placeholder="Assignment Title"
                            value={assignmentTitle}
                            onChangeText={setAssignmentTitle}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Due Date (YYYY-MM-DD)"
                            value={dueDate}
                            onChangeText={setDueDate}
                            style={styles.input}
                        />
                        <Button title="Update" onPress={handleUpdate} />
                        <Button title="Cancel" color="red" onPress={() => setModal1Visible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    assignmentCompletedContainer: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#69ff1e',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
      },
    assignmentContainer: {
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
    assignmentTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginHorizontal: 10,
    },
    dueDate: {
        margin: 10,
        fontWeight: "400",
    },
    status: {
        marginHorizontal: 10,
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
    },
    buttons: {
        margin: 2,
        fontSize: 18,
        backgroundColor: "skyblue",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        borderRadius: 5,
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
});
