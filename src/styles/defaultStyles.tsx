import {StyleSheet} from 'react-native';
import colors from './colors';
import typography from './typography';

const defaultStyles = StyleSheet.create({
  imgContainer: {
    flex: 1,
  },
  bgImg: {
    flex: 1,
    resizeMode: 'stretch',
  },
  mainHeading: {
    fontSize: typography.fontSizes.extraLarge,
    fontFamily: typography.fontFamilies.mullish,
    marginBottom: typography.fontSizes.large,
    textAlign: typography.alignments.center,
    color: colors.secondary,
  },

  subHeading: {
    fontSize: typography.fontSizes.medium,
    textAlign: typography.alignments.center,
    marginBottom: 40,
    color: colors.gray,
  },

  heading2: {
    fontSize: typography.fontSizes.regular,
    fontWeight: typography.fontWeights.regular700,
    fontFamily: typography.fontFamilies.mullish,
    color: colors.tertiary,
  },

  heading4: {
    fontSize: typography.fontSizes.size14,
    fontWeight: typography.fontWeights.regular700,
    fontFamily: typography.fontFamilies.mullish,
    color: colors.tertiary,
  },

  ticketTitle: {
    fontSize: typography.fontSizes.size14,
    fontWeight: typography.fontWeights.regular600,
    marginBottom: typography.fontSizes.size5,
    color: colors.black,
    fontFamily: typography.fontFamilies.mullish,
  },

  detailsTicketTitle: {
    fontSize: typography.fontSizes.size14,
    fontWeight: typography.fontWeights.regular700,
    marginBottom: typography.fontSizes.size5,
    color: colors.black,
    fontFamily: typography.fontFamilies.mullish,
  },

  ticketDescription: {
    fontSize: typography.fontSizes.small,
    fontWeight: typography.fontWeights.regular400,
    color: colors.gray,
    marginBottom: typography.fontSizes.size8,
    fontFamily: typography.fontFamilies.mullish,
  },

  mainContainer: {
    backgroundColor: colors.white,
    padding: typography.fontSizes.large,
    width: '100%',
    borderRadius: typography.fontSizes.size10,
    marginBottom: 30,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  primaryButton: {
    // backgroundColor: colors.primary,
    paddingVertical: typography.fontSizes.size14,
    // paddingHorizontal: typography.fontSizes.size30, // will look into this if it issue ever occurs
    borderRadius: typography.fontSizes.size8,
    alignItems: typography.alignments.center,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.size15,
    fontWeight: typography.fontWeights.regular600,
  },
  image: {
    width: 55,
    height: 55,
    marginBottom: typography.fontSizes.size10,
    alignSelf: 'center',
  },
  menuIcon: {
    height: 30,
    width: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: typography.alignments.center,
  },
  headerText: {
    color: colors.white,
    fontSize: typography.fontSizes.large,
    fontWeight: typography.fontWeights.bold,
    fontFamily: typography.fontFamilies.mullish,
  },
  ticketHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: typography.alignments.center,
    justifyContent: 'space-between',
  },
  ticketNo: {
    color: colors.tertiary,
    fontSize: 12,
    fontWeight: typography.fontWeights.regular700,
    fontFamily: typography.fontFamilies.mullish,
    alignSelf: typography.alignments.center,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginVertical: typography.fontSizes.size8,
    gap: 5,
  },
  badge: {
    borderRadius: typography.fontSizes.size5,
    paddingVertical: typography.fontSizes.size4,
    paddingHorizontal: typography.fontSizes.medium,
    fontSize: typography.fontSizes.small,
    overflow: 'hidden',
  },
  priorityBadge: {
    backgroundColor: colors.error,
    color: colors.black,
  },
  statusBadge: {
    backgroundColor: colors.grayHue,
    color: colors.black,
  },
  drawerHeading: {
    color: colors.black,
    fontSize: typography.fontSizes.large,
    fontWeight: typography.fontWeights.regular700,
    fontFamily: typography.fontFamilies.mullish,
    paddingVertical: typography.fontSizes.size10,
  },
  drawerItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: typography.alignments.center,
    gap: typography.fontSizes.size15,
    borderBottomColor: colors.lightGray,
    paddingVertical: typography.fontSizes.size15,
    borderBottomWidth: typography.fontSizes.size1,
  },
  drawerText: {
    fontFamily: typography.fontFamilies.mullish,
    fontWeight: typography.fontWeights.regular600,
    fontSize: typography.fontSizes.medium,
    color: colors.gray,
  },
  drawerIcon: {
    height: typography.fontSizes.extraLarge,
    width: typography.fontSizes.extraLarge,
  },
  drawerClose: {
    justifyContent: 'flex-end',
    display: 'flex',
    alignItems: 'flex-end',
    marginEnd: typography.fontSizes.size15,
  },
  itemInfo: {
    color: colors.gray,
    fontFamily: typography.fontFamilies.mullish,
  },
  ticketInfoContainer: {
    paddingVertical: typography.fontSizes.size10,
    borderTopWidth: typography.fontSizes.size1,
    borderTopColor: colors.grayHue,
    marginVertical: typography.fontSizes.size10,
  },
  innerContainer: {
    backgroundColor: colors.white,
    borderWidth: typography.fontSizes.size1,
    borderColor: colors.grayHue,
    marginVertical: typography.fontSizes.size10,
    padding: typography.fontSizes.size10,
    borderRadius: typography.fontSizes.size8,
  },
  notFoundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flex: 1,
    marginVertical: '20%',
    gap: 20,
  },
  imgStyles: {
    height: 250,
    width: 250,
  },
  notFoundHeading: {
    fontFamily: typography.fontFamilies.mullish,
    fontWeight: typography.fontWeights.regular700,
    fontSize: typography.fontSizes.large,
    textAlign: 'center',
  },
  notFoundDescription: {
    fontWeight: typography.fontWeights.regular400,
    fontSize: typography.fontSizes.size14,
    lineHeight: typography.fontSizes.regular,
    textAlign: 'center',
  },
});

export default defaultStyles;
