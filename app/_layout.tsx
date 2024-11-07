import React from 'react';
import { Stack } from 'expo-router';
import 'react-native-gesture-handler';

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Courses' }} />
            <Stack.Screen name="assignments" options={{ title: 'Assignments' }} />
        </Stack>
    );
}
