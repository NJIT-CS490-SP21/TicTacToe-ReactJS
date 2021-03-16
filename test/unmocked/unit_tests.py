''' UNMOCKED UNIT TESTS '''

import unittest
import os
import sys
import copy

sys.path.append(os.path.abspath('../../'))
from app import DB
from app import Player
import models


KEY_USERLIST = 'user_list'
KEY_ADDING_USERNAME = 'adding username'
KEY_REMOVING_USERNAME = 'removing username'
KEY_EXPECTED = 'expected'

# [ ['X','X','X'],['O','O', None],[None,None,None] ] => ['X', [1,2,3] ]
class UserListLoginTestCase(unittest.TestCase):
    def setUp(self):
        self.successful_test_params = [
            {
                KEY_USERLIST: [],
                KEY_ADDING_USERNAME: 'JoeSmoe',
                KEY_EXPECTED: ['JoeSchmoe'],
            },
            {
                KEY_USERLIST: ['JoeSchmoe'],
                KEY_ADDING_USERNAME: 'Hello people',
                KEY_EXPECTED: ['JoeSchmoe', 'Hello people'],
            },
            {
                KEY_USERLIST: ['A', 'B', 'C'],
                KEY_ADDING_USERNAME: 'DEFG',
                KEY_EXPECTED: ['A', 'B', 'C', 'DEFG'],
            },
        ]
    
    def test_login_success(self):
        for test in self.successful_test_params:
            USERLIST = test[KEY_USERLIST]
            on_login( test[KEY_ADDING_USERNAME] )
            
            actual_result = USERLIST
            expected_result = test[KEY_EXPECTED]
            
            self.assertEquals(len(actual_result), len(expected_result))
            
            for i in range(len(actual_result)):
                self.assertEquals(actual_result[i], expected_result[i])
                
                
class UserListLogoutTestCase(unittest.TestCase):
    def setUp(self):
        self.successful_test_params = [
            {
                KEY_USERLIST: ['JoeSchmoe'],
                KEY_REMOVING_USERNAME: 'JoeSmoe',
                KEY_EXPECTED: [],
            },
            {
                KEY_USERLIST: ['JoeSchmoe', 'Hello people'],
                KEY_REMOVING_USERNAME: 'JoeSchmoe',
                KEY_EXPECTED: ['Hello people'],
            },
            {
                KEY_USERLIST: ['A', 'B', 'C', 'DEFG'],
                KEY_REMOVING_USERNAME: 'B',
                KEY_EXPECTED: ['A', 'C', 'DEFG'],
            },
        ]
    
    def test_logout_success(self):
        for test in self.successful_test_params:
            USERLIST = test[KEY_USERLIST]
            on_logout( test[KEY_REMOVING_USERNAME] )
            
            actual_result = USERLIST
            expected_result = test[KEY_EXPECTED]
            
            self.assertEquals(len(actual_result), len(expected_result))
            
            for i in range(len(actual_result)):
                self.assertEquals(actual_result[i], expected_result[i])

if __name__ == '__main__':
    unittest.main()