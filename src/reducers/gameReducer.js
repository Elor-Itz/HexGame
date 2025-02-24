// HexGame reducer
export const initialState = {
    game: null,
    ai: null,
    gameMode: 'sandbox',
    boardSize: 11,
    colorScheme: 'black-white',
    swapRuleEnabled: false,
    isLobbyVisible: true,
    isStatusVisible: true,
    status: '',
    currentPlayer: 'Player1',    
    playerColor: '',
    isBoardDisabled: false,
    isSurrenderDisabled: false,    
};

export const gameReducer = (state, action) => {
    switch (action.type) {
        case 'INITIALIZE_GAME':
            return {
                ...state,
                game: action.payload.game,
                ai: action.payload.ai,
                gameMode: action.payload.gameMode,
                boardSize: action.payload.boardSize,
                swapRuleEnabled: action.payload.swapRule,
                colorScheme: action.payload.colorScheme,
                isLobbyVisible: false,
                isStatusVisible: true,
                currentPlayer: action.payload.currentPlayer,                
                playerColor: action.payload.playerColor,
            };
        case 'AI_TURN':
            return {
                ...state,
                isBoardDisabled: true,
                isSurrenderDisabled: true,
            };        
        case 'UPDATE_PLAYER':
            return {
                ...state,                
                currentPlayer: action.payload.currentPlayer,
                playerColor: action.payload.playerColor,
            };
        case 'UPDATE_STATUS':
            return {
                ...state,
                status: action.payload.status,
                isBoardDisabled: action.payload.isBoardDisabled,
                isSurrenderDisabled: action.payload.isSurrenderDisabled,
            };        
        case 'RESET_GAME':
            return initialState;
        default:
            return state;
    }
};