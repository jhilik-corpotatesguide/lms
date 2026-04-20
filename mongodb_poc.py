from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError

def main():
    try:
        # Connect to MongoDB (assuming local MongoDB is running on default port 27017)
        client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=5000)

        # Test connection
        client.admin.command('ping')
        print("Connected to MongoDB successfully.")

        # Select database and collection
        db = client['test_db']
        collection = db['test_collection']

        # Insert data
        data = {'name': 'Alice', 'age': 25, 'city': 'New York'}
        insert_result = collection.insert_one(data)
        print(f"Inserted document with ID: {insert_result.inserted_id}")

        # Fetch data
        fetched_doc = collection.find_one({'name': 'Alice'})
        if fetched_doc:
            print(f"Fetched document: {fetched_doc}")
        else:
            print("No document found")

        # Close connection
        client.close()

    except ServerSelectionTimeoutError as e:
        print("Could not connect to MongoDB. Please ensure MongoDB is installed and running on localhost:27017.")
        print(f"Error: {e}")

if __name__ == "__main__":
    main()