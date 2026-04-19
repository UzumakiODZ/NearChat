import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const PreferenceSetter = () => {
    const [distance, setDistance] = useState(1);
    const [age, setAge] = useState(18);
    const genders = ['Male', 'Female', 'Both'];
    const [selectedGender, setSelectedGender] = useState(genders[2]);
    const [open, setOpen] = useState(true);

    if (open) {
        return (
            <View style={styles.toggleContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={() => setOpen(false)}>
                    <FontAwesome name="sliders" size={20} color="#111827" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.opencontainer}>
            <View style={styles.toggleContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={() => setOpen(true)}>
                    <FontAwesome name="close" size={20} color="#111827" />
                </TouchableOpacity>
            </View>
            <View style={styles.userSlider}>
                <Text>Distance</Text>
                <View style={styles.labelsRow}>
                    <Text>1</Text>
                    <Text>{distance}</Text>
                    <Text>150+</Text>
                </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={150}
                        step={1}
                        minimumTrackTintColor="#1EB1FC"
                        maximumTrackTintColor="#1EB1FC"
                        thumbTintColor="#1EB1FC"
                        value={distance}
                        onValueChange={(value) => setDistance(value)}
                    />
            </View>
            <View>
                <Text>Age</Text>
                <View style={styles.labelsRow}>
                    <Text>18</Text>
                    <Text>{age}</Text>
                    <Text>100+</Text>
                </View>
                <Slider
                    style={styles.slider}
                    minimumValue={18}
                    maximumValue={100}
                    step={1}
                    minimumTrackTintColor="#1EB1FC"
                    maximumTrackTintColor="#1EB1FC"
                    thumbTintColor="#1EB1FC"
                    value={age}
                    onValueChange={(value) => setAge(value)}
                />
            </View>
            <View>
                <Text> Gender </Text>
                <Picker
                    selectedValue={selectedGender}
                    onValueChange={(itemValue) => setSelectedGender(itemValue)}
                >
                    {genders.map((gender) => (
                        <Picker.Item key={gender} label={gender} value={gender} />
                    ))}
                </Picker>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    opencontainer: {
        padding: 20,
        position: 'absolute',
        top: 0,
        marginBottom: 20,
        height: '100%',
        zIndex: 4,
        backgroundColor: '#FFFFFF',
        width: '100%',
    },
    toggleContainer: {
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
    },
    iconButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    userSlider: {
        marginTop: 15,
        width: '100%',
    },
    labelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    slider: {
        height: 40,
    },
});

export default PreferenceSetter;