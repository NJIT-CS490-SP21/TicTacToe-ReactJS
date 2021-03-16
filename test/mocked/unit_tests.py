''' MOCKED UNIT TESTS '''

import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys
import copy

sys.path.append(os.path.abspath('../../'))
from app import DB
from app import Player
import models

from app import add_user_to_database
KEY_INPUT = 'username'
KEY_EXPECTED = 'expected'

INITIAL_USERNAME = 'Joe Shmoe'
# [ ['X','X','X'],['O','O', None],[None,None,None] ] => ['X', [1,2,3] ]
class DatabaseAddUserTestCase(unittest.TestCase):
    def setUp(self):
        self.successful_test_params = [
            {
                KEY_INPUT: 'Big Boss',
                KEY_EXPECTED: [INITIAL_USERNAME, 'Big Boss'],
            },
            {
                KEY_INPUT: 'WhatsUpBro',
                KEY_EXPECTED: [INITIAL_USERNAME, 'WhatsUpBro'],
            },
            {
                KEY_INPUT: 'BrandoMando',
                KEY_EXPECTED: [INITIAL_USERNAME, 'BrandoMando'],
            },
        ]
        initial_player = Player(username=INITIAL_USERNAME, score=100)
        
        self.INITIAL_db_mock = [initial_player.username]
    
    def mocked_db_session_add(self, username):
        self.INITIAL_db_mock.append(username.username)
    
    def mocked_db_session_commit(self):
        return self.INITIAL_db_mock
    

    def test_add_user_success(self):
        print('Start of testing add_user_to_database')
        for test in self.successful_test_params:
            self.INITIAL_db_mock = [INITIAL_USERNAME]
            print('Start of test:')
            with patch('app.DB.session.add', self.mocked_db_session_add):
                with patch('app.DB.session.commit', self.mocked_db_session_commit):
       #             with patch('models.Player.query') as mocked_query:
    #                mocked_query.all = self.mocked_player_query_all()
                    add_user_to_database(test[KEY_INPUT])
                    actual_result = self.INITIAL_db_mock
                    expected_result = test[KEY_EXPECTED]
                    
                    print("\tA:",actual_result)
                    print("\tE:",expected_result)
                    print("\tM DB:",self.INITIAL_db_mock)
                    
                    # print("before asserts")
                    self.assertEqual(len(actual_result), len(expected_result))
                    for i in range(len(actual_result)):
                        self.assertEqual(actual_result[i], expected_result[i])
                    # print("after asserts")
            print('end of test\n')

from app import update_leaderboard_score
KEY_INPUT = 'input'
KEY_EXPECTED = 'expected'

INITIAL_USERS = ['A', 'B','C','D','E','F']
INITIAL_LEADERBOARD = [ ['A',105], ['B',103], ['C',101], ['D',99], ['E',97], ['F',95] ]

class UpdateScoreTestCase(unittest.TestCase):
    def setUp(self):
        self.successful_test_params = [
            {
                KEY_INPUT: 'X',
                KEY_EXPECTED: [['A', 106], ['B',102], ['C',101], ['D',99], ['E',97], ['F',95]],
            },
            {
                KEY_INPUT: 'O',
                KEY_EXPECTED: [['A',104], ['B',104], ['C',101], ['D',99], ['E',97], ['F',95]],
            },
            {
                KEY_INPUT: 'Tie',
                KEY_EXPECTED: [['A',105], ['B',103], ['C',101], ['D',99], ['E',97], ['F',95]],
            },
        ]
        self.initial_leaderboard = copy.deepcopy(INITIAL_LEADERBOARD)
    
    def mocked_winner_increment(self, index):
        self.initial_leaderboard[index][1] = self.initial_leaderboard[index][1] + 1
    
    def mocked_loser_decrement(self, index):
        self.initial_leaderboard[index][1] = self.initial_leaderboard[index][1] - 1
        
    def mocked_db_session_commit(self):
        pass
    
    def test_login_success(self):
        print('Start of testing update_leaderboard_score')
        for test in self.successful_test_params:
            # print("Before rest", self.initial_leaderboard)
            # print(INITIAL_LEADERBOARD)
            self.initial_leaderboard = copy.deepcopy(INITIAL_LEADERBOARD)
            # print("After reset", self.initial_leaderboard)
            # print(INITIAL_LEADERBOARD)
            
            print('Start of test:')
            with patch('app.winnerIncrement', self.mocked_winner_increment):
                with patch('app.loserDecrement', self.mocked_loser_decrement):
                    with patch('app.DB.session.commit', self.mocked_db_session_commit):
                        
                        update_leaderboard_score(test[KEY_INPUT]) # INPUT: 'X','O', or 'Tie'
                        actual_result = self.initial_leaderboard
                        expected_result = test[KEY_EXPECTED]
                        
                        print("\tA:",actual_result)
                        print("\tE:",expected_result)
                        print("\tM DB:",self.initial_leaderboard)
                        
                        # print("before asserts")
                        self.assertEqual(len(actual_result), len(expected_result))
                        for i in range(len(actual_result)):
                            self.assertEqual(actual_result[i], expected_result[i])
                        # print("after asserts")
                        
                    
            print('end of test\n')

if __name__ == '__main__':
    unittest.main()