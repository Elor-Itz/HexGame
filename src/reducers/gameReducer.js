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
            };
        case 'AI_TURN':
            return {
                ...state,
                isBoardDisabled: true,
                isSurrenderDisabled: true,
            };
        case 'UPDATE_GAME':
            return {
                ...state,
                currentPlayer: action.payload.currentPlayer,                
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