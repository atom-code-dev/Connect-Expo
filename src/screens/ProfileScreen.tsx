import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  // Freelancer specific
  skills?: string;
  experience?: string;
  linkedinProfile?: string;
  trainerType?: string;
  // Organization specific
  organizationName?: string;
  website?: string;
  companyLocation?: string;
}

export default function ProfileScreen() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFreelancerFields = () => (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Skills & Frameworks</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter your skills and frameworks"
          value={profileData.skills || ''}
          onChangeText={(text) => setProfileData({...profileData, skills: text})}
          multiline
          numberOfLines={3}
          editable={isEditing}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Experience</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your experience"
          value={profileData.experience || ''}
          onChangeText={(text) => setProfileData({...profileData, experience: text})}
          multiline
          numberOfLines={4}
          editable={isEditing}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>LinkedIn Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="LinkedIn profile URL"
          value={profileData.linkedinProfile || ''}
          onChangeText={(text) => setProfileData({...profileData, linkedinProfile: text})}
          editable={isEditing}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Trainer Type</Text>
        <TextInput
          style={styles.input}
          placeholder="University, Corporate, or Both"
          value={profileData.trainerType || ''}
          onChangeText={(text) => setProfileData({...profileData, trainerType: text})}
          editable={isEditing}
        />
      </View>
    </>
  );

  const renderOrganizationFields = () => (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Organization Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter organization name"
          value={profileData.organizationName || ''}
          onChangeText={(text) => setProfileData({...profileData, organizationName: text})}
          editable={isEditing}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          placeholder="Company website URL"
          value={profileData.website || ''}
          onChangeText={(text) => setProfileData({...profileData, website: text})}
          editable={isEditing}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Company Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter company location"
          value={profileData.companyLocation || ''}
          onChangeText={(text) => setProfileData({...profileData, companyLocation: text})}
          editable={isEditing}
        />
      </View>
    </>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#dc2626" />
        </View>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userRole}>
          {user?.role?.toLowerCase().replace('_', ' ')}
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TouchableOpacity
            onPress={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            style={styles.editButton}
            disabled={isLoading}
          >
            <Ionicons 
              name={isEditing ? "checkmark" : "pencil"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.editButtonText}>
              {isLoading ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={profileData.name}
            onChangeText={(text) => setProfileData({...profileData, name: text})}
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            placeholder="Email address"
            value={profileData.email}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={profileData.phone}
            onChangeText={(text) => setProfileData({...profileData, phone: text})}
            keyboardType="phone-pad"
            editable={isEditing}
          />
        </View>

        {user?.role === 'FREELANCER' && renderFreelancerFields()}
        {user?.role === 'ORGANIZATION' && renderOrganizationFields()}

        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  formContainer: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  editButton: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#dc2626',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});