// src/data/constraint-examples.ts

export interface ConstraintExample {
  id: string
  template: 'template1' | 'template2' | 'template3'
  templateName: string
  naturalLanguageQuery: string
  parsedConstraint: string
  parameters: Record<string, any>
  description: string
}

export const constraintExamples: ConstraintExample[] = [
  // Template 1: Game Scheduling Constraints (8 examples)
  {
    id: 't1-001',
    template: 'template1',
    templateName: 'Template 1: Game Scheduling Constraints',
    naturalLanguageQuery: 'Ensure all rivalry games on a weekend on ESPN',
    parsedConstraint: 'Ensure that at least 1 and at most 999 games from rivalry_games are scheduled across weekend_rounds and played in any venue from all_venues and assigned to any of ESPN.',
    parameters: {
      min: 1,
      max: 999,
      games: ['rivalry_games'],
      rounds: ['weekend_rounds'],
      venues: ['all_venues'],
      networks: ['ESPN']
    },
    description: 'Schedule all rivalry games on weekends and broadcast on ESPN'
  },
  {
    id: 't1-002',
    template: 'template1',
    templateName: 'Template 1: Game Scheduling Constraints',
    naturalLanguageQuery: "Don't schedule high profile games on a weekday",
    parsedConstraint: 'Ensure that at least 0 and at most 0 games from high_profile_games are scheduled across weekday_rounds and played in any venue from all_venues and assigned to any of all_networks.',
    parameters: {
      min: 0,
      max: 0,
      games: ['high_profile_games'],
      rounds: ['weekday_rounds'],
      venues: ['all_venues'],
      networks: ['all_networks']
    },
    description: 'Prevent high profile games from being scheduled on weekdays'
  },
  {
    id: 't1-003',
    template: 'template1',
    templateName: 'Template 1: Game Scheduling Constraints',
    naturalLanguageQuery: 'At least 2 of UTN@VU, ALA@AU, MSU@UM should all be scheduled on the final 2 dates of the season and on either CBS or ESPN',
    parsedConstraint: 'Ensure that at least 2 and at most 3 games from [UTN@VU, ALA@AU, MSU@UM] are scheduled across final_2_rounds and played in any venue from all_venues and assigned to any of [CBS, ESPN].',
    parameters: {
      min: 2,
      max: 3,
      games: ['UTN@VU', 'ALA@AU', 'MSU@UM'],
      rounds: ['final_2_rounds'],
      venues: ['all_venues'],
      networks: ['CBS', 'ESPN']
    },
    description: 'Schedule at least 2 of 3 specific matchups in final 2 rounds on CBS or ESPN'
  },
  {
    id: 't1-004',
    template: 'template1',
    templateName: 'Template 1: Game Scheduling Constraints',
    naturalLanguageQuery: 'Make sure UTN, UK, USC, LSU do not have any weekday byes',
    parsedConstraint: 'Ensure that at least 0 and at most 0 games from [UTN_bye, UK_bye, USC_bye, LSU_bye] are scheduled across weekday_rounds and played in any venue from all_venues and assigned to any of all_networks.',
    parameters: {
      min: 0,
      max: 0,
      games: ['UTN_bye', 'UK_bye', 'USC_bye', 'LSU_bye'],
      rounds: ['weekday_rounds'],
      venues: ['all_venues'],
      networks: ['all_networks']
    },
    description: 'Prevent specific teams from having byes on weekdays'
  },
  {
    id: 't1-005',
    template: 'template1',
    templateName: 'Template 1: Game Scheduling Constraints',
    naturalLanguageQuery: 'All primetime games must be on FOX, NBC, or ABC',
    parsedConstraint: 'Ensure that at least 1 and at most 999 games from primetime_games are scheduled across all_rounds and played in any venue from all_venues and assigned to any of [FOX, NBC, ABC].',
    parameters: {
      min: 1,
      max: 999,
      games: ['primetime_games'],
      rounds: ['all_rounds'],
      venues: ['all_venues'],
      networks: ['FOX', 'NBC', 'ABC']
    },
    description: 'Assign all primetime games to major broadcast networks'
  },
  {
    id: 't1-006',
    template: 'template1',
    templateName: 'Template 1: Game Scheduling Constraints',
    naturalLanguageQuery: 'Schedule at least 3 conference championship games in neutral venues',
    parsedConstraint: 'Ensure that at least 3 and at most 999 games from conference_championship_games are scheduled across all_rounds and played in any venue from neutral_venues and assigned to any of all_networks.',
    parameters: {
      min: 3,
      max: 999,
      games: ['conference_championship_games'],
      rounds: ['all_rounds'],
      venues: ['neutral_venues'],
      networks: ['all_networks']
    },
    description: 'Require minimum number of conference championships at neutral sites'
  },
  {
    id: 't1-007',
    template: 'template1',
    templateName: 'Template 1: Game Scheduling Constraints',
    naturalLanguageQuery: 'No more than 2 Thursday night games in the first month',
    parsedConstraint: 'Ensure that at least 0 and at most 2 games from all_games are scheduled across thursday_rounds_month1 and played in any venue from all_venues and assigned to any of all_networks.',
    parameters: {
      min: 0,
      max: 2,
      games: ['all_games'],
      rounds: ['thursday_rounds_month1'],
      venues: ['all_venues'],
      networks: ['all_networks']
    },
    description: 'Limit Thursday night games in early season'
  },
  {
    id: 't1-008',
    template: 'template1',
    templateName: 'Template 1: Game Scheduling Constraints',
    naturalLanguageQuery: 'Exactly 1 Super Bowl game on CBS in the final round',
    parsedConstraint: 'Ensure that at least 1 and at most 1 games from super_bowl_game are scheduled across final_round and played in any venue from all_venues and assigned to any of CBS.',
    parameters: {
      min: 1,
      max: 1,
      games: ['super_bowl_game'],
      rounds: ['final_round'],
      venues: ['all_venues'],
      networks: ['CBS']
    },
    description: 'Specify exact championship game broadcast requirements'
  },

  // Template 2: Sequence Constraints (6 examples)
  {
    id: 't2-001',
    template: 'template2',
    templateName: 'Template 2: Sequence Constraints',
    naturalLanguageQuery: 'Make sure Oregon, Washington, UCLA, USC do not play at home on either side of their bye week',
    parsedConstraint: 'Ensure at least 0 and at most 0 cases where there is a sequence home_game, bye, home_game OR bye, home_game for teams [Oregon, Washington, UCLA, USC].',
    parameters: {
      min: 0,
      max: 0,
      teams: ['Oregon', 'Washington', 'UCLA', 'USC'],
      sequence: [['home_game', 'bye', 'home_game'], ['bye', 'home_game']],
      rounds: ['all_rounds']
    },
    description: 'Prevent home games immediately before or after bye weeks'
  },
  {
    id: 't2-002',
    template: 'template2',
    templateName: 'Template 2: Sequence Constraints',
    naturalLanguageQuery: 'Make sure Penn State plays at UCLA and at USC in back-to-back weeks in the second half of the season',
    parsedConstraint: 'Ensure at least 1 and at most 1 cases where there is a sequence PSU@UCLA, PSU@USC across rounds second_half_season.',
    parameters: {
      min: 1,
      max: 1,
      teams: ['Penn State'],
      sequence: [['PSU@UCLA', 'PSU@USC']],
      rounds: ['second_half_season']
    },
    description: 'Schedule consecutive away games at specific opponents'
  },
  {
    id: 't2-003',
    template: 'template2',
    templateName: 'Template 2: Sequence Constraints',
    naturalLanguageQuery: 'No team should have three consecutive away games',
    parsedConstraint: 'Ensure at least 0 and at most 0 cases where there is a sequence away_game, away_game, away_game across all rounds.',
    parameters: {
      min: 0,
      max: 0,
      teams: ['all_teams'],
      sequence: [['away_game', 'away_game', 'away_game']],
      rounds: ['all_rounds']
    },
    description: 'Prevent excessive consecutive away games for any team'
  },
  {
    id: 't2-004',
    template: 'template2',
    templateName: 'Template 2: Sequence Constraints',
    naturalLanguageQuery: 'Alabama must have a bye before playing LSU',
    parsedConstraint: 'Ensure at least 1 and at most 1 cases where there is a sequence bye, ALA@LSU OR bye, LSU@ALA across all rounds.',
    parameters: {
      min: 1,
      max: 1,
      teams: ['Alabama'],
      sequence: [['bye', 'ALA@LSU'], ['bye', 'LSU@ALA']],
      rounds: ['all_rounds']
    },
    description: 'Require bye week before specific matchup'
  },
  {
    id: 't2-005',
    template: 'template2',
    templateName: 'Template 2: Sequence Constraints',
    naturalLanguageQuery: 'All teams must start the season with a home game followed by an away game',
    parsedConstraint: 'Ensure at least 1 and at most 1 cases where there is a sequence home_game, away_game across rounds [round_1, round_2].',
    parameters: {
      min: 1,
      max: 1,
      teams: ['all_teams'],
      sequence: [['home_game', 'away_game']],
      rounds: ['round_1', 'round_2']
    },
    description: 'Enforce home-away pattern at season start'
  },
  {
    id: 't2-006',
    template: 'template2',
    templateName: 'Template 2: Sequence Constraints',
    naturalLanguageQuery: 'Michigan and Ohio State should not play back-to-back home games in November',
    parsedConstraint: 'Ensure at least 0 and at most 0 cases where there is a sequence home_game, home_game across november_rounds for teams [Michigan, Ohio State].',
    parameters: {
      min: 0,
      max: 0,
      teams: ['Michigan', 'Ohio State'],
      sequence: [['home_game', 'home_game']],
      rounds: ['november_rounds']
    },
    description: 'Prevent consecutive home games in specific month'
  },

  // Template 3: Team Schedule Pattern Constraints (6 examples)
  {
    id: 't3-001',
    template: 'template3',
    templateName: 'Template 3: Team Schedule Pattern Constraints',
    naturalLanguageQuery: 'No cases of 3 games in 3 nights for any NBA team',
    parsedConstraint: 'Ensure that each of teams in all_teams have at least 0 and at most 0 instances where they play at least 3 and at most 3 active games across 3 consecutive rounds.',
    parameters: {
      quantifier: 'each of',
      teams: ['all_teams'],
      min: 0,
      max: 0,
      k: 3,
      m: 3,
      gameType: 'active',
      rounds: ['3_consecutive_rounds'],
      networks: ['all_networks'],
      venues: ['all_venues']
    },
    description: 'Prevent back-to-back-to-back games for player safety'
  },
  {
    id: 't3-002',
    template: 'template3',
    templateName: 'Template 3: Team Schedule Pattern Constraints',
    naturalLanguageQuery: 'No cases of 5 away games in 7 nights after the all star break',
    parsedConstraint: 'Ensure that each of teams in all_teams have at least 0 and at most 0 instances where they play at least 5 and at most 5 away games across any 7 consecutive rounds after all_star_break.',
    parameters: {
      quantifier: 'each of',
      teams: ['all_teams'],
      min: 0,
      max: 0,
      k: 5,
      m: 5,
      gameType: 'away',
      rounds: ['any_7_consecutive_post_allstar'],
      networks: ['all_networks'],
      venues: ['all_venues']
    },
    description: 'Limit extended away stretches after all-star break'
  },
  {
    id: 't3-003',
    template: 'template3',
    templateName: 'Template 3: Team Schedule Pattern Constraints',
    naturalLanguageQuery: 'At most 2 cases of 3 away games in 4 rounds for Western Conference teams',
    parsedConstraint: 'Ensure that each of teams in western_conference have at least 0 and at most 2 instances where they play at least 3 and at most 3 away games across any 4 consecutive rounds.',
    parameters: {
      quantifier: 'each of',
      teams: ['western_conference'],
      min: 0,
      max: 2,
      k: 3,
      m: 3,
      gameType: 'away',
      rounds: ['any_4_consecutive_rounds'],
      networks: ['all_networks'],
      venues: ['all_venues']
    },
    description: 'Limit frequency of road-heavy stretches for conference'
  },
  {
    id: 't3-004',
    template: 'template3',
    templateName: 'Template 3: Team Schedule Pattern Constraints',
    naturalLanguageQuery: 'Every team must have at least 2 primetime games on national TV',
    parsedConstraint: 'Ensure that each of teams in all_teams have at least 2 and at most 999 instances where they play at least 1 and at most 1 active games assigned to any of [FOX, NBC, CBS, ABC, ESPN].',
    parameters: {
      quantifier: 'each of',
      teams: ['all_teams'],
      min: 2,
      max: 999,
      k: 1,
      m: 1,
      gameType: 'active',
      rounds: ['all_rounds'],
      networks: ['FOX', 'NBC', 'CBS', 'ABC', 'ESPN'],
      venues: ['all_venues']
    },
    description: 'Guarantee minimum national TV exposure for all teams'
  },
  {
    id: 't3-005',
    template: 'template3',
    templateName: 'Template 3: Team Schedule Pattern Constraints',
    naturalLanguageQuery: 'All playoff teams should have no more than 1 bye in the final 6 weeks',
    parsedConstraint: 'Ensure that each of teams in playoff_teams have at least 0 and at most 1 instances where they have at least 1 and at most 1 bye games across final_6_rounds.',
    parameters: {
      quantifier: 'each of',
      teams: ['playoff_teams'],
      min: 0,
      max: 1,
      k: 1,
      m: 1,
      gameType: 'bye',
      rounds: ['final_6_rounds'],
      networks: ['all_networks'],
      venues: ['all_venues']
    },
    description: 'Limit bye weeks for playoff contenders late in season'
  },
  {
    id: 't3-006',
    template: 'template3',
    templateName: 'Template 3: Team Schedule Pattern Constraints',
    naturalLanguageQuery: 'Each division winner must play at least 4 home games in the last 8 weeks',
    parsedConstraint: 'Ensure that each of teams in division_winners have at least 1 and at most 999 instances where they play at least 4 and at most 8 home games across final_8_rounds.',
    parameters: {
      quantifier: 'each of',
      teams: ['division_winners'],
      min: 1,
      max: 999,
      k: 4,
      m: 8,
      gameType: 'home',
      rounds: ['final_8_rounds'],
      networks: ['all_networks'],
      venues: ['all_venues']
    },
    description: 'Ensure home-field advantage for division leaders'
  }
]

export const getExamplesByTemplate = (template: string) => {
  return constraintExamples.filter(ex => ex.template === template)
}

export const getExampleById = (id: string) => {
  return constraintExamples.find(ex => ex.id === id)
}
