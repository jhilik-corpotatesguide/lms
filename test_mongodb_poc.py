import unittest
from unittest.mock import Mock, patch, MagicMock
from mongodb_poc import main

class TestMongoDBPOC(unittest.TestCase):
    """Test cases for MongoDB POC"""

    @patch('mongodb_poc.MongoClient')
    def test_successful_connection_and_insert(self, mock_client_class):
        """Test successful MongoDB connection and data insertion"""
        # Mock the MongoDB client
        mock_client = MagicMock()
        mock_client_class.return_value = mock_client
        
        # Mock the database and collection
        mock_collection = MagicMock()
        mock_db = MagicMock()
        mock_client.__getitem__.return_value = mock_db
        mock_db.__getitem__.return_value = mock_collection
        
        # Mock insert_one
        mock_insert_result = MagicMock()
        mock_insert_result.inserted_id = "507f1f77bcf86cd799439011"
        mock_collection.insert_one.return_value = mock_insert_result
        
        # Mock find_one
        mock_collection.find_one.return_value = {
            '_id': '507f1f77bcf86cd799439011',
            'name': 'Alice',
            'age': 25,
            'city': 'New York'
        }
        
        # Call main
        main()
        
        # Assertions
        mock_client_class.assert_called_once()
        mock_collection.insert_one.assert_called_once_with({
            'name': 'Alice',
            'age': 25,
            'city': 'New York'
        })
        mock_collection.find_one.assert_called_once_with({'name': 'Alice'})
        mock_client.close.assert_called_once()

    @patch('mongodb_poc.MongoClient')
    def test_insert_data_structure(self, mock_client_class):
        """Test that correct data structure is inserted"""
        mock_client = MagicMock()
        mock_client_class.return_value = mock_client
        
        mock_collection = MagicMock()
        mock_db = MagicMock()
        mock_client.__getitem__.return_value = mock_db
        mock_db.__getitem__.return_value = mock_collection
        
        mock_insert_result = MagicMock()
        mock_insert_result.inserted_id = "test_id"
        mock_collection.insert_one.return_value = mock_insert_result
        
        mock_collection.find_one.return_value = {
            'name': 'Alice',
            'age': 25,
            'city': 'New York'
        }
        
        main()
        
        # Verify the data inserted has correct structure
        call_args = mock_collection.insert_one.call_args
        inserted_data = call_args[0][0]
        
        self.assertIn('name', inserted_data)
        self.assertIn('age', inserted_data)
        self.assertIn('city', inserted_data)
        self.assertEqual(inserted_data['name'], 'Alice')
        self.assertEqual(inserted_data['age'], 25)
        self.assertEqual(inserted_data['city'], 'New York')

    @patch('mongodb_poc.MongoClient')
    def test_fetch_correct_data(self, mock_client_class):
        """Test that fetched data is correct"""
        mock_client = MagicMock()
        mock_client_class.return_value = mock_client
        
        mock_collection = MagicMock()
        mock_db = MagicMock()
        mock_client.__getitem__.return_value = mock_db
        mock_db.__getitem__.return_value = mock_collection
        
        mock_insert_result = MagicMock()
        mock_insert_result.inserted_id = "test_id"
        mock_collection.insert_one.return_value = mock_insert_result
        
        expected_doc = {
            '_id': 'test_id',
            'name': 'Alice',
            'age': 25,
            'city': 'New York'
        }
        mock_collection.find_one.return_value = expected_doc
        
        main()
        
        # Verify find_one was called with correct filter
        mock_collection.find_one.assert_called_with({'name': 'Alice'})

    @patch('mongodb_poc.MongoClient')
    def test_connection_error_handling(self, mock_client_class):
        """Test that connection errors are handled gracefully"""
        from pymongo.errors import ServerSelectionTimeoutError
        
        mock_client_class.side_effect = ServerSelectionTimeoutError("Connection refused")
        
        # Should not raise an exception
        try:
            main()
        except Exception as e:
            self.fail(f"main() raised {type(e).__name__} unexpectedly!")

    def test_data_validation(self):
        """Test data validation for inserted document"""
        test_data = {'name': 'Alice', 'age': 25, 'city': 'New York'}
        
        # Validate required fields exist
        self.assertIn('name', test_data)
        self.assertIn('age', test_data)
        self.assertIn('city', test_data)
        
        # Validate data types
        self.assertIsInstance(test_data['name'], str)
        self.assertIsInstance(test_data['age'], int)
        self.assertIsInstance(test_data['city'], str)
        
        # Validate data values are not empty
        self.assertTrue(test_data['name'])
        self.assertTrue(test_data['city'])
        self.assertGreater(test_data['age'], 0)

if __name__ == '__main__':
    unittest.main(verbosity=2)
