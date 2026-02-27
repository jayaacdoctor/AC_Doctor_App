import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  SectionList,
  Alert,
  Animated,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { COLORS, Fonts } from '../../utils/colors';
import images from '../../assets/images';
import Header from '../../components/Header';
import AppText from '../../components/AppText';
import { DeleteNotification, getTNotification } from '../../api/profileApi';
import { store } from '../../redux/store';


const NotificationScreeen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [allNotifications, setAllNotifications] = useState([]);
  const user = store?.getState()?.auth?.user;
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);



  const [filteredNotifications, setFilteredNotifications] = useState([]);

  useEffect(() => {
    fetchNotification(1)
  }, [])

  // --- Convert notifications to sections grouped by date
  useEffect(() => {
    const grouped = allNotifications.reduce((acc, notif) => {
      const created = new Date(notif.createdAt);

      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let key;

      if (created.toDateString() === today.toDateString()) {
        key = 'Today';
      } else if (created.toDateString() === yesterday.toDateString()) {
        key = 'Yesterday';
      } else {
        key = created.toLocaleDateString(); // Example: 25/02/2026
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(notif);

      return acc;
    }, {});

    const sections = Object.keys(grouped).map(date => ({
      title: date,
      data: grouped[date],
    }));

    setFilteredNotifications(sections);
  }, [allNotifications]);


  // Search Filter
  useEffect(() => {
    let sourceData = allNotifications;

    if (searchText) {
      sourceData = allNotifications.filter(n => {
        const textMatch = n?.text
          ?.toLowerCase()
          .includes(searchText.toLowerCase());

        const dateString = new Date(n.createdAt)
          .toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
          .toLowerCase();

        const dateMatch = dateString.includes(searchText.toLowerCase());

        return textMatch || dateMatch;
      });
    }

    const grouped = sourceData.reduce((acc, notif) => {
      const created = new Date(notif.createdAt);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let key;

      if (created.toDateString() === today.toDateString()) {
        key = 'Today';
      } else if (created.toDateString() === yesterday.toDateString()) {
        key = 'Yesterday';
      } else {
        key = created.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }

      if (!acc[key]) acc[key] = [];
      acc[key].push(notif);

      return acc;
    }, {});

    const sections = Object.keys(grouped).map(date => ({
      title: date,
      data: grouped[date],
    }));

    setFilteredNotifications(sections);
  }, [searchText, allNotifications]);



  //   delete single notification
  const deleteNotification = async (id) => {
    try {
      // Optimistic UI update (remove immediately)
      setAllNotifications(prev =>
        prev.filter(n => n._id !== id)
      );

      // Call API
      const res = await DeleteNotification(id);

      console.log('Delete Response ---', res);

    } catch (error) {
      console.log('Delete Error ---', error);
    }
  };

  //   delete all notifications
  const deleteAll = () => {
    Alert.alert('Clear All', 'Delete all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setAllNotifications([]),
      },
    ]);
  };

  //   render right action for swipeable
  const renderRightActions = (progress, dragX, id) => {
    const scale = dragX.interpolate({
      inputRange: [-90, 0],
      outputRange: [1, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <RectButton
        style={styles.deleteBtn}
        onPress={() => deleteNotification(id)}
      >
        <Animated.Image
          source={images.Whitedelete}
          style={[styles.trashIcon, { transform: [{ scale }] }]}
        />
      </RectButton>
    );
  };

  const formatNotificationTime = (date) => {
    const created = new Date(date);
    const now = new Date();

    const diffInMs = now - created;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    // If within 24 hours
    if (diffInHours < 24) {
      return 'Today';
    }

    // If same year → show Feb 24
    if (created.getFullYear() === now.getFullYear()) {
      return created.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }

    // If older year → show Feb 24, 2024
    return created.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };


  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotification(nextPage);
    }
  };


  const fetchNotification = async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const data = {
        page: pageNumber,
        limit: 10,
      };

      const res = await getTNotification(data);
      const newData = res?.data || [];
      console.log('arrya of notific---->', newData);

      if (pageNumber === 1) {
        setAllNotifications(newData);
      } else {
        setAllNotifications(prev => [...prev, ...newData]);
      }

      // If returned items less than 10, stop pagination
      if (newData.length < 10) {
        setHasMore(false);
      }

    } catch (error) {
      console.log('Pagination error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };


  const renderNotification = ({ item }) => {
    return (
      <Swipeable
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item?._id)
        }
        overshootRight={false}
      >
        <View
          style={[
            styles.notifCard,
            { backgroundColor: item?.isChecked ? '#fff' : '#F2F8FF' },
          ]}
        >
          <Image
            source={images.Ac_logo}
            style={styles.notifImage}
            resizeMode="contain"
          />

          <View style={styles.notifContent}>
            <AppText style={styles.notifTitle} numberOfLines={1}>
              {item?.text}
            </AppText>

            <AppText style={styles.notifMessage} numberOfLines={2}>
              {item?.text}
            </AppText>
          </View>

          <AppText style={styles.notifTime}>
            {formatNotificationTime(item?.createdAt)}
          </AppText>
        </View>
      </Swipeable>
    );
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <AppText style={styles.sectionHeader}>{title}</AppText>
  );

  // Empty State
  if (allNotifications.length === 0) {
    return (
      <View style={styles.container}>
        <Header
          title="Notifications"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.emptyContainer}>
          <View style={styles.bellContainer}>
            <Image
              source={images.notify}
              style={styles.bellImage}
            />
            <View style={styles.badge}>
              <AppText style={styles.badgeText}>0</AppText>
            </View>
          </View>

          <AppText style={styles.emptyTitle}>
            No Notification to show
          </AppText>

          <AppText style={styles.emptySubtitle}>
            You currently have no notifications. We will notify you when something new happens!
          </AppText>
        </View>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Header title="Notifications" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1, marginHorizontal: wp(3) }}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Image source={images.searchIcon} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#aaa"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => Keyboard.dismiss()}
            allowFontScaling={false}
            includeFontPadding={false}
          />
        </View>

        {/* Clear All Button */}
        {allNotifications.length > 0 && (
          <TouchableOpacity style={styles.clearAllBtn} onPress={deleteAll}>
            <AppText style={styles.clearAllText}>Clear All</AppText>
          </TouchableOpacity>
        )}

        {/* Notifications List */}
        <SectionList
          sections={filteredNotifications}
          keyExtractor={item => item._id}
          renderItem={renderNotification}
          renderSectionHeader={renderSectionHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" style={{ marginVertical: 20 }} />
            ) : null}
        />
      </View>
    </View>
  );
};

