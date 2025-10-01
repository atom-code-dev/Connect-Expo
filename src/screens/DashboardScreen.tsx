import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

interface DashboardStats {
  totalTrainings?: number;
  activeTrainings?: number;
  completedTrainings?: number;
  pendingApplications?: number;
}

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();
  const [stats, setStats] = useState<DashboardStats>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // TODO: Fetch updated data
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'FREELANCER':
        return (
          <>
            <Text style={styles.welcomeText}>
              Welcome back, {user.name || 'Trainer'}!
            </Text>
            <Text style={styles.subtitle}>
              Manage your training opportunities and track your progress.
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons name="calendar" size={24} color="#dc2626" />
                <Text style={styles.statNumber}>{stats.activeTrainings || 0}</Text>
                <Text style={styles.statLabel}>Active Trainings</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
                <Text style={styles.statNumber}>{stats.completedTrainings || 0}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('TrainingList' as never)}
              >
                <Ionicons name="search" size={20} color="white" />
                <Text style={styles.actionButtonText}>Browse Trainings</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => navigation.navigate('Profile' as never)}
              >
                <Ionicons name="person" size={20} color="#dc2626" />
                <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                  Update Profile
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );

      case 'ORGANIZATION':
        return (
          <>
            <Text style={styles.welcomeText}>
              Welcome back, {user.name || 'Organization'}!
            </Text>
            <Text style={styles.subtitle}>
              Manage your training postings and find the right trainers.
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons name="briefcase" size={24} color="#dc2626" />
                <Text style={styles.statNumber}>{stats.totalTrainings || 0}</Text>
                <Text style={styles.statLabel}>Posted Trainings</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="hourglass" size={24} color="#f59e0b" />
                <Text style={styles.statNumber}>{stats.pendingApplications || 0}</Text>
                <Text style={styles.statLabel}>Pending Applications</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => navigation.navigate('TrainingList' as never)}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.actionButtonText}>Post New Training</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => navigation.navigate('Profile' as never)}
              >
                <Ionicons name="business" size={20} color="#dc2626" />
                <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                  Organization Profile
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );

      default:
        return (
          <>
            <Text style={styles.welcomeText}>
              Welcome to Atom Connect!
            </Text>
            <Text style={styles.subtitle}>
              Your dashboard is loading...
            </Text>
          </>
        );
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>
              {user?.role?.toLowerCase().replace('_', ' ')} panel
            </Text>
          </View>
          <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {getDashboardContent()}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionGrid}>
          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('Profile' as never)}
          >
            <Ionicons name="person-circle" size={32} color="#dc2626" />
            <Text style={styles.quickActionLabel}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => navigation.navigate('TrainingList' as never)}
          >
            <Ionicons name="list" size={32} color="#dc2626" />
            <Text style={styles.quickActionLabel}>Trainings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem}>
            <Ionicons name="notifications" size={32} color="#dc2626" />
            <Text style={styles.quickActionLabel}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem}>
            <Ionicons name="settings" size={32} color="#dc2626" />
            <Text style={styles.quickActionLabel}>Settings</Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#dc2626',
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  quickActionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickActionItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
});