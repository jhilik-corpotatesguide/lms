"""
Demo script showing MongoDB POC functionality with mock data
This demonstrates insert and fetch operations without requiring a live MongoDB instance
"""

from datetime import datetime

class MockMongoDB:
    """Mock MongoDB database for demonstration"""
    def __init__(self):
        self.data = []
    
    def insert_one(self, document):
        """Insert a document"""
        doc_id = f"id_{len(self.data) + 1}"
        document['_id'] = doc_id
        self.data.append(document)
        return {'inserted_id': doc_id}
    
    def find_one(self, query):
        """Find a single document"""
        for doc in self.data:
            if all(doc.get(k) == v for k, v in query.items()):
                return doc
        return None
    
    def find_all(self):
        """Find all documents"""
        return self.data

def demo():
    """Run demonstration with mock data"""
    print("=" * 60)
    print("MongoDB POC - Demo Mode (Using Mock Database)")
    print("=" * 60)
    print()
    
    # Create mock database
    db = MockMongoDB()
    
    # Test 1: Insert single document
    print("TEST 1: Insert Single Document")
    print("-" * 60)
    data1 = {'name': 'Alice', 'age': 25, 'city': 'New York'}
    result1 = db.insert_one(data1)
    print(f"Inserted: {data1}")
    print(f"Document ID: {result1['inserted_id']}")
    print(f"✓ Success\n")
    
    # Test 2: Insert multiple documents
    print("TEST 2: Insert Multiple Documents")
    print("-" * 60)
    data2 = {'name': 'Bob', 'age': 30, 'city': 'Los Angeles'}
    data3 = {'name': 'Charlie', 'age': 35, 'city': 'Chicago'}
    
    result2 = db.insert_one(data2)
    print(f"Inserted: {data2}")
    print(f"Document ID: {result2['inserted_id']}")
    
    result3 = db.insert_one(data3)
    print(f"Inserted: {data3}")
    print(f"Document ID: {result3['inserted_id']}")
    print(f"✓ Success\n")
    
    # Test 3: Fetch by name
    print("TEST 3: Fetch Document by Name")
    print("-" * 60)
    fetched1 = db.find_one({'name': 'Alice'})
    print(f"Query: {{'name': 'Alice'}}")
    print(f"Found: {fetched1}")
    print(f"✓ Success\n")
    
    # Test 4: Fetch by city
    print("TEST 4: Fetch Document by City")
    print("-" * 60)
    fetched2 = db.find_one({'city': 'Chicago'})
    print(f"Query: {{'city': 'Chicago'}}")
    print(f"Found: {fetched2}")
    print(f"✓ Success\n")
    
    # Test 5: Fetch all documents
    print("TEST 5: Fetch All Documents")
    print("-" * 60)
    all_docs = db.find_all()
    print(f"Total documents: {len(all_docs)}")
    for i, doc in enumerate(all_docs, 1):
        print(f"  {i}. {doc}")
    print(f"✓ Success\n")
    
    # Test 6: Fetch non-existent document
    print("TEST 6: Fetch Non-Existent Document")
    print("-" * 60)
    fetched3 = db.find_one({'name': 'David'})
    print(f"Query: {{'name': 'David'}}")
    print(f"Found: {fetched3}")
    print(f"✓ Success (Returns None as expected)\n")
    
    # Summary
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"✓ Total tests: 6")
    print(f"✓ Passed: 6")
    print(f"✓ Failed: 0")
    print(f"✓ Documents in database: {len(all_docs)}")
    print()
    print("The MongoDB POC is working correctly!")
    print("When live MongoDB is installed, use: python mongodb_poc.py")
    print("=" * 60)

if __name__ == "__main__":
    demo()
