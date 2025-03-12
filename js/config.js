// Game configuration and constants
const CONFIG = {
    // Game settings
    MAX_ATTEMPTS: 5,
    MAX_DRAG_DISTANCE: 150,
    
    // Canvas dimensions
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 400,
    
    // Animation durations
    GOALKEEPER_ANIMATION_DURATION: 500,
    BALL_ANIMATION_BASE_DURATION: 1000,
    
    // Field dimensions
    PENALTY_AREA_WIDTH_RATIO: 0.5,
    PENALTY_AREA_HEIGHT_RATIO: 0.667,
    CENTER_CIRCLE_RATIO: 0.25,
    
    // Goal dimensions
    GOAL_WIDTH_RATIO: 0.5,
    GOAL_HEIGHT_RATIO: 0.3,
    GOAL_Y_POSITION_RATIO: 0.1,
    GOAL_POST_WIDTH: 10,
    
    // Ball settings
    BALL_RADIUS: 15,
    BALL_Y_POSITION_RATIO: 0.75,
    
    // Goalkeeper settings
    GOALKEEPER_WIDTH: 60,
    GOALKEEPER_HEIGHT: 80,
    GOALKEEPER_Y_POSITION_RATIO: 0.2,
    GOALKEEPER_REACTION_TIME: 300, // milliseconds to react to shot
    GOALKEEPER_DIFFICULTY_EASY: 0.3, // probability of making a save on easy
    GOALKEEPER_DIFFICULTY_MEDIUM: 0.5, // probability of making a save on medium
    GOALKEEPER_DIFFICULTY_HARD: 0.7 // probability of making a save on hard
};

export default CONFIG; 