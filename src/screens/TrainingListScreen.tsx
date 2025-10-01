import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

interface Training {
  id: string;
  title: string;
  description: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string;
  mode: 'ONLINE' | 'OFFLINE';
  type: 'CORPORATE' | 'UNIVERSITY';
  category: string;
  stack: string;
  openings: number;
  paymentAmount?: number;
}

export default function TrainingListScreen() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'ONLINE' | 'OFFLINE'>('ALL');

  useEffect(() => {
    loadTrainings();
  }, []);

  const loadTrainings = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Mock data
      const mockTrainings: Training[] = [
        {
          id: '1',
          title: 'React Native Development Training',
          description: 'Comprehensive training on React Native for mobile app development.',
          companyName: 'Tech Corp',
          location: 'Bangalore, Karnataka',
          startDate: '2024-02-15',
          endDate: '2024-02-20',
          mode: 'OFFLINE',
          type: 'CORPORATE',
          category: 'FRAMEWORKS',
          stack: 'React Native',
          openings: 2,
          paymentAmount: 15000,
        },
        {
          id: '2',
          title: 'Node.js Backend Development',
          description: 'Learn backend development with Node.js and Express framework.',
          companyName: 'Startup Inc',
          location: 'Remote',
          startDate: '2024-02-20',
          endDate: '2024-02-25',
          mode: 'ONLINE',
          type: 'CORPORATE',
          category: 'FUNDAMENTALS',
          stack: 'Node.js',
          openings: 1,
          paymentAmount: 12000,
        },
        {
          id: '3',
          title: 'Soft Skills for Leadership',
          description: 'Develop leadership and communication skills for professional growth.',
          companyName: 'Business Academy',
          location: 'Mumbai, Maharashtra',
          startDate: '2024-03-01',
          endDate: '2024-03-03',
          mode: 'OFFLINE',
          type: 'UNIVERSITY',
          category: 'SOFT_SKILLS',
          stack: 'Leadership',
          openings: 3,
          paymentAmount: 8000,
        },
      ];
      
      setTrainings(mockTrainings);
    } catch (error) {
      console.error('Error loading trainings:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadTrainings();
  };

  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         training.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         training.stack.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'ALL' || training.mode === filter;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const TrainingCard = ({ training }: { training: Training }) => (
    <TouchableOpacity style={styles.trainingCard}>
      <View style={styles.trainingHeader}>
        <Text style={styles.trainingTitle}>{training.title}</Text>
        <View style={[styles.badge, training.mode === 'ONLINE' ? styles.onlineBadge : styles.offlineBadge]}>
          <Text style={styles.badgeText}>{training.mode}</Text>
        </View>
      </View>
      
      <Text style={styles.companyName}>{training.companyName}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {training.description}
      </Text>
      
      <View style={styles.trainingDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{training.location}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={16} color="#6b7280" />
          <Text style={styles.detailText}>
            {formatDate(training.startDate)} - {formatDate(training.endDate)}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="code-working" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{training.stack}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="people" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{training.openings} openings</Text>
        </View>
      </View>
      
      {training.paymentAmount && (
        <View style={styles.paymentInfo}>
          <Ionicons name="cash" size={16} color="#16a34a" />
          <Text style={styles.paymentAmount}>₹{training.paymentAmount.toLocaleString()}</Text>
        </View>
      )}
      
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
        {user?.role === 'FREELANCER' && (
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search trainings..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.filterContainer}>
          {(['ALL', 'ONLINE', 'OFFLINE'] as const).map((filterOption) => (
            <TouchableOpacity
              key={filterOption}
              style={[
                styles.filterButton,
                filter === filterOption && styles.activeFilterButton
              ]}
              onPress={() => setFilter(filterOption)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === filterOption && styles.activeFilterButtonText
                ]}
              >
                {filterOption}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading trainings...</Text>
          </View>
        ) : filteredTrainings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>No trainings found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try adjusting your search query' : 'Check back later for new opportunities'}
            </Text>
          </View>
        ) : (
          <View style={styles.trainingsContainer}>
            {filteredTrainings.map((training) => (
              <TrainingCard key={training.id} training={training} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  activeFilterButton: {
    backgroundColor: '#dc2626',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  trainingsContainer: {
    padding: 20,
    gap: 16,
  },
  trainingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trainingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  trainingTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginRight: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onlineBadge: {
    backgroundColor: '#dbeafe',
  },
  offlineBadge: {
    backgroundColor: '#dcfce7',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
  },
  companyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  trainingDetails: {
    gap: 6,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#dc2626',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
});