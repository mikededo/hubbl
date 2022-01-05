enum DTOGroups {
  ALL = 'all',
  CREATE = 'create',
  UPDATE = 'update'
}

/**
 * Defines the theme of the app that is being used
 */
enum AppTheme {
  DARK = 'DARK',
  LIGHT = 'LIGHT'
}

enum AppPalette {
  PEARL = '#94A3B8',
  GRAY = '#4A5568',
  RED = '#F56565',
  ORANGE = '#FBCF33',
  GREEN = '#68D391',
  EMERALD = '#34D399',
  TEAL = '#2DD4BF',
  BLUE = '#2196F3',
  INDIGO = '#818CF8',
  PURPLE = '#A78BFA',
  PINK = '#FB7185'
}

/**
 * Defines the different colors there are that the user can choose
 * as their primary color
 */
enum ThemeColor {
  GRAY = '#4A5568',
  RED = '#F56565',
  ORANGE = '#FBCF33',
  GREEN = '#68D391',
  BLUE = '#2196F3'
}

/**
 * Defines the possible values
 */
enum GymZoneIntervals {
  FIFTEEN = 15,
  THIRTEEN = 30,
  FOURTYFIVE = 45,
  HOUR = 60,
  HOURFIFTEEN = 75,
  HOURTHIRTY = 90,
  HOURFORTYFIVE = 105,
  HOURS = 120
}

enum Gender {
  MAN = 'MAN',
  WOMAN = 'WOMAN',
  OTHER = 'OTHER'
}

export {
  DTOGroups,
  AppPalette,
  AppTheme,
  Gender,
  GymZoneIntervals,
  ThemeColor
};
