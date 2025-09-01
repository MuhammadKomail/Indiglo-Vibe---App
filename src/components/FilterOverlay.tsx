import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import colors from '../styles/colors';
import {specialties} from '../utils/data';

interface Props {
  onClose: () => void;
  onApply?: (selected: string[], availability: string) => void;
  onClear?: () => void;
}

const FilterOverlay: React.FC<Props> = ({onClose, onApply, onClear}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availability, setAvailability] = useState<
    'Active' | 'Offline' | 'All'
  >('Active');

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  };

  const handleApply = () => {
    onApply?.(selectedTags, availability);
    onClose();
  };

  const handleClear = () => {
    setSelectedTags([]);
    setAvailability('Active');
    onClear?.();
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Filters Section */}
        <Text style={styles.sectionTitle}>Filters</Text>
        <View style={styles.tagsContainer}>
          {specialties.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tag,
                selectedTags.includes(item) && styles.tagSelected,
              ]}
              onPress={() => toggleTag(item)}>
              <Text
                style={[
                  styles.tagText,
                  selectedTags.includes(item) && styles.tagTextSelected,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Availability Section */}
        <Text style={styles.sectionTitle}>Availability</Text>
        <View style={styles.availabilityContainer}>
          {['Active', 'Offline', 'All'].map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.availabilityBtn,
                availability === status && styles.availabilityBtnSelected,
              ]}
              onPress={() => setAvailability(status as any)}>
              <Text
                style={[
                  styles.availabilityText,
                  availability === status && styles.availabilityTextSelected,
                ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
          <Text style={styles.applyText}>Apply Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
          <Text style={styles.clearText}>Clear Filter</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default FilterOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: colors.primary2,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 20,
  },
  tag: {
    borderWidth: 1,
    borderColor: colors.black10,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    // marginRight: 8,
    // marginBottom: 10,
  },
  tagSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: 14,
    color: colors.black,
  },
  tagTextSelected: {
    color: colors.white,
  },
  availabilityContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  availabilityBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.black10,
    paddingVertical: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 8,
  },
  availabilityBtnSelected: {
    backgroundColor: colors.blueHue50,
    borderColor: colors.primary,
  },
  availabilityText: {
    fontSize: 14,
    color: colors.black,
  },
  availabilityTextSelected: {
    color: colors.primary,
    // fontWeight: 'bold',
  },
  applyBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  applyText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  clearBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  clearText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