// ====================== STYLES ======================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: hp(2),
    paddingHorizontal: wp(3),
    borderRadius: wp(8),
    borderWidth: wp(0.1),
    borderColor: COLORS.textColor,
  },
  searchIcon: {
    width: wp(4.5),
    height: wp(4.5),
    tintColor: '#aaa',
    marginRight: wp(2),
  },
  searchInput: {
    flex: 1,
    paddingVertical: hp(0.8),
    fontSize: hp(1.6),
    color: '#333',
    fontFamily: Fonts.medium,
    minHeight: hp(3.5),           // smaller box
  },

  clearAllBtn: {
    alignSelf: 'flex-end',
    marginBottom: hp(1),
  },
  clearAllText: {
    color: COLORS.red,
    fontSize: hp(1.7),
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: hp(1.5),
    fontFamily: Fonts.medium,
    color: COLORS.textHeading,
    marginTop: hp(1),
    marginBottom: hp(1),
  },

  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f2f2',
    padding: wp(2),
    margin: hp(0.5),
    marginVertical: hp(0.9),
    borderRadius: wp(3),
    elevation: 1,
    alignItems: 'center',
  },
  notifImage: {
    width: wp(12),                 // slightly smaller image
    height: wp(12),
    borderRadius: wp(2),
    marginRight: wp(3),
  },
  notifTitle: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: hp(0.2),
  },
  notifMessage: {
    fontSize: hp(1.4),
    color: '#666',
  },
  notifTime: {
    fontSize: hp(1.4),
    color: '#999',
    alignSelf: 'flex-start',
  },
  notifContent: {
    flex: 1,
  },
  deleteBtn: {
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(15),
    marginVertical: hp(0.5),
    borderTopRightRadius: wp(3),
    borderBottomRightRadius: wp(3),
  },
  trashIcon: {
    width: wp(6),
    height: wp(6),
    tintColor: '#fff',
  },
  list: {
    paddingBottom: hp(8),
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  bellContainer: {
    position: 'relative',
    marginBottom: hp(3),
  },
  bellImage: {
    width: wp(30),
    height: wp(30),
    resizeMode: 'contain',
  },
  badge: {
    position: 'absolute',
    top: hp(3.4),
    right: wp(3),
    backgroundColor: COLORS.red,
    width: wp(8),
    height: wp(8),
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: hp(1.8),
    fontWeight: 'bold',
  },
  emptyTitle: {
    fontSize: hp(2),
    fontFamily: Fonts.semiBold,
    color: COLORS.red,
    marginBottom: hp(1),
  },
  emptySubtitle: {
    fontSize: hp(1.6),
    color: '#777',
    textAlign: 'center',
    lineHeight: hp(2.8),
  },
});

export default NotificationScreeen;
